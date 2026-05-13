using FluentValidation;
using MobileApi.Common.Abstractions;
using MobileApi.Common.Security;
using MobileApi.Common.Time;
using MobileApi.Infrastructure.BackgroundJobs;
using MobileApi.Infrastructure.LLM;
using MobileApi.Services;
using MobileApi.Services.AI;
using MobileApi.Services.Scheduling;

namespace MobileApi.Common.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Infrastructure abstractions
        services.AddSingleton<IClock, SystemClock>();

        // Security
        services.AddScoped<IJwtProvider, JwtProvider>();

        // Application services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IHabitService, HabitService>();
        services.AddScoped<IGoogleCalendarService, GoogleCalendarService>();
        services.AddScoped<IBusyTimeService, BusyTimeService>();
        services.AddScoped<IUserPreferenceService, UserPreferenceService>();

        // Scheduler
        services.AddSingleton<IGravityScheduler, GravityScheduler>();
        services.AddScoped<IOrbitService, OrbitService>();

        // Background workers
        services.AddHostedService<OrbitGenerationWorker>();

        // AI / Gravity Chat
        services.AddSingleton<ILlmChatClient, GroqChatClient>();
        services.AddScoped<IMissionPlanIngestor, MissionPlanIngestor>();
        services.AddScoped<IValidator<MissionPlanDto>, MissionPlanValidator>();
        services.AddScoped<IChatService, ChatService>();

        return services;
    }
}
