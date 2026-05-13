using MobileApi.DTOs.Responses;
using MobileApi.Models;

namespace MobileApi.Extensions;

public static class UserMappingExtensions
{
    public static UserResponse ToResponse(this User u) => new()
    {
        Id = u.Id,
        Email = u.Email,
        Username = u.Username,
        Role = u.Role,
        Avatar = u.Avatar,
        Birthday = u.Birthday,
        CreatedAt = u.CreatedAt
    };
}