namespace MobileApi.DTOs.Requests;

public class DelayOrbitRequest
{
    public DateTime? NewStartUtc { get; set; }
    public TimeSpan? PushBy { get; set; }
    public string? Reason { get; set; }
}
