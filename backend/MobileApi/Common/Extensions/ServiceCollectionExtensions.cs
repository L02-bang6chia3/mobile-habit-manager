using MobileApi.Common.Abstractions;
using MobileApi.Common.Security;
using MobileApi.Services;

namespace MobileApi.Common.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Security
        services.AddScoped<IJwtProvider, JwtProvider>();

        // (Sau này đăng ký các Service khác tại đây)
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
