using MobileApi.Services.AI;

namespace MobileApi.DTOs.Responses;

public class ChatMessageResponse
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Only present on assistant messages where a plan was ingested
    public IngestionResult? Ingestion { get; set; }
}
