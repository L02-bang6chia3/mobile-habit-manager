namespace MobileApi.DTOs.Responses;

public class ChatConversationResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastMessageAt { get; set; }
    public Guid? GeneratedHabitId { get; set; }
}

public class ChatConversationDetailResponse : ChatConversationResponse
{
    public List<ChatMessageResponse> Messages { get; set; } = [];
}
