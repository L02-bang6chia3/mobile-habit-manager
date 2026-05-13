using MobileApi.Common.Extensions;
using DotNetEnv;

// 1. Load environment variables
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// 2. Add Services
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplicationServices(); // Services: JWT, Auth, Habit, Google
builder.Services.AddControllers();

var app = builder.Build();

// 3. Configure Pipeline (Tách vào MiddlewareExtensions.cs)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ORBIT Mobile API v1");
        
        // Cấu hình ClientId và ClientSecret cho OAuth2 Flow
        options.OAuthClientId(Environment.GetEnvironmentVariable("Google__ClientId"));
        options.OAuthClientSecret(Environment.GetEnvironmentVariable("Google__ClientSecret")); // Thêm dòng này
        options.OAuthAppName("ORBIT Habit Manager");
        options.OAuthUsePkce(); 
    });
}

app.UseCustomExceptionHandler(); // Xử lý lỗi tập trung
app.UseHttpsRedirection();
app.UseCors("MobilePolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); 

app.Run();
