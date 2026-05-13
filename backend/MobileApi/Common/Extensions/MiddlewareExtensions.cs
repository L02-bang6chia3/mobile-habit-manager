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

                var (status, message) = ex switch
                {
                    ValidationException e   => (400, e.Message),
                    UnauthorizedException e => (401, e.Message),
                    NotFoundException e     => (404, e.Message),
                    LlmException e          => (502, e.Message),
                    _                       => (500, "An unexpected error occurred.")
                };

                context.Response.StatusCode = status;
                await context.Response.WriteAsJsonAsync(new { error = message });
            });
        });
    }
}
