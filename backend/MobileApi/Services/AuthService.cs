using MobileApi.Data;
using MobileApi.Models;
using MobileApi.DTOs.Requests;
using MobileApi.Common.Abstractions;
using Microsoft.EntityFrameworkCore;
using MobileApi.Common.Exceptions;

namespace MobileApi.Services;

public interface IAuthService
{
    Task<Guid> RegisterAsync(RegisterRequest request);
    Task<string> LoginAsync(LoginRequest request);
    Task<string> LoginWithGoogleAsync(string code);
}

public class AuthService(ApplicationDbContext dbContext, IJwtProvider jwtProvider, IGoogleCalendarService googleCalendarService) : IAuthService
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly IGoogleCalendarService _googleCalendarService = googleCalendarService;

    public async Task<Guid> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            throw new ValidationException("Email already exists in the system.");
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = "customer",
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return user.Id;
    }

    public async Task<string> LoginAsync(LoginRequest request)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email) ?? throw new UnauthorizedException("Invalid email or password.");

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return _jwtProvider.GenerateToken(user.Email, user.Id.ToString());
    }

    public async Task<string> LoginWithGoogleAsync(string code)
    {
        var googleUserInfo = await _googleCalendarService.GetGoogleUserInfoAsync(code);
        if (googleUserInfo == null) throw new UnauthorizedException("Google authentication failed.");

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == googleUserInfo.Email);

        if (user == null)
        {
            // Tự động đăng ký nếu chưa có tài khoản
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = googleUserInfo.Email,
                Username = googleUserInfo.Name ?? googleUserInfo.Email,
                PasswordHash = "GOOGLE_SOCIAL_LOGIN", // Đánh dấu đây là user social
                Avatar = googleUserInfo.Picture,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
        }

        return _jwtProvider.GenerateToken(user.Email, user.Id.ToString());
    }
}