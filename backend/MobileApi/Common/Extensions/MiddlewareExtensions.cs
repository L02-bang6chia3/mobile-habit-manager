using Microsoft.AspNetCore.Diagnostics;
using MobileApi.Common.Exceptions;

namespace MobileApi.Common.Extensions;

public static class MiddlewareExtensions
{
    /// <summary>
    /// Xử lý lỗi tập trung - chuyển Exception thành HTTP response chuẩn
    /// </summary>
    
    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var feature = context.Features.Get<IExceptionHandlerFeature>();
                var ex = feature?.Error;

                var logger = context.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("GlobalExceptionHandler");

                var (status, message) = ex switch
                {
                    ValidationException e   => (400, e.Message),
                    UnauthorizedException e => (401, e.Message),
                    NotFoundException e     => (404, e.Message),
                    LlmException e          => (502, e.Message),
                    _                       => (500, "An unexpected error occurred.")
                };

                if (status == 500)
                    logger.LogError(ex, "Unhandled exception on {Method} {Path}",
                        context.Request.Method, context.Request.Path);

                var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
                var body = env.IsDevelopment() && status == 500
                    ? new { error = $"{ex?.GetType().Name}: {ex?.Message}", inner = ex?.InnerException?.Message, trace = ex?.StackTrace }
                    : (object)new { error = message };

                context.Response.StatusCode = status;
                await context.Response.WriteAsJsonAsync(body);
            });
        });
    }
}
