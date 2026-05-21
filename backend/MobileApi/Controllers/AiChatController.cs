using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MobileApi.DTOs.Requests;
using MobileApi.Services;

namespace MobileApi.Controllers;

[Authorize]
[ApiController]
[Route("api/ai/chat")]
[EnableRateLimiting("AiChat")]
public class AiChatController(IChatService chatService) : ControllerBase
{
    private Guid GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) is { } s ? Guid.Parse(s) : Guid.Empty;

    [HttpPost("conversations")]
    public async Task<IActionResult> CreateConversation(
        [FromBody] CreateConversationRequest request,
        CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await chatService.CreateConversationAsync(userId, request.Message, ct);
        return CreatedAtAction(nameof(GetConversation), new { id = result.Id }, new { data = result });
    }

    [HttpPost("conversations/{id}/messages")]
    public async Task<IActionResult> SendMessage(
        Guid id,
        [FromBody] SendMessageRequest request,
        CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await chatService.SendMessageAsync(userId, id, request.Message, ct);
        return Ok(new { data = result });
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> ListConversations()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var list = await chatService.ListAsync(userId);
        return Ok(new { data = list });
    }

    [HttpGet("conversations/{id}")]
    public async Task<IActionResult> GetConversation(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var conv = await chatService.GetAsync(userId, id);
        if (conv == null) return NotFound(new { error = "Conversation not found" });

        return Ok(new { data = conv });
    }

    [HttpDelete("conversations/{id}")]
    public async Task<IActionResult> DeleteConversation(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var ok = await chatService.DeleteAsync(userId, id);
        if (!ok) return NotFound(new { error = "Conversation not found" });

        return NoContent();
    }
}
