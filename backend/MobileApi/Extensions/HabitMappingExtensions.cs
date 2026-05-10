using MobileApi.DTOs.Responses;
using MobileApi.Models;
using MobileApi.Enums;

namespace MobileApi.Extensions;

public static class HabitMappingExtensions
{
    public static HabitResponse ToResponse(this HabitTemplate h, IEnumerable<MissionTask>? tasks = null) => new()
    {
        Id = h.Id,
        UserId = h.UserId,
        AuthorId = h.AuthorId,
        Title = h.Title,
        Description = h.Description,
        Category = h.Category,
        Type = h.Type,
        StartDate = h.StartDate,
        EndDate = h.EndDate,
        IsPublic = h.IsPublic,
        RecurrenceRule = h.RecurrenceRule,
        ClonedFromId = h.ClonedFromId,
        CurrentStreak = h.CurrentStreak,
        LongestStreak = h.LongestStreak,
        CreatedAt = h.CreatedAt,
        MissionTasks = tasks?.Select(t => t.ToResponse()).ToList()
    };
}