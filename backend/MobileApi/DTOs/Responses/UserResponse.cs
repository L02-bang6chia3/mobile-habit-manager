namespace MobileApi.DTOs.Responses;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public DateTime? Birthday { get; set; }
    public DateTime CreatedAt { get; set; }
}