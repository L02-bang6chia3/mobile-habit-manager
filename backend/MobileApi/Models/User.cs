using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Role { get; set; } = "customer";

    public string? Avatar { get; set; }

    public DateTime? Birthday { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
