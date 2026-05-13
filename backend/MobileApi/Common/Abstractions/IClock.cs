namespace MobileApi.Common.Abstractions;

public interface IClock
{
    DateTime UtcNow { get; }
}
