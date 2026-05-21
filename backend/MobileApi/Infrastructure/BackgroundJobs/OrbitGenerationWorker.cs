using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.Enums;
using MobileApi.Services;

namespace MobileApi.Infrastructure.BackgroundJobs;

// Runs nightly at 02:00 UTC to keep the rolling 14-day orbit window full for all Routine habits.
public class OrbitGenerationWorker(
    IServiceScopeFactory scopeFactory,
    ILogger<OrbitGenerationWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(ComputeDelay(DateTime.UtcNow), stoppingToken);

            if (!stoppingToken.IsCancellationRequested)
                await RunTickAsync(stoppingToken);
        }
    }

    private async Task RunTickAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db          = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var orbitSvc    = scope.ServiceProvider.GetRequiredService<IOrbitService>();

        var userIds = await db.HabitTemplates
            .Where(h => !h.IsDeleted && h.Type == HabitType.Routine)
            .Select(h => h.UserId)
            .Distinct()
            .ToListAsync(ct);

        logger.LogInformation("Orbit generation tick: {Count} users to process", userIds.Count);

        foreach (var userId in userIds)
        {
            try
            {
                var count = await orbitSvc.RegenerateRollingWindowAsync(userId);
                logger.LogDebug("Generated {Count} orbits for user {UserId}", count, userId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to regenerate orbits for user {UserId}", userId);
            }
        }
    }

    // Delay until next 02:00 UTC
    private static TimeSpan ComputeDelay(DateTime utcNow)
    {
        var next = utcNow.Date.AddHours(2);
        if (next <= utcNow) next = next.AddDays(1);
        return next - utcNow;
    }
}
