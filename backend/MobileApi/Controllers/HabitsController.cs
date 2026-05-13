using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HabitsController(IHabitService habitService, IOrbitService orbitService) : ControllerBase
{
    private Guid GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) is { } s ? Guid.Parse(s) : Guid.Empty;

    [HttpPost]
    public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest reqBody)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habitId = await habitService.CreateHabitAsync(userId, reqBody);
        await orbitService.GenerateForHabitAsync(userId, habitId);

        return CreatedAtAction(
            nameof(GetHabitById),
            new { id = habitId },
            new { data = habitId }
        );
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHabit()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habits = await habitService.GetAllHabitsAsync(userId);
        return Ok(new { data = habits });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHabitById(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habit = await habitService.GetHabitByIdAsync(userId, id);
        if (habit == null) return NotFound(new { error = "Habit not found!" });

        return Ok(new { data = habit });
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateHabit(Guid id, [FromBody] UpdateHabitRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await habitService.UpdateHabitAsync(userId, id, request);
        if (!ok) return NotFound(new { error = "Habit not found!" });

        // Re-schedule after any structural change to the habit
        await orbitService.GenerateForHabitAsync(userId, id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHabit(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await habitService.DeleteHabitAsync(userId, id);
        if (!ok) return NotFound(new { error = "Habit not found!" });

        return NoContent();
    }

    // Manual re-schedule trigger (e.g. after syncing new busy times)
    [HttpPost("{id}/schedule")]
    public async Task<IActionResult> Schedule(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var count = await orbitService.GenerateForHabitAsync(userId, id);
        return Ok(new { data = new { scheduledCount = count } });
    }
}
