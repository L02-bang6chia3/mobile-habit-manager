# Plan — Phase 3 (The Gravity Scheduler) + Gravity AI Chat

**Scope.** This document is the detailed, step-by-step implementation plan for two milestones:

- **§A — Phase 3:** The Gravity auto-scheduling algorithm, OrbitInstance interactions (Done/Delay/Delete), and the background generation worker for the rolling 14-day window. Push notifications.
- **§B — Gravity AI Chat:** A chat-bot that turns a user's natural-language goal into a Mission (HabitTemplate + MissionTasks) and feeds it into the §A scheduler. Backed by **Groq** (free LLM API).

Out of scope here: Habit Library (Phase 4), PayOS webhook (Phase 4), Dynamic Rescheduling (Phase 7), the React Native client (Phase 5/8).

**Reading order for an implementer:** §0 (preflight) → §A (build the scheduler) → §B (build the chat — it depends on §A being able to schedule the Mission it produces).

---

## §0. Preflight — small cleanups Phase 3 depends on

These are tiny, fast, and unblock the rest. Do them first.

| # | Task | File(s) | Acceptance |
|---|---|---|---|
| 0.1 | Define `HabitStatus` enum (`Private = 0, PendingApproval = 1, Approved = 2`) and add a `Status` column to `HabitTemplate` (default `Private`). Uncomment the existing TODO line in `Models/HabitTemplate.cs`. | `Enums/HabitStatus.cs`, `Models/HabitTemplate.cs` | Builds; new migration generated. Not consumed by §A but Phase 4 needs it and a migration churn now is cheap. |
| 0.2 | Add FK constraints + useful indexes in `ApplicationDbContext.OnModelCreating`: `OrbitInstance.UserId → User.Id`, `OrbitInstance.HabitId → HabitTemplate.Id`, `OrbitInstance.MissionTaskId → MissionTask.Id (nullable)`, `MissionTask.HabitTemplateId → HabitTemplate.Id`, `BusyTime.UserId → User.Id`. Composite index `(UserId, TimeStart, TimeEnd)` on `OrbitInstance` and `(UserId, StartTime, EndTime)` on `BusyTime`. | `Data/ApplicationDbContext.cs` + new migration | Scheduler queries on free-slot windows have an index to land on. |
| 0.3 | Add `IClock` abstraction (`UtcNow`) and register it in DI. Inject it into anything that does scheduling/AI prompting. | `Common/Abstractions/IClock.cs`, `Common/Time/SystemClock.cs`, register in `ServiceCollectionExtensions.cs` | Tests in §A-5 and §B-7 can mock time. |
| 0.4 | Add `UserPreference` entity (1:1 with User) holding scheduling knobs: `WorkdayStart` (TimeSpan, default 08:00), `WorkdayEnd` (default 22:00), `MinSlotMinutes` (default 15), `BufferMinutes` (default 5 between tasks), `Timezone` (string, IANA, default "UTC"). DbSet, migration, GET/PUT endpoint `/api/preferences`. | `Models/UserPreference.cs`, `Services/UserPreferenceService.cs`, `Controllers/PreferencesController.cs` | Scheduler reads these instead of hard-coded constants. |

---

## §A. The Gravity Scheduler

### A-1. Domain model — `SchedulingWindow` and `FreeSlot`

Add internal types (NOT entities — pure in-memory structs/records):

- `record FreeSlot(DateTime StartUtc, DateTime EndUtc)` — closed-open interval `[Start, End)`.
- `record SchedulingWindow(Guid UserId, DateTime FromUtc, DateTime ToUtc, UserPreference Prefs)`.
- `record SchedulingDecision(Guid? OrbitInstanceId, DateTime StartUtc, DateTime EndUtc, Guid HabitId, Guid? MissionTaskId, string Title)`.

Location: `Services/Scheduling/` (new folder).

### A-2. `IOrbitService` — the public surface

Create `Services/OrbitService.cs` with this interface (replace the existing `// TODO` stub):

