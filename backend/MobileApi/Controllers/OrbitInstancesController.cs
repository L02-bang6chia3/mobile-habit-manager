using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.Common.Abstractions;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/orbits")]
public class OrbitInstancesController(IOrbitService orbitService, IClock clock) : ControllerBase
{
    private Guid GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) is { } s ? Guid.Parse(s) : Guid.Empty;

    [HttpGet]
    public async Task<IActionResult> GetOrbits(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var fromUtc = (from ?? clock.UtcNow).ToUniversalTime();
        var toUtc   = (to   ?? clock.UtcNow.AddDays(14)).ToUniversalTime();

        var orbits = await orbitService.GetOrbitsAsync(userId, fromUtc, toUtc);
        return Ok(new { data = orbits });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrbit(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var orbit = await orbitService.GetOrbitByIdAsync(userId, id);
        if (orbit == null) return NotFound(new { error = "Orbit not found" });

        return Ok(new { data = orbit });
    }

    [HttpPost("{id}/done")]
    public async Task<IActionResult> MarkDone(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await orbitService.MarkDoneAsync(userId, id);
        if (!ok) return NotFound(new { error = "Orbit not found" });

        return NoContent();
    }

    [HttpPost("{id}/delay")]
    public async Task<IActionResult> Delay(Guid id, [FromBody] DelayOrbitRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await orbitService.DelayAsync(userId, id, request);
        if (!ok) return NotFound(new { error = "Orbit not found" });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await orbitService.SoftDeleteAsync(userId, id);
        if (!ok) return NotFound(new { error = "Orbit not found" });

        return NoContent();
    }
}
