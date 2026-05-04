using MobileApi.Enums;

namespace MobileApi.DTOs.Requests;

public class UpdateHabitRequest
{
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Category { get; set; } = string.Empty;
    public HabitType Type { get; set; }
    public List<CreateMissionTaskRequest>? Tasks { get; set; }
}
