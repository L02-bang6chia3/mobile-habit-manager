using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class CreateConversationRequest
{
    [Required]
    public string Message { get; set; } = string.Empty;
}
