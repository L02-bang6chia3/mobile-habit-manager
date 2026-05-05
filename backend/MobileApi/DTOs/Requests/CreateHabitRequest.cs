using System.ComponentModel.DataAnnotations;
using MobileApi.Enums;

namespace MobileApi.DTOs.Requests;

public class CreateHabitRequest
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    [Required]
    public HabitType Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<CreateMissionTaskRequest>? MissionTasks { get; set; }
    public string? RecurrenceRule { get; set; }
}
