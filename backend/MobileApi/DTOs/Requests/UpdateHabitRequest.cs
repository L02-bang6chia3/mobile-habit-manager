using MobileApi.Enums;

namespace MobileApi.DTOs.Requests;

public class UpdateHabitRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public HabitType? Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? RecurrenceRule { get; set; }
    public List<UpdateMissionTaskRequest>? MissionTasks { get; set; }
}
