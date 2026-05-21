using MobileApi.Models;

namespace MobileApi.Services.Scheduling;

public record SchedulingWindow(Guid UserId, DateTime FromUtc, DateTime ToUtc, UserPreference Prefs);
