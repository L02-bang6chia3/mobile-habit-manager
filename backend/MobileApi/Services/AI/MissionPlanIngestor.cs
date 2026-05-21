using MobileApi.DTOs.Requests;
using MobileApi.Enums;

namespace MobileApi.Services.AI;

public interface IMissionPlanIngestor
{
    Task<IngestionResult> IngestAsync(Guid userId, MissionPlanBody plan, CancellationToken ct);
}

public class MissionPlanIngestor(IHabitService habitService, IOrbitService orbitService) : IMissionPlanIngestor
{
    public async Task<IngestionResult> IngestAsync(Guid userId, MissionPlanBody plan, CancellationToken ct)
    {
        var request = new CreateHabitRequest
        {
            Title       = plan.Title,
            Description = plan.Description,
            Category    = plan.Category,
            Type        = HabitType.Mission,
            StartDate   = EnsureUtc(plan.StartDate),
            EndDate     = EnsureUtc(plan.EndDate),
            MissionTasks = plan.Tasks.Select(t => new CreateMissionTaskRequest
            {
                Title             = t.Title,
                Description       = t.Description,
                SequenceOrder     = t.SequenceOrder,
                EstimatedDuration = TimeSpan.FromMinutes(t.EstimatedDurationMinutes)
            }).ToList()
        };

        // Creating the habit doesn't trigger scheduling here (ingestor calls service directly, not controller)
        var habitId  = await habitService.CreateHabitAsync(userId, request);
        var scheduled = await orbitService.GenerateForHabitAsync(userId, habitId);

        return new IngestionResult
        {
            HabitId         = habitId,
            ScheduledCount  = scheduled,
            OverflowedCount = 0
        };
    }

    // LLM dates may arrive as Unspecified or Local — always store UTC.
    private static DateTime EnsureUtc(DateTime dt) => dt.Kind switch
    {
        DateTimeKind.Utc   => dt,
        DateTimeKind.Local => dt.ToUniversalTime(),
        _                  => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
    };
}