```csharp
public interface IOrbitService
{
    // Read
    Task<IEnumerable<OrbitInstanceResponse>> GetOrbitsAsync(Guid userId, DateTime fromUtc, DateTime toUtc);
    Task<OrbitInstanceResponse?> GetOrbitByIdAsync(Guid userId, Guid id);

    // Interaction (Step 8 in roadmap)
    Task<bool> MarkDoneAsync(Guid userId, Guid orbitId);
    Task<bool> DelayAsync(Guid userId, Guid orbitId, DelayRequest req);        // see A-4
    Task<bool> SoftDeleteAsync(Guid userId, Guid orbitId);

    // Generation (Step 7)
    Task<int> GenerateForHabitAsync(Guid userId, Guid habitId);                // called when habit created/updated
    Task<int> RegenerateRollingWindowAsync(Guid userId);                       // called by worker for routines
}
```

Plus a separate **internal** scheduling engine:

```csharp
internal interface IGravityScheduler
{
    IReadOnlyList<FreeSlot> ComputeFreeSlots(
        IEnumerable<BusyTime> busyTimes,
        IEnumerable<OrbitInstance> existingOrbits,
        SchedulingWindow window);

    IReadOnlyList<SchedulingDecision> PlaceOrbits(
        SchedulingWindow window,
        IReadOnlyList<FreeSlot> freeSlots,
        IReadOnlyList<PendingPlacement> placements);   // routine occurrences or mission tasks
}
```

`PendingPlacement` is a record describing *what* needs to be placed: `(Guid HabitId, Guid? MissionTaskId, string Title, TimeSpan Duration, DateTime EarliestUtc, DateTime DeadlineUtc, int? SequenceOrder)`. The scheduler is pure: given a window + free slots + placements, it returns decisions. No DB access. This is what makes it unit-testable.

### A-3. The algorithm — Rolling Window (first cut, no AI)

For the MVP we implement a deterministic greedy scheduler. The "AI" name is metaphorical; the smart part is §A-3's slot-finding + §B's LLM-driven plan generation.

**Inputs:**
- `BusyTime[]` for `[window.From, window.To]` (manual + Google-synced).
- `OrbitInstance[]` already scheduled in the window (state = Pending or Delay) — counted as blocking.
- User preferences: workday bounds, min slot, buffer.

**Free-slot computation (`ComputeFreeSlots`)** — sweep-line:
1. Merge all blocking intervals: `busyTimes ∪ existingOrbits.Where(o => o.State != Done && o.State != Delete)`. Apply `BufferMinutes` padding so slots aren't packed back-to-back.
2. For each day in the window, clip to the user's workday `[WorkdayStart, WorkdayEnd]` (converted to UTC using `Prefs.Timezone`).
3. Subtract merged-blocking from each day → list of `FreeSlot`s, each at least `MinSlotMinutes` long.

