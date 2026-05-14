using System.ComponentModel.DataAnnotations;

namespace MobileApi.Models;

public class Payment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OrderId { get; set; }

    public long PayOsOrderCode { get; set; }

    [MaxLength(100)]
    public string PayOsLinkId { get; set; } = string.Empty;

    [MaxLength(500)]
    public string CheckoutUrl { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? WebhookEventId { get; set; }

    public DateTime? PaidAt { get; set; }
}
