# CLAUDE.md — ORBIT (mobile-habit-manager)

This file is the persistent project guide for any Claude session working in this repo. It is NOT the implementation plan — for that, see `docs/plan-phase3-gravity.md`.

---

## 1. Project at a Glance

**ORBIT** is an intelligent habit / mission scheduler built around a "Solar System" metaphor: the user is the Sun, habits are Planets in orbit, and "The Gravity" is the scheduling AI that keeps everything aligned around busy times pulled from Google Calendar. Long-term, an "AI Gravity Chat" lets users describe a goal in natural language ("I want to learn React in 30 days") and the system auto-generates a Mission with sequenced tasks and slots them onto the user's free time.

- **Frontend (planned)**: React Native mobile app — not yet started.
- **Backend (active)**: .NET 10 Web API, PostgreSQL (Neon), N-Tier architecture.
- **Integrations**: Google Calendar (busy times sync, social login), PayOS (payments, scaffolded), Groq free LLM API (planned for AI chat).

Reference docs already in the repo:
- `ORBIT_SYSTEM_DESIGN.md` — vision, terminology, full schema, roadmap (authoritative for product intent, Vietnamese).
- `implementation_plan.md` — high-level phase checklist (Vietnamese).
- `backend/MobileApi/BACKEND_GUIDE.md` — Express→.NET onboarding for the team.
- `docs/plan-phase3-gravity.md` — **detailed step-by-step plan for Phase 3 + Gravity AI Chat** (this is what to follow when implementing).

---

## 2. Repository Layout

```
mobile-habit-manager/
├── CLAUDE.md                          # this file
├── ORBIT_SYSTEM_DESIGN.md             # product vision + DB schema spec
├── implementation_plan.md             # phase checklist
├── docs/
│   └── plan-phase3-gravity.md         # Phase 3 + AI Chat detailed plan
├── backend/
│   ├── MobileBackend.sln
│   ├── .agents/skills/neon-postgres/SKILL.md
│   └── MobileApi/                     # the only project in the solution today
│       ├── Program.cs                 # composition root
│       ├── appsettings.json
│       ├── .env / .env.example
│       ├── Common/
│       │   ├── Abstractions/          # interfaces shared across services (e.g. IJwtProvider)
│       │   ├── Exceptions/            # ApplicationException + central handler
│       │   ├── Extensions/            # DependencyInjection.cs, ServiceCollectionExtensions.cs, MiddlewareExtensions.cs
│       │   └── Security/              # JwtProvider
│       ├── Controllers/               # thin HTTP layer, all [Authorize] by default
│       ├── DTOs/
│       │   ├── Requests/
│       │   └── Responses/
│       ├── Data/                      # ApplicationDbContext
│       ├── Enums/                     # HabitType, HabitStatus (TODO), OrbitState
│       ├── Infrastructure/            # External integrations
│       │   ├── BackgroundJobs/        # HostedServices (most are TODO stubs)
│       │   └── PayOS/                 # PayOSClient + PayOSService scaffolding
│       ├── Migrations/                # EF Core migrations (PostgreSQL)
│       ├── Models/                    # EF entities
│       └── Services/                  # business logic ("the brain")
```

---

## 3. Architecture Conventions (read the existing code, don't invent new patterns)

### Layering — N-Tier
- **Controllers** are thin: extract `userId` from the JWT claim, call a service, shape the HTTP response. No business logic.
- **Services** own business logic and DB access via `ApplicationDbContext`. Each service has an **interface** declared in the same `.cs` file as the implementation (e.g. `IHabitService` lives at the top of `HabitService.cs`).
- **Infrastructure** wraps third-party SDKs (Google, PayOS, …) and `HostedService` workers. Services depend on Infrastructure abstractions, not on raw SDK clients, so providers stay swappable.
- **DTOs** are split into `Requests/` and `Responses/`. Never expose `Models/` entities directly.

