using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/preferences")]
public class PreferencesController(IUserPreferenceService prefService) : ControllerBase
{
    private Guid GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) is { } s ? Guid.Parse(s) : Guid.Empty;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var pref = await prefService.GetAsync(userId);
        return Ok(new { data = pref });
    }

    [HttpPut]
    public async Task<IActionResult> Upsert([FromBody] UpdateUserPreferenceRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var pref = await prefService.UpsertAsync(userId, request);
        return Ok(new { data = pref });
    }
}
