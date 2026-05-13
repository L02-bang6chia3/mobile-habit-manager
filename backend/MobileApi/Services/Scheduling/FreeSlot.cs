namespace MobileApi.Services.Scheduling;

// Closed-open interval [StartUtc, EndUtc) of available time within a workday
public record FreeSlot(DateTime StartUtc, DateTime EndUtc);
