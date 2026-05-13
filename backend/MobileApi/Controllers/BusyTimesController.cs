using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BusyTimesController(IBusyTimeService busyTimeService) : ControllerBase
{
    private readonly IBusyTimeService _busyTimeService = busyTimeService;

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;
    }

    [HttpGet]
    public async Task<IActionResult> GetBusyTimes()
    {
        var userId = GetUserId();
        var busyTimes = await _busyTimeService.GetUserBusyTimesAsync(userId);
        return Ok(new { data = busyTimes });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBusyTime(Guid id)
    {
        var userId = GetUserId();
        var busyTime = await _busyTimeService.GetBusyTimeByIdAsync(userId, id);
        if (busyTime == null) return NotFound(new { error = "Busy time not found" });
        return Ok(new { data = busyTime });
    }

    [HttpPost]
    public async Task<IActionResult> CreateBusyTime([FromBody] CreateBusyTimeRequest request)
    {
        var userId = GetUserId();
        var id = await _busyTimeService.CreateBusyTimeAsync(userId, request);
        return CreatedAtAction(nameof(GetBusyTime), new { id }, new { data = id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBusyTime(Guid id, [FromBody] UpdateBusyTimeRequest request)
    {
        var userId = GetUserId();
        var success = await _busyTimeService.UpdateBusyTimeAsync(userId, id, request);
        if (!success) return NotFound(new { error = "Busy time not found" });
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBusyTime(Guid id)
    {
        var userId = GetUserId();
        var success = await _busyTimeService.DeleteBusyTimeAsync(userId, id);
        if (!success) return NotFound(new { error = "Busy time not found" });
        return NoContent();
    }

    /// <summary>
    /// API kích hoạt đồng bộ lịch Google (Bước 6)
    /// </summary>
    [HttpPost("sync")]
    public async Task<IActionResult> SyncGoogle([FromQuery] DateTime? syncFrom)
    {
        var userId = GetUserId();
        await _busyTimeService.SyncGoogleCalendarAsync(userId, syncFrom);
        return Ok(new { message = "Đã đồng bộ lịch Google thành công." });
    }
}
