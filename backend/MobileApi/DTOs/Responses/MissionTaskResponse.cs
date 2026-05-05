namespace MobileApi.DTOs.Responses;

public class MissionTaskResponse
{
    public Guid Id { get; set; }
    public Guid HabitTemplateId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SequenceOrder { get; set; }
    public TimeSpan EstimatedDuration { get; set; }
}