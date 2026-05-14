using MobileApi.Enums;

namespace MobileApi.DTOs.Responses;

public class HabitResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid AuthorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public HabitType Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? RecurrenceRule { get; set; }
    public bool IsPublic { get; set; }
    public Guid? ClonedFromId { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<MissionTaskResponse>? MissionTasks { get; set; }
}
