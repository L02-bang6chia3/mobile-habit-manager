using Microsoft.EntityFrameworkCore;
using MobileApi.Common.Abstractions;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Enums;
using MobileApi.Models;
using MobileApi.Services.Scheduling;

namespace MobileApi.Services;

public interface IOrbitService
{
    Task<IEnumerable<OrbitInstanceResponse>> GetOrbitsAsync(Guid userId, DateTime fromUtc, DateTime toUtc);
    Task<OrbitInstanceResponse?> GetOrbitByIdAsync(Guid userId, Guid id);
    Task<bool> MarkDoneAsync(Guid userId, Guid orbitId);
    Task<bool> DelayAsync(Guid userId, Guid orbitId, DelayOrbitRequest request);
    Task<bool> SoftDeleteAsync(Guid userId, Guid orbitId);
    Task<int> GenerateForHabitAsync(Guid userId, Guid habitId);
    Task<int> RegenerateRollingWindowAsync(Guid userId);
}

public class OrbitService(
    ApplicationDbContext db,
    IGravityScheduler scheduler,
    IClock clock) : IOrbitService
{
    // ── Read ─────────────────────────────────────────────────────────────

    public async Task<IEnumerable<OrbitInstanceResponse>> GetOrbitsAsync(
        Guid userId, DateTime fromUtc, DateTime toUtc)
    {
        var orbits = await db.OrbitInstances
            .Where(o => o.UserId == userId && !o.IsDeleted
                        && o.TimeStart < toUtc && o.TimeEnd > fromUtc)
            .OrderBy(o => o.TimeStart)
            .ToListAsync();

        return orbits.Select(ToResponse);
    }

    public async Task<OrbitInstanceResponse?> GetOrbitByIdAsync(Guid userId, Guid id)
    {
        var orbit = await db.OrbitInstances
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId && !o.IsDeleted);

        return orbit == null ? null : ToResponse(orbit);
    }

    // ── Interactions ─────────────────────────────────────────────────────

    public async Task<bool> MarkDoneAsync(Guid userId, Guid orbitId)
    {
        var orbit = await db.OrbitInstances
            .FirstOrDefaultAsync(o => o.Id == orbitId && o.UserId == userId && !o.IsDeleted);
        if (orbit == null) return false;

        // Idempotent – already done
        if (orbit.State == OrbitState.Done) return true;

        using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            orbit.State = OrbitState.Done;

            var habit = await db.HabitTemplates.FirstOrDefaultAsync(h => h.Id == orbit.HabitId);
            if (habit != null)
                await UpdateStreakAsync(habit, orbit.TimeStart);

            await db.SaveChangesAsync();
            await tx.CommitAsync();
            return true;
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> DelayAsync(Guid userId, Guid orbitId, DelayOrbitRequest request)
    {
        var orbit = await db.OrbitInstances
            .FirstOrDefaultAsync(o => o.Id == orbitId && o.UserId == userId && !o.IsDeleted);
        if (orbit == null) return false;

        if (request.NewStartUtc.HasValue)
        {
            orbit.TimeStart = request.NewStartUtc.Value.ToUniversalTime();
            orbit.TimeEnd   = orbit.TimeStart + orbit.Duration;
        }
        else if (request.PushBy.HasValue)
        {
            orbit.TimeStart += request.PushBy.Value;
            orbit.TimeEnd   += request.PushBy.Value;
        }

        orbit.State = OrbitState.Delay;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SoftDeleteAsync(Guid userId, Guid orbitId)
    {
        var orbit = await db.OrbitInstances
            .FirstOrDefaultAsync(o => o.Id == orbitId && o.UserId == userId && !o.IsDeleted);
        if (orbit == null) return false;

        orbit.State     = OrbitState.Delete;
        orbit.IsDeleted = true;
        await db.SaveChangesAsync();
        return true;
    }

    // ── Generation ───────────────────────────────────────────────────────

    public async Task<int> GenerateForHabitAsync(Guid userId, Guid habitId)
    {
        var habit = await db.HabitTemplates
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return 0;

        var prefs = await db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId)
                    ?? new UserPreference { UserId = userId };

        var now = clock.UtcNow;
        var (windowFrom, windowTo) = habit.Type == HabitType.Mission
            ? (habit.StartDate?.ToUniversalTime() ?? now, habit.EndDate?.ToUniversalTime() ?? now.AddDays(30))
            : (now, now.AddDays(14));

        var window = new SchedulingWindow(userId, windowFrom, windowTo, prefs);

        using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            // Remove existing pending/delayed orbits for this habit (idempotency)
            var stale = await db.OrbitInstances
                .Where(o => o.HabitId == habitId && o.UserId == userId
                            && (o.State == OrbitState.Pending || o.State == OrbitState.Delay))
                .ToListAsync();
            db.OrbitInstances.RemoveRange(stale);
            await db.SaveChangesAsync();

            // Load blocking data
            var busyTimes = await db.BusyTimes
                .Where(b => b.UserId == userId && b.EndTime > windowFrom && b.StartTime < windowTo)
                .ToListAsync();

            var existingOrbits = await db.OrbitInstances
                .Where(o => o.UserId == userId
                            && o.State != OrbitState.Done && o.State != OrbitState.Delete
                            && o.TimeEnd > windowFrom && o.TimeStart < windowTo)
                .ToListAsync();

            // Build placements
            IReadOnlyList<PendingPlacement> placements;
            if (habit.Type == HabitType.Routine)
            {
                placements = BuildRoutinePlacements(habit, window);
            }
            else
            {
                var tasks = await db.MissionTasks
                    .Where(t => t.HabitTemplateId == habitId && !t.IsDeleted)
                    .OrderBy(t => t.SequenceOrder)
                    .ToListAsync();
                placements = BuildMissionPlacements(habit, tasks);
            }

            if (placements.Count == 0)
            {
                await tx.CommitAsync();
                return 0;
            }

            var freeSlots = scheduler.ComputeFreeSlots(busyTimes, existingOrbits, window);
            var result    = scheduler.PlaceOrbits(window, freeSlots, placements);

            var instances = result.Decisions.Select(d => new OrbitInstance
            {
                UserId        = userId,
                HabitId       = d.HabitId,
                MissionTaskId = d.MissionTaskId,
                Title         = d.Title,
                TimeStart     = d.StartUtc,
                TimeEnd       = d.EndUtc,
                Duration      = d.EndUtc - d.StartUtc,
                State         = OrbitState.Pending
            }).ToList();

            db.OrbitInstances.AddRange(instances);
            await db.SaveChangesAsync();
            await tx.CommitAsync();

            return instances.Count;
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<int> RegenerateRollingWindowAsync(Guid userId)
    {
        var routineIds = await db.HabitTemplates
            .Where(h => h.UserId == userId && !h.IsDeleted && h.Type == HabitType.Routine)
            .Select(h => h.Id)
            .ToListAsync();

        var total = 0;
        foreach (var id in routineIds)
            total += await GenerateForHabitAsync(userId, id);

        return total;
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private static IReadOnlyList<PendingPlacement> BuildRoutinePlacements(
        HabitTemplate habit, SchedulingWindow window)
    {
        if (habit.RecurrenceRule == null) return [];

        return RecurrenceExpander
            .Expand(habit.RecurrenceRule, window.FromUtc, window.ToUtc)
            .Select(t => new PendingPlacement(
                HabitId:       habit.Id,
                MissionTaskId: null,
                Title:         habit.Title,
                Duration:      t.Duration,
                EarliestUtc:   t.TargetDate.Date,
                DeadlineUtc:   t.TargetDate.Date.AddDays(1),
                SequenceOrder: null))
            .ToList();
    }

    private static IReadOnlyList<PendingPlacement> BuildMissionPlacements(
        HabitTemplate habit, List<MissionTask> tasks)
    {
        var earliest = (habit.StartDate ?? DateTime.UtcNow).ToUniversalTime();
        var deadline = (habit.EndDate   ?? earliest.AddDays(30)).ToUniversalTime();

        return tasks
            .Select(t => new PendingPlacement(
                HabitId:       habit.Id,
                MissionTaskId: t.Id,
                Title:         t.Title,
                Duration:      t.EstimatedDuration,
                EarliestUtc:   earliest,
                DeadlineUtc:   deadline,
                SequenceOrder: t.SequenceOrder))
            .ToList();
    }

    private async Task UpdateStreakAsync(HabitTemplate habit, DateTime orbitTimeStart)
    {
        // Check if there's a Done orbit for this habit in the previous ~36h (generous window for late completions)
        var streakContinued = await db.OrbitInstances.AnyAsync(o =>
            o.HabitId == habit.Id &&
            o.State   == OrbitState.Done &&
            o.TimeStart >= orbitTimeStart.AddHours(-36) &&
            o.TimeStart < orbitTimeStart);

        habit.CurrentStreak = streakContinued ? habit.CurrentStreak + 1 : 1;
        if (habit.CurrentStreak > habit.LongestStreak)
            habit.LongestStreak = habit.CurrentStreak;
    }

    private static OrbitInstanceResponse ToResponse(OrbitInstance o) => new()
    {
        Id            = o.Id,
        UserId        = o.UserId,
        HabitId       = o.HabitId,
        MissionTaskId = o.MissionTaskId,
        Title         = o.Title,
        TimeStart     = o.TimeStart,
        TimeEnd       = o.TimeEnd,
        Duration      = o.Duration,
        State         = o.State
    };
}
