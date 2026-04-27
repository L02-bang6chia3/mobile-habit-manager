using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class Order
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string OrderCode { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    public decimal Amount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
