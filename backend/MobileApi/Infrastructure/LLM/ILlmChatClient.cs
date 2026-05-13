namespace MobileApi.Infrastructure.LLM;

public record LlmMessage(string Role, string Content);

public record LlmOptions(
    string? Model       = null,
    double? Temperature = null,
    int?    MaxTokens   = null,
    bool    JsonMode    = true);

public class LlmChatResponse
{
    public string Content   { get; init; } = string.Empty;
    public int    TokensIn  { get; init; }
    public int    TokensOut { get; init; }
}

public interface ILlmChatClient
{
    Task<LlmChatResponse> CompleteAsync(
        IReadOnlyList<LlmMessage> messages,
        LlmOptions options,
        CancellationToken ct);
}
