using System.ComponentModel.DataAnnotations;

namespace MobileApi.DTOs.Requests;

public class UpdateMissionTaskRequest
{
    public Guid? Id { get; set; }
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }
    public string? Description { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "SequenceOrder must be at least 1")]
    public int? SequenceOrder { get; set; }
    public TimeSpan? EstimatedDuration { get; set; }
}