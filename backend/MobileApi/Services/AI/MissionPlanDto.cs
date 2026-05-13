namespace MobileApi.Services.AI;

// Top-level shape the LLM must always return
public class MissionPlanDto
{
    public string Intent  { get; set; } = string.Empty;   // "clarify" | "plan"
    public string Message { get; set; } = string.Empty;   // user-facing bubble text
    public MissionPlanBody? Plan { get; set; }
}

public class MissionPlanBody
{
    public string   Title                { get; set; } = string.Empty;
    public string   Description          { get; set; } = string.Empty;
    public string   Category             { get; set; } = "Other";
    public DateTime StartDate            { get; set; }
    public DateTime EndDate              { get; set; }
    public double   EstimatedTotalHours  { get; set; }
    public List<MissionTaskPlanDto> Tasks { get; set; } = [];
}

public class MissionTaskPlanDto
{
    public string Title                    { get; set; } = string.Empty;
    public string Description              { get; set; } = string.Empty;
    public int    SequenceOrder            { get; set; }
    public int    EstimatedDurationMinutes { get; set; }
}

// Returned from MissionPlanIngestor after a plan is materialized
public class IngestionResult
{
    public Guid HabitId        { get; init; }
    public int  ScheduledCount { get; init; }
    public int  OverflowedCount { get; init; }
}