**Placement (`PlaceOrbits`)** — greedy, mission-aware:
1. Sort placements: missions first (deadline-driven, sorted by `(DeadlineUtc, SequenceOrder)`); routines second.
2. **For mission tasks:** respect `SequenceOrder` — task N can only be placed *after* the chosen slot of task N-1. Walk free slots forward; assign the earliest slot ≥ task duration that is after the previous task's chosen end. If a task can't fit before its `DeadlineUtc`, return it in an `OverflowedPlacements` list (don't silently drop). Caller decides whether to surface a "Trajectory Alert".
3. **For routines:** expand `RecurrenceRule` (JSONB → a small parser; v1 only supports `{"freq":"daily"}`, `{"freq":"weekly","days":[...]}`, `{"freq":"custom","minutes":N}`) into expected occurrences in the window. Each occurrence gets the *first* free slot of its target day that fits the duration; fall back to the next day if none.
4. Mark used slots as consumed (or split them) before placing the next item.

**Persistence (`GenerateForHabitAsync`):**
- Wrap in a transaction.
- Load busy times + existing orbits in the window with `SELECT ... FOR UPDATE` (`Set<>().FromSqlInterpolated` if EF doesn't expose row locks for this case) to avoid two parallel scheduler runs double-booking the same slot.
- Call `IGravityScheduler.PlaceOrbits`.
- For each `SchedulingDecision`, insert an `OrbitInstance` (state = `Pending`).
- Commit, return the count.

**Background worker (`OrbitGenerationWorker`)** — `BackgroundService`:
- Runs nightly (configurable `Cron` in `appsettings.json`, default `"0 2 * * *"` — 02:00 UTC).
- For each active user, calls `RegenerateRollingWindowAsync`, which:
  - Walks every Routine-type habit, deletes already-placed Pending orbits *beyond today*, and re-runs §A-3 for the new 14-day window ending `UtcNow + 14d`.
  - **Does not** touch missions on the nightly tick — they were placed once at creation; rescheduling them is Phase 7.

### A-4. Controller — `OrbitInstancesController`

Replace the `// TODO` stub with:

| Method | Route | Behavior |
|---|---|---|
| `GET` | `/api/orbits?from=...&to=...` | List user's orbits in the window. Default window = today → +14d. |
| `GET` | `/api/orbits/{id}` | Single orbit detail. |
| `POST` | `/api/orbits/{id}/done` | Mark done. Updates streak fields on parent `HabitTemplate`. |
| `POST` | `/api/orbits/{id}/delay` | Body `DelayRequest { DateTime? NewStartUtc; TimeSpan? PushBy; string? Reason }`. Moves the orbit (or sets state=Delay if no new time supplied). |
| `DELETE` | `/api/orbits/{id}` | Soft-delete (`State=Delete`, `IsDeleted=true`). |
| `POST` | `/api/habits/{habitId}/schedule` | Re-runs `GenerateForHabitAsync`. Useful after the user edits the habit. (Could also live on `HabitsController` — pick whichever feels less crowded.) |

Add corresponding DTOs in `DTOs/Requests/` and `DTOs/Responses/`. Follow the `{ data }` envelope convention.

Streak update logic in `MarkDoneAsync`: if there's a Done orbit for the same habit yesterday → increment `CurrentStreak`; else reset to 1. Update `LongestStreak = Max(LongestStreak, CurrentStreak)`. Wrap in the same transaction as the state change.

### A-5. Push Notifications (Roadmap Step 9)

**Provider choice:** Expo Push (free, no Firebase setup required for an Expo-managed RN app). Decision can flip to FCM later; isolate behind `INotificationSender`.

Steps:
1. Add `PushToken` entity: `Id, UserId, ExpoToken (or FcmToken), Platform, CreatedAt, RevokedAt?`.
2. Endpoint `POST /api/devices` to register a token (called by the mobile app on first launch / login).
3. `Infrastructure/Push/ExpoPushClient.cs` — wraps the Expo push HTTP API (one `HttpClient` registered via `IHttpClientFactory`, with `Polly` retries — already pulled in transitively).
4. `Infrastructure/BackgroundJobs/SignalDispatcherWorker.cs` — runs every minute. Selects orbits where `TimeStart ∈ [UtcNow + 5min, UtcNow + 6min)` AND `State = Pending` AND not yet signalled. Sends a push; marks `SignalledAt` on the orbit (add this column).
5. Idempotency: use `SignalledAt IS NULL` as the guard so duplicate worker ticks don't double-send.

### A-6. Tests

Add a test project `backend/MobileApi.Tests/` (xUnit + FluentAssertions). At minimum:

- `GravityScheduler_FreeSlots_ExcludesBusyWithBuffer`
- `GravityScheduler_Mission_RespectsSequenceOrder`
- `GravityScheduler_Mission_ReportsOverflowWhenDeadlineUnreachable`
- `GravityScheduler_Routine_SkipsToNextDayWhenNoSlot`
- `OrbitService_MarkDone_UpdatesStreaks`
- `OrbitService_GenerateForHabit_IsIdempotent` (running twice yields the same orbit count, not double).

Persistence-level tests can use the existing Neon DB with a transactional rollback per test, or `Testcontainers.PostgreSQL` if we want hermetic CI. Don't mock EF — mock only `IClock` and `INotificationSender`.

### A-7. Sequencing inside §A

1. §0 preflight (HabitStatus enum is optional but indexes + IClock + UserPreference are required).
2. A-1 + A-2 — types and interfaces compile, no logic.
3. A-3 free-slot computation + pure scheduler with unit tests.
4. A-3 persistence (`GenerateForHabitAsync`) + wire to `HabitsController` (call after Create / Update / Delete).
5. A-4 OrbitInstances controller + interaction endpoints.
6. A-3 nightly worker.
7. A-5 push notifications (independent — can be a parallel branch).

---

## §B. Gravity AI Chat

### B-1. Product flow

```
[User on mobile] "I want to learn React in 30 days, ~1h/day on weekdays"
       │
       ▼
POST /api/ai/chat  { conversationId?, message }
       │
       ▼
ChatService.SendAsync → Groq (Llama 3.3 70B, JSON mode)
       │
       ├── if model returns clarifying question → save + return as assistant message
       └── if model returns a Mission Plan JSON
              │
              ▼
   MissionPlanIngestor → HabitService.CreateHabitAsync(type=Mission, with tasks)
              │
              ▼
   OrbitService.GenerateForHabitAsync  ←  reuses §A scheduler
              │
              ▼
   Returns { habitId, scheduledCount, overflowedTasks }
```

### B-2. Data model (persisted conversations)

New entities + DbSets:

```
ChatConversation
  Id Guid PK
  UserId Guid (FK)
  Title string (auto-generated from first user message, ≤100 chars)
  CreatedAt
  LastMessageAt
  GeneratedHabitId Guid?  -- set once a plan is ingested
  IsDeleted bool

ChatMessage
  Id Guid PK
  ConversationId Guid (FK, ON DELETE CASCADE)
  Role enum { System=0, User=1, Assistant=2, Tool=3 }
  Content text       -- raw text shown in the bubble
  RawJson text?      -- for assistant messages that carried a structured plan
  TokensIn int?      -- for cost / quota tracking
  TokensOut int?
  CreatedAt
```

Index `(ConversationId, CreatedAt)` for fast history fetch. Soft-delete the conversation, hard-delete-cascades not required.

### B-3. Groq integration — `Infrastructure/LLM/GroqChatClient`

- Use `IHttpClientFactory`. Named client `"Groq"` with `BaseAddress = https://api.groq.com/openai/v1/`.
- Auth: `Authorization: Bearer {GROQ_API_KEY}` — load from env via existing pattern (see `GoogleCalendarService` ctor).
- Endpoint: `POST chat/completions`. Body is OpenAI-compatible: `{ model, messages[], response_format: { type: "json_object" }, temperature }`.
- Default model: `llama-3.3-70b-versatile` (Groq's strongest free model at time of writing). Configurable via `appsettings.json: AI:Groq:Model`.
- Add `GROQ_API_KEY=` to `.env.example` and document in CLAUDE.md §6.

Abstraction:

```csharp
public interface ILlmChatClient
{
    Task<LlmChatResponse> CompleteAsync(
        IReadOnlyList<LlmMessage> messages,
        LlmOptions options,
        CancellationToken ct);
}
```

Concrete: `GroqChatClient : ILlmChatClient`. Keeps Groq swappable for SambaNova / Gemini later by only changing DI registration.

### B-4. Prompting strategy

Two modes the LLM must distinguish, controlled by **JSON-mode response schema**:

```jsonc
// The single response shape the LLM must always return.
{
  "intent": "clarify" | "plan",
  "message": "string shown to the user as the assistant's bubble",
  "plan": null | {
      "title": "string",
      "description": "string",
      "category": "Education" | "Health" | "Career" | "Personal" | "Other",
      "startDate": "ISO-8601 UTC",
      "endDate": "ISO-8601 UTC",
      "estimatedTotalHours": number,
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "sequenceOrder": 1,
          "estimatedDurationMinutes": 60
        }
        // ...
      ]
    }
}
```

System prompt skeleton (English; keep short — Groq tokens are free but latency matters):

```
You are "The Gravity," the planning AI of the ORBIT habit app.
Your job: turn a user's goal into a Mission with sequenced tasks.

Rules:
- Always reply as valid JSON matching the schema below.
- If the user hasn't given enough info (duration, time-per-day, current level), set intent="clarify" and ASK exactly one specific question in `message`. Set `plan=null`.
- Once you have enough info, set intent="plan", set `message` to a friendly summary, and fill `plan` with 5–30 tasks ordered by sequenceOrder starting at 1.
- Each task's estimatedDurationMinutes is a positive integer; the SUM of all tasks should be ≈ estimatedTotalHours * 60.
- Never invent calendar times — the backend will schedule. Only deliver the curriculum.
- Today's date (UTC) is {{today}}.

Schema: { ... see B-4 above ... }
```

Notes:
- Prepend a single `system` message + the entire conversation history on every call. Truncate to the last ~30 messages or ~12k tokens. Persist *everything*; truncation is a send-side decision.
- For JSON robustness, do **two-layer validation**: (a) parse with `System.Text.Json` into the response DTO; (b) run a small FluentValidation pass on the DTO (title non-empty, dates well-ordered, tasks 1–30, sequenceOrder 1..N contiguous). On (a) or (b) failure, retry once with an error-feedback turn appended (`"Your previous reply was invalid because X. Reply again."`); on second failure, surface a user-facing error and don't ingest.

### B-5. `IChatService` and `IMissionPlanIngestor`

```csharp
public interface IChatService
{
    Task<ChatConversationResponse> CreateConversationAsync(Guid userId, string firstUserMessage, CancellationToken ct);
    Task<ChatMessageResponse> SendMessageAsync(Guid userId, Guid conversationId, string userMessage, CancellationToken ct);
    Task<IEnumerable<ChatConversationResponse>> ListAsync(Guid userId);
    Task<ChatConversationDetailResponse?> GetAsync(Guid userId, Guid conversationId);
    Task<bool> DeleteAsync(Guid userId, Guid conversationId);
}

public interface IMissionPlanIngestor
{
    // Given a validated plan, creates a HabitTemplate (type=Mission) with
    // MissionTasks, then invokes IOrbitService.GenerateForHabitAsync.
    // Returns the new habitId plus scheduling outcome.
    Task<IngestionResult> IngestAsync(Guid userId, MissionPlanDto plan, CancellationToken ct);
}
```

Wire `IChatService → ILlmChatClient + IMissionPlanIngestor + ApplicationDbContext`. The ingestor reuses `IHabitService` for write logic — don't duplicate `CreateHabitAsync`. Only after the habit lands successfully, set `ChatConversation.GeneratedHabitId`.

### B-6. Controller — `AiChatController`

`[Authorize] /api/ai/chat`

| Method | Route | Behavior |
|---|---|---|
| `POST` | `/api/ai/chat/conversations` | Body `{ message }`. Creates conversation, sends first turn, returns assistant reply. |
| `POST` | `/api/ai/chat/conversations/{id}/messages` | Append user turn, return assistant reply. Both turns persisted. If `intent="plan"`, body of the response includes `ingestion: { habitId, scheduledCount, overflowed }`. |
| `GET` | `/api/ai/chat/conversations` | List user's conversations. |
| `GET` | `/api/ai/chat/conversations/{id}` | Full message history. |
| `DELETE` | `/api/ai/chat/conversations/{id}` | Soft-delete. |

### B-7. Rate limiting / quota

This is a free LLM tier — abuse will burn the quota.

- Add `RateLimiter` middleware on `/api/ai/chat/*` per user: 20 messages / hour (sliding window). Use built-in `Microsoft.AspNetCore.RateLimiting` (.NET 7+).
- Optional: track daily token usage per user via the `TokensIn/TokensOut` columns, and refuse new turns once a soft cap (e.g. 100k tokens/day) is reached. Surface as `429` with `{ error, retryAfterSeconds }`.

### B-8. Tests

- `MissionPlanValidator_RejectsNonContiguousSequence`
- `MissionPlanValidator_RejectsEmptyTasks`
- `ChatService_HappyPath_ClarifyThenPlan` — mock `ILlmChatClient` to return clarify on turn 1, plan on turn 2; assert habit created + orbits scheduled.
- `ChatService_RetriesOnInvalidJson` — first mock response malformed, second valid → ingest succeeds; first column of conversation has both assistant turns persisted.
- `ChatService_RateLimited_Returns429`
- Integration-ish: end-to-end test that hits the real Groq API only when `GROQ_API_KEY` env var is set (skip otherwise) — used for smoke-testing prompt drift before each release.

### B-9. Sequencing inside §B

1. B-2 schema + migration.
2. B-3 Groq client + `ILlmChatClient` (just text-in / text-out, no parsing).
3. B-4 prompt + JSON validation pipeline.
4. B-5 `IChatService` (without ingestion) — store turns, return assistant reply.
5. B-5 `IMissionPlanIngestor` — closes the loop with §A's scheduler.
6. B-6 controller.
7. B-7 rate limit + token tracking.
8. B-8 tests.

---

## §C. Cross-cutting risks and open questions

| Risk | Mitigation |
|---|---|
| Timezones — users in `Asia/Ho_Chi_Minh` will hate UTC-only workday bounds. | §0.4's `UserPreference.Timezone` (IANA string). Convert workday bounds via `TimeZoneInfo.FindSystemTimeZoneById` at slot-compute time. Add a test `WorkdayBoundsAreRespectedAcrossDSTBoundary`. |
| Groq prompt drift between model versions. | Pin model name in `appsettings.json`. Smoke test (§B-8) catches schema breakage. |
| LLM hallucinates a 600-task plan. | Validator caps at 30 tasks; reject above and ask the model to consolidate. |
| Race between user-triggered `GenerateForHabitAsync` and nightly worker. | Both should `SELECT ... FOR UPDATE` the busy/orbit set in the window. Worker can also use an advisory lock per user (`pg_try_advisory_lock(hashtext(userId))`) and skip if held. |
| Free Groq quota exhausted at demo. | Document fallback to Gemini in `Infrastructure/LLM/`; provider swap is a one-line DI change because of `ILlmChatClient`. |
| Push delivery silently fails. | Log delivery receipts from Expo (`POST /push/getReceipts` after ~30 min). Out of scope for v1 but design `INotificationSender` so a `ReceiptPoller` worker can be added later. |

---

## §D. Definition of Done for this milestone

- ☐ `GET /api/orbits?from=...&to=...` returns generated orbits respecting busy times.
- ☐ Creating a Mission habit triggers scheduling that respects `sequenceOrder` and `endDate` deadline.
- ☐ Nightly worker keeps the rolling 14-day window full for Routine habits.
- ☐ `POST /api/orbits/{id}/done` updates streaks; idempotent on second call.
- ☐ Mobile push (or stub Expo push) fires 5 minutes before an orbit's `TimeStart`.
- ☐ `POST /api/ai/chat/conversations` with `"learn React in 30 days, 1h/day weekdays"` returns a created Mission and a `scheduledCount` > 0 within ≤ 5 seconds (excluding LLM latency).
- ☐ Re-sending the same prompt after rate limit boundary returns 429 with retry-after.
- ☐ Test suite: scheduler unit tests + chat happy-path test green in CI.
- ☐ CLAUDE.md §5 status table updated to mark Phase 3 ✅ and AI Chat ✅.