### DI registration
- Cross-cutting infrastructure (DbContext, JWT, CORS, Swagger) is wired in `Common/Extensions/DependencyInjection.cs::AddInfrastructure`.
- Application services are wired in `Common/Extensions/ServiceCollectionExtensions.cs::AddApplicationServices`. **Every new service must be added here.**
- `Program.cs` calls both extensions then `AddControllers()`. Keep `Program.cs` lean.

### Auth
- All controllers default to `[Authorize]`; opt out per-action only when needed (currently only `AuthController` endpoints).
- Inside controllers, get the current user with:
  ```csharp
  private Guid GetUserId() =>
      User.FindFirstValue(ClaimTypes.NameIdentifier) is { } s ? Guid.Parse(s) : Guid.Empty;
  ```
  Return `Unauthorized()` when it's `Guid.Empty`. (Pattern is repeated in `HabitsController`, `BusyTimesController`.)

### Persistence
- **Postgres** via `Npgsql.EntityFrameworkCore.PostgreSQL`. JSONB columns are typed `[Column(TypeName = "jsonb")]` on a `string?` property (see `HabitTemplate.RecurrenceRule`).
- **Migrations** live in `MobileApi/Migrations/`. Create with `dotnet ef migrations add <Name>`.
- **Soft delete** is the convention: entities expose `IsDeleted` (see `HabitTemplate`, `MissionTask`, `OrbitInstance`). Queries always filter `!x.IsDeleted`. Don't add hard `Remove()` calls without explicit reason — `BusyTimeService.DeleteBusyTimeAsync` is currently a hard delete and may be revisited.
- **Transactions** for multi-table writes use `BeginTransactionAsync` + try/commit/rollback (see `HabitService.CreateHabitAsync`).
- **Times are stored as UTC.** Always `.ToUniversalTime()` on input (see `BusyTimeService`).

### Response shape
- Success returns `{ data: ... }`; errors return `{ error: "..." }`. Stay consistent — the mobile client will rely on it.

### Validation
- `FluentValidation` is installed but minimally wired (only `LoginRequest`). New request DTOs that need structural validation should ship with a validator (`AbstractValidator<T>`) registered via `services.AddValidatorsFromAssembly(...)` — add that call to `AddApplicationServices` when the first new validator lands.

### Error handling
- Throw `ApplicationException(message, statusCode)` from services. `app.UseCustomExceptionHandler()` in the pipeline maps it to the JSON envelope. Don't return `BadRequest()` directly from services.

---

## 4. Current Schema (entities and what's actually mapped)

`ApplicationDbContext` registers: `Users`, `HabitTemplates`, `OrbitInstances`, `MissionTasks`, `BusyTimes`, `Orders`, `Payments`, `UserIntegrations`. Indexes today: `Users.Email` unique. That's it — no other indexes/relationships are declared in `OnModelCreating`. **Add FK and useful indexes as features land** (especially `OrbitInstances(UserId, TimeStart)` for the scheduler).

Status of each entity vs. the spec in `ORBIT_SYSTEM_DESIGN.md`:

| Entity | Status | Notes |
|---|---|---|
| `User` | ✅ Implemented | Role stored as `string`, not enum (acceptable). |
| `HabitTemplate` | ⚠️ Partial | `Status` (Private/Pending/Approved) **commented out** — `Enums/HabitStatus.cs` is a TODO stub. Needs to land for Habit Library. |
| `MissionTask` | ✅ Implemented | Used by Mission-type habits. |
| `OrbitInstance` | ✅ Implemented | `State` enum: `Pending=0, Done=1, Delay=2, Delete=3`. |
| `BusyTime` | ✅ Implemented | Has `BusyId` + `IsImported` for Google dedupe. |
| `Order` / `Payment` | 🟡 Scaffolded | Models + `PaymentsController` exist; webhook + idempotency to be implemented in Phase 4. |
| `UserIntegration` | ✅ Implemented | Stores Google access/refresh tokens. |

---

