namespace MobileApi.DTOs.Requests;

public class UpdateUserPreferenceRequest
{
    public TimeSpan? WorkdayStart { get; set; }
    public TimeSpan? WorkdayEnd { get; set; }
    public int? MinSlotMinutes { get; set; }
    public int? BufferMinutes { get; set; }
    public string? Timezone { get; set; }
}
