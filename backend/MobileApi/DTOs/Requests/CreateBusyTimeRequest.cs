using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class CreateBusyTimeRequest
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }
}
