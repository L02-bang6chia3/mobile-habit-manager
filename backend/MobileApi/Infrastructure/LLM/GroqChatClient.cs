using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace MobileApi.Infrastructure.LLM;

public class GroqChatClient(IHttpClientFactory httpFactory, IOptions<GroqOptions> opts) : ILlmChatClient
{
    private static readonly JsonSerializerOptions _json = new()
    {
        PropertyNamingPolicy    = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public async Task<LlmChatResponse> CompleteAsync(
        IReadOnlyList<LlmMessage> messages,
        LlmOptions options,
        CancellationToken ct)
    {
        var body = new ReqBody(
            Model:          options.Model      ?? opts.Value.Model,
            Messages:       messages.Select(m => new ReqMsg(m.Role, m.Content)).ToList(),
            ResponseFormat: options.JsonMode ? new ReqFormat("json_object") : null,
            Temperature:    options.Temperature ?? opts.Value.Temperature,
            MaxTokens:      options.MaxTokens   ?? opts.Value.MaxTokens);

        var json    = JsonSerializer.Serialize(body, _json);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY") ?? string.Empty;
        var client = httpFactory.CreateClient("Groq");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await client.PostAsync("chat/completions", content, ct);
        var raw      = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"Groq API error {(int)response.StatusCode}: {raw}");

        var resp = JsonSerializer.Deserialize<RespBody>(raw, _json)
            ?? throw new InvalidOperationException("Empty Groq response");

        return new LlmChatResponse
        {
            Content   = resp.Choices[0].Message.Content,
            TokensIn  = resp.Usage?.PromptTokens    ?? 0,
            TokensOut = resp.Usage?.CompletionTokens ?? 0
        };
    }

    // Private request/response shapes (snake_case handled by _json options)
    private record ReqBody(
        string Model,
        List<ReqMsg> Messages,
        [property: JsonPropertyName("response_format")] ReqFormat? ResponseFormat,
        double Temperature,
        [property: JsonPropertyName("max_tokens")] int MaxTokens);

    private record ReqMsg(string Role, string Content);
    private record ReqFormat(string Type);
    private record RespBody(List<RespChoice> Choices, RespUsage? Usage);
    private record RespChoice(RespMsg Message);
    private record RespMsg(string Content);
    private record RespUsage(int PromptTokens, int CompletionTokens);
}
