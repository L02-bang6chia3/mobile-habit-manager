using MobileApi.Common.Abstractions;

namespace MobileApi.Common.Time;

public class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
