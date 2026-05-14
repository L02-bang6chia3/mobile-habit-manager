namespace MobileApi.DTOs.Requests;

public class UpdateMissionTaskRequest
{
    public Guid? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? SequenceOrder { get; set; }
    public TimeSpan? EstimatedDuration { get; set; }
}