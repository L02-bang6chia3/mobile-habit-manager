using MobileApi.Models;

namespace MobileApi.Services.Scheduling;

public interface IGravityScheduler
{
    IReadOnlyList<FreeSlot> ComputeFreeSlots(
        IEnumerable<BusyTime> busyTimes,
        IEnumerable<OrbitInstance> existingOrbits,
        SchedulingWindow window);

    PlacementResult PlaceOrbits(
        SchedulingWindow window,
        IReadOnlyList<FreeSlot> freeSlots,
        IReadOnlyList<PendingPlacement> placements);
}

public class GravityScheduler : IGravityScheduler
{
    public IReadOnlyList<FreeSlot> ComputeFreeSlots(
        IEnumerable<BusyTime> busyTimes,
        IEnumerable<OrbitInstance> existingOrbits,
        SchedulingWindow window)
    {
        var buf = TimeSpan.FromMinutes(window.Prefs.BufferMinutes);
        var minSlot = TimeSpan.FromMinutes(window.Prefs.MinSlotMinutes);

        // Build blocking intervals (busy times + active orbit instances), each padded with buffer
        var blocks = new List<(DateTime Start, DateTime End)>();
        foreach (var b in busyTimes)
            blocks.Add((b.StartTime - buf, b.EndTime + buf));
        foreach (var o in existingOrbits.Where(o => o.State is Enums.OrbitState.Pending or Enums.OrbitState.Delay))
            blocks.Add((o.TimeStart - buf, o.TimeEnd + buf));

        var merged = MergeIntervals(blocks);

        var tz = ResolveTimezone(window.Prefs.Timezone);
        var result = new List<FreeSlot>();

        for (var day = window.FromUtc.Date; day <= window.ToUtc.Date; day = day.AddDays(1))
        {
            var localDay = TimeZoneInfo.ConvertTimeFromUtc(day, tz).Date;
            var workStart = TimeZoneInfo.ConvertTimeToUtc(localDay + window.Prefs.WorkdayStart, tz);
            var workEnd   = TimeZoneInfo.ConvertTimeToUtc(localDay + window.Prefs.WorkdayEnd, tz);

            // Clip to the overall scheduling window
            var slotStart = workStart < window.FromUtc ? window.FromUtc : workStart;
            var slotEnd   = workEnd   > window.ToUtc   ? window.ToUtc   : workEnd;
            if (slotStart >= slotEnd) continue;

            foreach (var free in SubtractBlocks(slotStart, slotEnd, merged))
            {
                if (free.EndUtc - free.StartUtc >= minSlot)
                    result.Add(free);
            }
        }

        return result;
    }

    public PlacementResult PlaceOrbits(
        SchedulingWindow window,
        IReadOnlyList<FreeSlot> freeSlots,
        IReadOnlyList<PendingPlacement> placements)
    {
        // Mutable list we split as slots are consumed
        var available = freeSlots.OrderBy(s => s.StartUtc).ToList();
        var decisions = new List<SchedulingDecision>();
        var overflowed = new List<OverflowedPlacement>();

        // Missions first (deadline + sequence order critical), then routines
        var missions = placements
            .Where(p => p.SequenceOrder.HasValue)
            .OrderBy(p => p.DeadlineUtc).ThenBy(p => p.SequenceOrder)
            .ToList();

        var routines = placements
            .Where(p => !p.SequenceOrder.HasValue)
            .ToList();

        // Track where the last task of each mission landed (for sequencing)
        var missionCursor = new Dictionary<Guid, DateTime>();

        foreach (var p in missions)
        {
            var earliest = missionCursor.TryGetValue(p.HabitId, out var prev)
                ? (prev > p.EarliestUtc ? prev : p.EarliestUtc)
                : p.EarliestUtc;

            var placed = FindAndConsume(available, p.Duration, earliest, p.DeadlineUtc);
            if (placed == null)
            {
                overflowed.Add(new OverflowedPlacement(p, "No free slot before deadline"));
                continue;
            }

            decisions.Add(new SchedulingDecision(p.HabitId, p.MissionTaskId, p.Title, placed.Value, placed.Value + p.Duration));
            missionCursor[p.HabitId] = placed.Value + p.Duration;
        }

        foreach (var p in routines)
        {
            var placed = FindAndConsume(available, p.Duration, p.EarliestUtc, p.DeadlineUtc);
            if (placed == null)
            {
                overflowed.Add(new OverflowedPlacement(p, "No free slot on target day"));
                continue;
            }

            decisions.Add(new SchedulingDecision(p.HabitId, null, p.Title, placed.Value, placed.Value + p.Duration));
        }

        return new PlacementResult(decisions, overflowed);
    }

    // Returns the chosen start time and removes that portion from available slots
    private static DateTime? FindAndConsume(
        List<FreeSlot> available, TimeSpan duration, DateTime earliest, DateTime deadline)
    {
        for (var i = 0; i < available.Count; i++)
        {
            var slot = available[i];
            if (slot.EndUtc <= earliest) continue;

            var start = slot.StartUtc < earliest ? earliest : slot.StartUtc;
            var end   = start + duration;

            if (end > slot.EndUtc || end > deadline) continue;

            // Split the slot around the consumed range
            available.RemoveAt(i);
            if (slot.StartUtc < start)
                available.Insert(i, new FreeSlot(slot.StartUtc, start));
            if (end < slot.EndUtc)
                available.Insert(i + (slot.StartUtc < start ? 1 : 0), new FreeSlot(end, slot.EndUtc));

            return start;
        }
        return null;
    }

    // Merge a list of potentially overlapping intervals
    private static List<(DateTime Start, DateTime End)> MergeIntervals(
        List<(DateTime Start, DateTime End)> intervals)
    {
        if (intervals.Count == 0) return intervals;

        var sorted = intervals.OrderBy(i => i.Start).ToList();
        var merged = new List<(DateTime, DateTime)> { sorted[0] };

        for (var i = 1; i < sorted.Count; i++)
        {
            var (ms, me) = merged[^1];
            var (s, e)   = sorted[i];

            if (s <= me)
                merged[^1] = (ms, e > me ? e : me);
            else
                merged.Add((s, e));
        }
        return merged;
    }

    // Subtract blocking intervals from [rangeStart, rangeEnd), yielding free sub-ranges
    private static IEnumerable<FreeSlot> SubtractBlocks(
        DateTime rangeStart, DateTime rangeEnd,
        List<(DateTime Start, DateTime End)> blocks)
    {
        var cursor = rangeStart;

        foreach (var (bs, be) in blocks.Where(b => b.End > rangeStart && b.Start < rangeEnd).OrderBy(b => b.Start))
        {
            if (bs > cursor)
                yield return new FreeSlot(cursor, bs);

            if (be > cursor) cursor = be;
            if (cursor >= rangeEnd) yield break;
        }

        if (cursor < rangeEnd)
            yield return new FreeSlot(cursor, rangeEnd);
    }

    private static TimeZoneInfo ResolveTimezone(string iana)
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById(iana); }
        catch { return TimeZoneInfo.Utc; }
    }
}
