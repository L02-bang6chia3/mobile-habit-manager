using System.ComponentModel.DataAnnotations;
using MobileApi.Enums;

namespace MobileApi.Models;

public class OrbitInstance
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid HabitId { get; set; }

    public Guid? MissionTaskId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public DateTime TimeStart { get; set; }
    public DateTime TimeEnd { get; set; }

    public TimeSpan Duration { get; set; }

    public OrbitState State { get; set; } = OrbitState.Pending;

    public bool IsDeleted { get; set; } = false;
}
