using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MobileApi.Common.Abstractions;
using MobileApi.Common.Security;
using MobileApi.Data;
using MobileApi.Services;
using FluentValidation;
using System.Text;

namespace MobileApi.Common.Extensions;

public static class DependencyInjection
{
    /// <summary>
    /// Cấu hình các dịch vụ hạ tầng: Database, JWT, Swagger, CORS
    /// </summary>

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // --- Database ---
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
            ?? configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Database=MobileDb;Username=postgres;Password=postgres";

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // --- JWT Authentication ---
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? configuration["JwtSettings:SecretKey"];
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? configuration["JwtSettings:Issuer"];
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? configuration["JwtSettings:Audience"];

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret!))
                };
            });

        // --- CORS ---
        services.AddCors(options =>
        {
            options.AddPolicy("MobilePolicy", policy =>
            {
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            });
        });

        // --- Swagger with JWT Support ---
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "ORBIT Mobile API", Version = "v1" });

            // 1. JWT Bearer (Để test thủ công)
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Nhập JWT Token: Bearer {token}"
            });

            // 2. Full OAuth2 Flow (Google)
            options.AddSecurityDefinition("GoogleCalendar", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
                        TokenUrl = new Uri("https://oauth2.googleapis.com/token"),
                        Scopes = new Dictionary<string, string>
                        {
                            { "openid", "Xác thực danh tính" },
                            { "email", "Lấy địa chỉ email" },
                            { "profile", "Lấy thông tin cá nhân" },
                            { "https://www.googleapis.com/auth/calendar", "Toàn quyền quản lý Google Calendar" }
                        }
                    }
                }
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                },
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "GoogleCalendar" }
                    },
                    new[] { "openid", "email", "profile", "https://www.googleapis.com/auth/calendar" }
                }
            });
        });

        return services;
    }

}
