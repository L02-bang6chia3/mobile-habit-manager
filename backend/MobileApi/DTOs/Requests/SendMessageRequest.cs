using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class SendMessageRequest
{
    [Required]
    public string Message { get; set; } = string.Empty;
}
