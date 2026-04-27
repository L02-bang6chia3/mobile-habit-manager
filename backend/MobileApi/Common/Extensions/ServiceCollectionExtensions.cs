using MobileApi.Common.Abstractions;
using MobileApi.Common.Security;

namespace MobileApi.Common.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Security
        services.AddScoped<IJwtProvider, JwtProvider>();

        // (Sau này đăng ký các Service khác tại đây)
        // Ví dụ: services.AddScoped<IHabitService, HabitService>();

        return services;
    }
}
