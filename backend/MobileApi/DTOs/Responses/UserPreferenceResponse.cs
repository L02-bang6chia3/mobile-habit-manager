namespace MobileApi.DTOs.Responses;

public class UserPreferenceResponse
{
    public Guid UserId { get; set; }
    public TimeSpan WorkdayStart { get; set; }
    public TimeSpan WorkdayEnd { get; set; }
    public int MinSlotMinutes { get; set; }
    public int BufferMinutes { get; set; }
    public string Timezone { get; set; } = "UTC";
}
