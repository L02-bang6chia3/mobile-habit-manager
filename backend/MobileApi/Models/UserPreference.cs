using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MobileApi.Models;

public class UserPreference
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    // Workday window the scheduler respects (stored as offset from midnight)
    public TimeSpan WorkdayStart { get; set; } = new TimeSpan(8, 0, 0);
    public TimeSpan WorkdayEnd { get; set; } = new TimeSpan(22, 0, 0);

    // Minimum free-slot length to be usable; buffer between back-to-back tasks
    public int MinSlotMinutes { get; set; } = 15;
    public int BufferMinutes { get; set; } = 5;

    // IANA timezone string, e.g. "Asia/Ho_Chi_Minh"
    [MaxLength(64)]
    public string Timezone { get; set; } = "UTC";
}
