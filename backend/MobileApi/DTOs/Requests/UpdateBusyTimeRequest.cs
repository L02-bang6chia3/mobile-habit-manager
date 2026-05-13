using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class UpdateBusyTimeRequest
{
    [MaxLength(500)]
    public string? Title { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }
}
