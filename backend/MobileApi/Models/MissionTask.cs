using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class MissionTask
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid HabitTemplateId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int SequenceOrder { get; set; }

    public TimeSpan EstimatedDuration { get; set; }
}
