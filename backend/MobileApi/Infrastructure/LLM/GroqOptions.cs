namespace MobileApi.Infrastructure.LLM;

public class GroqOptions
{
    public string BaseUrl    { get; set; } = "https://api.groq.com/openai/v1/";
    public string Model      { get; set; } = "llama-3.3-70b-versatile";
    public double Temperature { get; set; } = 0.3;
    public int    MaxTokens  { get; set; } = 4096;
}
