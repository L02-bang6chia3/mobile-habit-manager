namespace MobileApi.Services.Scheduling;

public record PendingPlacement(
    Guid HabitId,
    Guid? MissionTaskId,
    string Title,
    TimeSpan Duration,
    DateTime EarliestUtc,
    DateTime DeadlineUtc,
    int? SequenceOrder);   // null = routine; non-null = mission task
