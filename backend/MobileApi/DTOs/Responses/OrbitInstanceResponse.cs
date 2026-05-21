using MobileApi.Enums;

namespace MobileApi.DTOs.Responses;

public class OrbitInstanceResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid HabitId { get; set; }
    public Guid? MissionTaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime TimeStart { get; set; }
    public DateTime TimeEnd { get; set; }
    public TimeSpan Duration { get; set; }
    public OrbitState State { get; set; }
}
