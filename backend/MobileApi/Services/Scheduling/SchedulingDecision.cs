namespace MobileApi.Services.Scheduling;

public record SchedulingDecision(
    Guid HabitId,
    Guid? MissionTaskId,
    string Title,
    DateTime StartUtc,
    DateTime EndUtc);
