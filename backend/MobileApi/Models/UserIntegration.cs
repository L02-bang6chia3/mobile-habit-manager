using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class UserIntegration
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Provider { get; set; } = "GoogleCalendar";

    public string AccessToken { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }

    public DateTime ExpiryDate { get; set; }
    
    [MaxLength(255)]
    public string? SyncToken { get; set; }
}
