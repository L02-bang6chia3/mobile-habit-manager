using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Calendar.v3;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.Models;

namespace MobileApi.Services;

public interface IGoogleCalendarService
{
    string GetAuthUrl(Guid userId);
    string GetLoginUrl();
    Task<bool> ExchangeCodeForTokenAsync(Guid userId, string code);
    Task<Google.Apis.Oauth2.v2.Data.Userinfo?> GetGoogleUserInfoAsync(string code);
    Task<CalendarService?> GetCalendarServiceAsync(Guid userId);
}


public class GoogleCalendarService(ApplicationDbContext dbContext) : IGoogleCalendarService
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly string _clientId = Environment.GetEnvironmentVariable("Google__ClientId") ?? string.Empty;
    private readonly string _clientSecret = Environment.GetEnvironmentVariable("Google__ClientSecret") ?? string.Empty;
    private readonly string _redirectUri = $"{Environment.GetEnvironmentVariable("Google__RedirectBaseUrl")}/api/google/callback";

    // Tạo luồng xác thực OAuth2 từ Google
    private GoogleAuthorizationCodeFlow CreateFlow()
    {
        return new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = _clientId,
                ClientSecret = _clientSecret
            },
            Scopes = new[] { CalendarService.Scope.Calendar },
            DataStore = null // Tự lưu token vào DB
        });
    }

    // Tạo URL để user đăng nhập Google
    public string GetAuthUrl(Guid userId) 
    {
        var flow = CreateFlow();
        var requestUrl = new Google.Apis.Auth.OAuth2.Requests.GoogleAuthorizationCodeRequestUrl(new Uri(flow.AuthorizationServerUrl))
        {
            ClientId = _clientId,
            RedirectUri = _redirectUri,
            Scope = string.Join(" ", flow.Scopes),
            AccessType = "offline",     // Có refresh token
            Prompt = "consent",
            State = userId.ToString()   // Gửi userId để nhận biết khi quay lại
        };
        return requestUrl.Build().ToString();
    }

    // Tạo URL để đăng nhập bằng Google (Social Login)
    public string GetLoginUrl()
    {
        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets { ClientId = _clientId, ClientSecret = _clientSecret },
            Scopes = new[] { "openid", "email", "profile" }
        });

        var requestUrl = new Google.Apis.Auth.OAuth2.Requests.GoogleAuthorizationCodeRequestUrl(new Uri(flow.AuthorizationServerUrl))
        {
            ClientId = _clientId,
            RedirectUri = _redirectUri.Replace("/callback", "/login-callback"), // Dùng callback khác cho login
            Scope = string.Join(" ", flow.Scopes),
            AccessType = "offline",
            Prompt = "consent"
        };
        return requestUrl.Build().ToString();
    }


    // Đổi code lấy token từ Google
    public async Task<bool> ExchangeCodeForTokenAsync(Guid userId, string code)
    {
        var flow = CreateFlow();
        
        // Bước 1: Đổi code lấy Access Token từ Google
        TokenResponse token = await flow.ExchangeCodeForTokenAsync(
            userId.ToString(), 
            code, 
            _redirectUri, 
            CancellationToken.None
        );
        if (token == null) return false;

        // Bước 2: Tìm hoặc tạo bản ghi tích hợp Google của User
        var integration = await _dbContext.UserIntegrations
            .FirstOrDefaultAsync(ui => ui.UserId == userId && ui.Provider == "GoogleCalendar");

        if (integration == null)
        {
            integration = new UserIntegration
            {
                UserId = userId,
                Provider = "GoogleCalendar"
            };
            _dbContext.UserIntegrations.Add(integration);
        }

        // Bước 3: Cập nhật token
        integration.AccessToken = token.AccessToken;
        if (!string.IsNullOrEmpty(token.RefreshToken))
        {
            integration.RefreshToken = token.RefreshToken;  // Chỉ cập nhật nếu Google trả về
        }
        integration.ExpiryDate = DateTime.UtcNow.AddSeconds(token.ExpiresInSeconds ?? 3600);

        // Lưu vào Database
        await _dbContext.SaveChangesAsync();
        return true;
    }

    // Đổi code lấy thông tin Profile của User
    public async Task<Userinfo?> GetGoogleUserInfoAsync(string code)
    {
        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets { ClientId = _clientId, ClientSecret = _clientSecret },
            Scopes = new[] { "openid", "email", "profile" }
        });

        var loginRedirectUri = _redirectUri.Replace("/callback", "/login-callback");

        TokenResponse token = await flow.ExchangeCodeForTokenAsync(
            "user", 
            code, 
            loginRedirectUri, 
            CancellationToken.None
        );

        if (token == null) return null;

        var credential = new UserCredential(flow, "user", token);
        var oauthService = new Oauth2Service(new Google.Apis.Services.BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "ORBIT Habit Manager"
        });

        return await oauthService.Userinfo.Get().ExecuteAsync();
    }

    // Lấy Google Calendar Service đã được xác thực (tự động refresh nếu hết hạn)
    public async Task<CalendarService?> GetCalendarServiceAsync(Guid userId)
    {
        var integration = await _dbContext.UserIntegrations
            .FirstOrDefaultAsync(ui => ui.UserId == userId && ui.Provider == "GoogleCalendar");

        if (integration == null || string.IsNullOrEmpty(integration.AccessToken))
            return null;

        var flow = CreateFlow();
        
        // Tạo TokenResponse từ dữ liệu trong DB
        var tokenResponse = new TokenResponse
        {
            AccessToken = integration.AccessToken,
            RefreshToken = integration.RefreshToken,
            ExpiresInSeconds = (long?)(integration.ExpiryDate - DateTime.UtcNow).TotalSeconds
        };

        // Kiểm tra nếu token hết hạn (hoặc sắp hết hạn trong 1 phút)
        if (integration.ExpiryDate <= DateTime.UtcNow.AddMinutes(1))
        {
            if (string.IsNullOrEmpty(integration.RefreshToken)) return null;

            try
            {
                // Refresh token từ Google
                tokenResponse = await flow.RefreshTokenAsync(userId.ToString(), integration.RefreshToken, CancellationToken.None);
                
                // Cập nhật lại vào DB
                integration.AccessToken = tokenResponse.AccessToken;
                if (!string.IsNullOrEmpty(tokenResponse.RefreshToken))
                {
                    integration.RefreshToken = tokenResponse.RefreshToken;
                }
                integration.ExpiryDate = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresInSeconds ?? 3600);
                
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                return null; // Có lỗi khi refresh (ví dụ user đã thu hồi quyền)
            }
        }

        // Tạo UserCredential
        var credential = new UserCredential(flow, userId.ToString(), tokenResponse);

        // Khởi tạo CalendarService
        return new CalendarService(new Google.Apis.Services.BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "ORBIT Habit Manager"
        });
    }
}
