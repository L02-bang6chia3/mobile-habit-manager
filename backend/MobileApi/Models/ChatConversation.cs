using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class ChatConversation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

    // Set once the AI plan has been ingested as a Mission
    public Guid? GeneratedHabitId { get; set; }

    public bool IsDeleted { get; set; } = false;
}
