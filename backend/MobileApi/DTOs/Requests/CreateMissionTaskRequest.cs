namespace MobileApi.DTOs.Requests;

public class CreateMissionTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SequenceOrder { get; set; }

    public TimeSpan EstimatedDuration { get; set; }
}