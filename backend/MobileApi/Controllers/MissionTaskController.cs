using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/habits/{habitId}/tasks")]
public class MissionTaskController(IMissionTaskService missionTaskService) : BaseController
{
    private readonly IMissionTaskService _missionTaskService = missionTaskService;

    [HttpGet]
    public async Task<IActionResult> GetTasks(Guid habitId)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var tasks = await _missionTaskService.GetTaskByHabitAsync(userId, habitId);
        return Ok(new { data = tasks });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(Guid habitId, [FromBody] CreateMissionTaskRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var taskId = await _missionTaskService.CreateTaskAsync(userId, habitId, request);
        return CreatedAtAction(nameof(GetTasks), new { habitId }, new { data = taskId });
    }

    [HttpPatch("{taskId}")]
    public async Task<IActionResult> UpdateTask(Guid taskId, [FromBody] UpdateMissionTaskRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var updated = await _missionTaskService.UpdateTaskAsync(userId, taskId, request);
        return !updated ? NotFound(new { error = "Task not found" }) : NoContent();
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(Guid taskId)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var deleted = await _missionTaskService.DeleteTaskAsync(userId, taskId);
        return !deleted ? NotFound(new { error = "Task not found" }) : NoContent();
    }

    [HttpPut("reorder")]
    public async Task<IActionResult> ReorderTasks(Guid habitId, [FromBody] List<Guid> orderIds)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await _missionTaskService.ReorderTasksAsync(userId, habitId, orderIds);
        return !result ? NotFound(new { error = "Habit not found" }) : NoContent();
    }
}