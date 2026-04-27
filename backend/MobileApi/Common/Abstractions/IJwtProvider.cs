namespace MobileApi.Common.Abstractions;

public interface IJwtProvider
{
    string GenerateToken(string email, string userId);
}
