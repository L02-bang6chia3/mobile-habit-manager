namespace MobileApi.Services.Scheduling;

// A placement that could not fit before its deadline
public record OverflowedPlacement(PendingPlacement Placement, string Reason);
