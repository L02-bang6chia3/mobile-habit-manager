using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : BaseController
{
    private readonly IUserService _userService = userService;

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var user = await _userService.GetMeAsync(userId);
        return user == null ? NotFound() : Ok(new { data = user });
    }

    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();
        
        var updated = await _userService.UpdateMeAsync(userId, request);
        return !updated ? NotFound() : NoContent();
    }

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetAllUsers([FromQuery] PaginationRequest pagination)
    {
        var result = await _userService.GetUsersAsync(pagination);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return user == null ? NotFound() : Ok(new { data = user });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var deleted = await _userService.AdminDeleteUserAsync(id);
        return !deleted ? NotFound() : NoContent();
    }
}