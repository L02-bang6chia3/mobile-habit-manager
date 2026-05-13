using System.Text.Json;

namespace MobileApi.Services.Scheduling;

// Expands a habit's RecurrenceRule JSONB into (TargetDate, Duration) pairs.
//
// Supported JSON shapes:
//   {"freq":"daily","durationMinutes":30}
//   {"freq":"weekly","days":[1,2,3,4,5],"durationMinutes":60}  (0=Sun … 6=Sat)
//   {"freq":"interval","intervalDays":2,"durationMinutes":45}
public static class RecurrenceExpander
{
    private record RuleDto(
        string Freq,
        int[]? Days,
        int DurationMinutes,
        int IntervalDays = 1);

    public static IEnumerable<(DateTime TargetDate, TimeSpan Duration)> Expand(
        string ruleJson, DateTime fromUtc, DateTime toUtc)
    {
        RuleDto? rule;
        try { rule = JsonSerializer.Deserialize<RuleDto>(ruleJson, _options); }
        catch { yield break; }

        if (rule == null || rule.DurationMinutes <= 0) yield break;

        var duration = TimeSpan.FromMinutes(rule.DurationMinutes);
        var day = fromUtc.Date;
        var end = toUtc.Date;

        while (day <= end)
        {
            var include = rule.Freq switch
            {
                "weekly" => rule.Days != null && rule.Days.Contains((int)day.DayOfWeek),
                "interval" => (day - fromUtc.Date).Days % rule.IntervalDays == 0,
                _ => true  // "daily" and unknown default to every day
            };

            if (include)
                yield return (day, duration);

            day = day.AddDays(1);
        }
    }

    private static readonly JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true
    };
}
