using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class BusyTime
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }


    /// <summary>
    /// ID định danh từ nguồn ngoài (Google Event ID).
    /// Dùng nội bộ để tránh lưu trùng khi Sync. Không expose qua API.
    /// </summary>
    [MaxLength(255)]
    public string BusyId { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Đánh dấu là được nhập từ Google Calendar
    /// </summary>
    public bool IsImported { get; set; } = false;
}