## 5. What's Done vs. What's Pending

### ✅ Done (read the code as the source of truth)
- Phase 1 — Auth (register/login with JWT, BCrypt password hashing, FluentValidation on `LoginRequest`).
- Phase 2 — Google OAuth2 + Calendar sync into `BusyTimes`; CRUD for Habits (including Mission templates with nested `MissionTask` create/update).
- Manual `BusyTimes` CRUD + on-demand `/api/busytimes/sync` endpoint.

### 🚧 Pending (where new work goes)
- **Phase 3 — The Gravity Scheduler** (`OrbitService.cs`, `OrbitInstancesController.cs`, `OrbitGenerationWorker.cs` are all stub files — they exist as `// TODO` markers). This is the next mission. See `docs/plan-phase3-gravity.md` §A.
- **Phase 3 — Push notifications** for OrbitInstance reminders. See plan §A-3.
- **Phase 4** — Habit Library (community sharing + admin approval); PayOS webhook + idempotency.
- **Phase 6 — Gravity AI Chat**. Detailed plan in `docs/plan-phase3-gravity.md` §B.
- **Phase 7** — Dynamic Rescheduling (depends on §A scheduler landing first).
- **Frontend** — entire React Native app.

### Stub files to watch
These are intentionally empty / `// TODO` and exist as placeholders. Don't delete them — fill them in:
- `Services/OrbitService.cs`
- `Controllers/OrbitInstancesController.cs`
- `Infrastructure/BackgroundJobs/OrbitGenerationWorker.cs`
- `Infrastructure/BackgroundJobs/GoogleCalendarSyncWorker.cs`
- `Enums/HabitStatus.cs`

---

## 6. Running the Backend

```pwsh
# from backend/MobileApi/
dotnet restore
dotnet ef database update         # apply migrations against the Postgres in .env
dotnet run                        # serves on the URL in Properties/launchSettings.json
```

Manual API testing: open `MobileApi/MobileApi.http` in VS Code with the REST Client extension. It contains ready-made requests for auth, habits, busy times, and Google sync.

### Env vars (`.env` — do not commit)
Required keys (see `.env.example` for shape):
- `DB_CONNECTION_STRING` — Neon Postgres connection string.
- `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_EXPIRY_MINUTES`.
- `Google__ClientId`, `Google__ClientSecret`, `Google__RedirectBaseUrl` — Google OAuth.
- *(planned)* `GROQ_API_KEY` — for AI Chat (Phase 6). Add to `.env.example` when wiring.

---

## 7. Working Style for This Repo

- **Mirror existing patterns.** When adding a service, copy the shape of `HabitService` (interface at top of file, constructor injection of `ApplicationDbContext`, transactional multi-table writes, UTC datetimes, soft delete). When adding a controller, copy `HabitsController` (thin, `GetUserId()` helper, `{ data }` / `{ error }` envelope).
- **Vietnamese comments are fine.** The existing codebase mixes English and Vietnamese comments (the team is Vietnamese). Don't rewrite existing Vietnamese comments to English unless asked. New comments can be in either — match the file you're editing.
- **No frontend yet.** Don't generate React Native scaffolding unless asked — Phase 5 is later.
- **Don't add unsolicited abstractions.** The N-Tier split is already established; resist the urge to introduce CQRS, MediatR, repositories, or unit-of-work patterns on top.
- **Migrations are append-only.** Never edit a committed migration. Add a new one.

---

## 8. Where to Look First When Stuck

| Question | Read this |
|---|---|
| "What's the product vision?" | `ORBIT_SYSTEM_DESIGN.md` |
| "What phase are we in?" | `implementation_plan.md` + §5 above |
| "How do I structure a new feature?" | `backend/MobileApi/BACKEND_GUIDE.md` |
| "How do I build the scheduler / AI chat?" | `docs/plan-phase3-gravity.md` |
| "How do I call an API locally?" | `backend/MobileApi/MobileApi.http` |
