using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class BusyTime
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(255)]
    public string BusyId { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public DateTime BusyStart { get; set; }
    public DateTime BusyEnd { get; set; }
}
