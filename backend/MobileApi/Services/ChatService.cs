using System.Text.Json;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MobileApi.Common.Abstractions;
using MobileApi.Common.Exceptions;
using MobileApi.Data;
using MobileApi.DTOs.Responses;
using MobileApi.Enums;
using MobileApi.Infrastructure.LLM;
using MobileApi.Models;
using MobileApi.Services.AI;

namespace MobileApi.Services;

public interface IChatService
{
    Task<ChatConversationDetailResponse> CreateConversationAsync(Guid userId, string firstMessage, CancellationToken ct);
    Task<ChatMessageResponse> SendMessageAsync(Guid userId, Guid conversationId, string message, CancellationToken ct);
    Task<IEnumerable<ChatConversationResponse>> ListAsync(Guid userId);
    Task<ChatConversationDetailResponse?> GetAsync(Guid userId, Guid conversationId);
    Task<bool> DeleteAsync(Guid userId, Guid conversationId);
}

public class ChatService(
    ApplicationDbContext db,
    ILlmChatClient llmClient,
    IMissionPlanIngestor ingestor,
    IValidator<MissionPlanDto> validator,
    IOptions<GroqOptions> groqOpts,
    IClock clock) : IChatService
{
    private const string SystemPrompt = """
        You are "The Gravity," the AI planning engine of the ORBIT habit app.
        Your task: break a user's goal into a structured Mission (curriculum only — no calendar times).

        Always respond with a single valid JSON object:
        {
          "intent": "clarify" | "plan",
          "message": "<friendly text shown to the user>",
          "plan": null | {
            "title": "string",
            "description": "string",
            "category": "Education" | "Health" | "Career" | "Personal" | "Other",
            "startDate": "ISO-8601 UTC",
            "endDate": "ISO-8601 UTC",
            "estimatedTotalHours": <number>,
            "tasks": [
              { "title": "string", "description": "string", "sequenceOrder": 1, "estimatedDurationMinutes": 60 }
            ]
          }
        }

        Rules:
        - If goal duration, daily time available, or current skill level is unclear → intent="clarify", ask ONE specific question, plan=null.
        - Otherwise → intent="plan", 5–30 tasks, sequenceOrder contiguous from 1, SUM(estimatedDurationMinutes) ≈ estimatedTotalHours×60.
        - Never assign clock times to tasks — the backend schedules them.
        - Today (UTC): {{today}}
        """;

    private static readonly JsonSerializerOptions _jsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    // ── Public surface ────────────────────────────────────────────────────

    public async Task<ChatConversationDetailResponse> CreateConversationAsync(
        Guid userId, string firstMessage, CancellationToken ct)
    {
        var title = firstMessage.Length > 100 ? firstMessage[..100] : firstMessage;

        var conversation = new ChatConversation
        {
            UserId        = userId,
            Title         = title,
            CreatedAt     = clock.UtcNow,
            LastMessageAt = clock.UtcNow
        };
        db.ChatConversations.Add(conversation);
        await db.SaveChangesAsync(ct);

        await ProcessTurnAsync(userId, conversation, firstMessage, ct);

        return await GetAsync(userId, conversation.Id)
            ?? throw new InvalidOperationException("Conversation not found after create");
    }

    public async Task<ChatMessageResponse> SendMessageAsync(
        Guid userId, Guid conversationId, string message, CancellationToken ct)
    {
        var conversation = await db.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId && !c.IsDeleted, ct)
            ?? throw new NotFoundException("Conversation", conversationId);

        return await ProcessTurnAsync(userId, conversation, message, ct);
    }

    public async Task<IEnumerable<ChatConversationResponse>> ListAsync(Guid userId)
    {
        return await db.ChatConversations
            .Where(c => c.UserId == userId && !c.IsDeleted)
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new ChatConversationResponse
            {
                Id              = c.Id,
                Title           = c.Title,
                CreatedAt       = c.CreatedAt,
                LastMessageAt   = c.LastMessageAt,
                GeneratedHabitId = c.GeneratedHabitId
            })
            .ToListAsync();
    }

    public async Task<ChatConversationDetailResponse?> GetAsync(Guid userId, Guid conversationId)
    {
        var conv = await db.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId && !c.IsDeleted);
        if (conv == null) return null;

        var messages = await db.ChatMessages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return new ChatConversationDetailResponse
        {
            Id               = conv.Id,
            Title            = conv.Title,
            CreatedAt        = conv.CreatedAt,
            LastMessageAt    = conv.LastMessageAt,
            GeneratedHabitId = conv.GeneratedHabitId,
            Messages         = messages.Select(ToMessageResponse).ToList()
        };
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid conversationId)
    {
        var conv = await db.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId && !c.IsDeleted);
        if (conv == null) return false;

        conv.IsDeleted = true;
        await db.SaveChangesAsync();
        return true;
    }

    // ── Core turn logic ──────────────────────────────────────────────────

    private async Task<ChatMessageResponse> ProcessTurnAsync(
        Guid userId, ChatConversation conversation, string userMessage, CancellationToken ct)
    {
        // 1. Persist user turn
        db.ChatMessages.Add(new ChatMessage
        {
            ConversationId = conversation.Id,
            Role           = ChatRole.User,
            Content        = userMessage,
            CreatedAt      = clock.UtcNow
        });
        await db.SaveChangesAsync(ct);

        // 2. Build history (last 30 messages, oldest first)
        var history = await db.ChatMessages
            .Where(m => m.ConversationId == conversation.Id)
            .OrderByDescending(m => m.CreatedAt)
            .Take(30)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(ct);

        var llmMessages = BuildLlmMessages(history);
        var opts = new LlmOptions(
            Model:       groqOpts.Value.Model,
            Temperature: groqOpts.Value.Temperature,
            MaxTokens:   groqOpts.Value.MaxTokens,
            JsonMode:    true);

        // 3. Call LLM (with one retry on bad JSON)
        var (planDto, rawJson, tokensIn, tokensOut) =
            await CallWithRetryAsync(llmMessages, opts, ct);

        // 4. Ingest plan if present and not already done for this conversation
        IngestionResult? ingestion = null;
        if (planDto.Intent == "plan" && planDto.Plan != null && conversation.GeneratedHabitId == null)
        {
            ingestion = await ingestor.IngestAsync(userId, planDto.Plan, ct);
            conversation.GeneratedHabitId = ingestion.HabitId;
        }

        // 5. Persist assistant turn
        var assistantMsg = new ChatMessage
        {
            ConversationId = conversation.Id,
            Role           = ChatRole.Assistant,
            Content        = planDto.Message,
            RawJson        = planDto.Intent == "plan" ? rawJson : null,
            TokensIn       = tokensIn,
            TokensOut      = tokensOut,
            CreatedAt      = clock.UtcNow
        };
        db.ChatMessages.Add(assistantMsg);
        conversation.LastMessageAt = clock.UtcNow;
        await db.SaveChangesAsync(ct);

        return new ChatMessageResponse
        {
            Id        = assistantMsg.Id,
            Role      = "assistant",
            Content   = assistantMsg.Content,
            CreatedAt = assistantMsg.CreatedAt,
            Ingestion = ingestion
        };
    }

    private IReadOnlyList<LlmMessage> BuildLlmMessages(List<ChatMessage> history)
    {
        var list = new List<LlmMessage>
        {
            new("system", SystemPrompt.Replace("{{today}}", clock.UtcNow.ToString("yyyy-MM-dd")))
        };

        foreach (var m in history)
        {
            var role = m.Role switch
            {
                ChatRole.User      => "user",
                ChatRole.Assistant => "assistant",
                _                  => "system"
            };
            list.Add(new LlmMessage(role, m.Content));
        }
        return list;
    }

    private async Task<(MissionPlanDto dto, string rawJson, int tokensIn, int tokensOut)>
        CallWithRetryAsync(IReadOnlyList<LlmMessage> messages, LlmOptions opts, CancellationToken ct)
    {
        var resp = await llmClient.CompleteAsync(messages, opts, ct);
        var (dto, error) = TryParse(resp.Content);
        if (dto != null) return (dto, resp.Content, resp.TokensIn, resp.TokensOut);

        // Single retry with inline error feedback
        var retry = messages.ToList();
        retry.Add(new LlmMessage("assistant", resp.Content));
        retry.Add(new LlmMessage("user",
            $"Your reply was invalid JSON or failed validation: {error}. " +
            "Please reply again strictly matching the required JSON schema."));

        var retryResp = await llmClient.CompleteAsync(retry, opts, ct);
        var (retryDto, retryError) = TryParse(retryResp.Content);

        if (retryDto == null)
            throw new MobileApi.Common.Exceptions.ValidationException($"AI returned invalid response after retry: {retryError}");

        return (retryDto, retryResp.Content, retryResp.TokensIn, retryResp.TokensOut);
    }

    private (MissionPlanDto? dto, string? error) TryParse(string json)
    {
        try
        {
            var dto = JsonSerializer.Deserialize<MissionPlanDto>(json, _jsonOpts);
            if (dto == null) return (null, "null response");

            var result = validator.Validate(dto);
            if (!result.IsValid)
                return (null, string.Join("; ", result.Errors.Select(e => e.ErrorMessage)));

            return (dto, null);
        }
        catch (JsonException ex)
        {
            return (null, ex.Message);
        }
    }

    private static ChatMessageResponse ToMessageResponse(ChatMessage m) => new()
    {
        Id        = m.Id,
        Role      = m.Role.ToString().ToLower(),
        Content   = m.Content,
        CreatedAt = m.CreatedAt
    };
}
