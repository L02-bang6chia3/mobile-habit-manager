using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

// ⚠️ LƯU Ý: Biến 'env' được inject từ IWebHostEnvironment (DI tự động).
// Hành vi của callback thay đổi tùy môi trường:
//   - Development (launchSettings.json): Trả về JSON để test Swagger dễ dàng.
//   - Production (server thật): Redirect về Deep Link của Mobile App.
// Để chuyển sang Production, đổi ASPNETCORE_ENVIRONMENT=Production trong biến môi trường server.
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService, IWebHostEnvironment env) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var userId = await _authService.RegisterAsync(request);
        return StatusCode(StatusCodes.Status201Created, new { data = userId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request);
        return Ok(new { data = token });
    }

    // Lấy URL để đăng nhập bằng Google (Social Login)
    [HttpGet("google-login-url")]
    public IActionResult GetGoogleLoginUrl([FromServices] IGoogleCalendarService googleCalendarService)
    {
        var url = googleCalendarService.GetLoginUrl();
        return Ok(new { data = url });
    }

    // Google gọi về sau khi User đăng nhập thành công
    [HttpGet("login-callback")]
    public async Task<IActionResult> GoogleLoginCallback([FromQuery] string code, [FromServices] IConfiguration configuration)
    {
        if (string.IsNullOrEmpty(code)) return BadRequest("Thiếu mã xác thực từ Google.");

        // Đổi code lấy JWT của hệ thống ORBIT
        var token = await _authService.LoginWithGoogleAsync(code);
        
        // Điều hướng về App kèm theo Token
        var postAuthRedirect = configuration["Google__PostAuthRedirect"] ?? "orbit://calendar/connected";
        var redirectUrl = $"{postAuthRedirect}?token={token}";

        // Dev mode: Trả về JSON để test Swagger cho sướng
        if (env.IsDevelopment())
        {
            return Ok(new
            {
                Status = "Thành công",
                Message = "Đã đăng nhập thành công bằng Google. Đang ở mode Dev nên không Redirect.",
                JWT_Token = token,
                DeepLink_For_App = redirectUrl
            });
        }

        return Redirect(redirectUrl);
    }
}