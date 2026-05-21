using System.ComponentModel.DataAnnotations;
using MobileApi.Enums;

namespace MobileApi.Models;

public class ChatMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ConversationId { get; set; }

    public ChatRole Role { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    // Raw JSON from the LLM for assistant messages that carried a plan
    public string? RawJson { get; set; }

    // Token counts for quota tracking
    public int? TokensIn  { get; set; }
    public int? TokensOut { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
