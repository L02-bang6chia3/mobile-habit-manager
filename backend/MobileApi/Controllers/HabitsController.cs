using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HabitsController(IHabitService habitService) : ControllerBase
{
    private readonly IHabitService _habitService = habitService;

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest reqBody)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habitId = await _habitService.CreateHabitAsync(userId, reqBody);
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

        var habits = await _habitService.GetAllHabitsAsync(userId);
        return Ok(new { data = habits });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHabitById(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habit = await _habitService.GetHabitByIdAsync(userId, id);
        if (habit == null)
        {
            return NotFound(new { error = "Habit not found!" });
        }

        return Ok(new { data = habit });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHabit(Guid id, [FromBody] UpdateHabitRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habit = await _habitService.UpdateHabitAsync(userId, id, request);
        if (!habit)
        {
            return NotFound(new { error = "Habit not found!" });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHabit(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var habit = await _habitService.DeleteHabitAsync(userId, id);
        if (!habit)
        {
            return NotFound(new { error = "Habit not found!" });
        }

        return NoContent();
    }
}
