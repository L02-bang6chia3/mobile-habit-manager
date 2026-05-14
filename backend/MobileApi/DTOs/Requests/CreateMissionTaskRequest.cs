using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class CreateMissionTaskRequest
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SequenceOrder { get; set; }

    public TimeSpan EstimatedDuration { get; set; }
}