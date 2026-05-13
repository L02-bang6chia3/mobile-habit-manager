namespace MobileApi.Services.Scheduling;

public record PlacementResult(
    IReadOnlyList<SchedulingDecision> Decisions,
    IReadOnlyList<OverflowedPlacement> Overflowed);
