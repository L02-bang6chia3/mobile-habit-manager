using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Models;
using MobileApi.Enums;
using MobileApi.Extensions;
using MobileApi.Common.Exceptions;

namespace MobileApi.Services;

public interface IHabitService
{
    Task<Guid> CreateHabitAsync(Guid userId, CreateHabitRequest request);
    Task<PagedResponse<HabitResponse>> GetAllHabitsAsync(Guid userId, PaginationRequest pagination);
    Task<HabitResponse?> GetHabitByIdAsync(Guid userId, Guid id);
    Task<bool> UpdateHabitAsync(Guid userId, Guid id, UpdateHabitRequest request);
    Task<bool> DeleteHabitAsync(Guid userId, Guid id);
}

public class HabitService(ApplicationDbContext dbContext) : IHabitService
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<Guid> CreateHabitAsync(Guid userId, CreateHabitRequest request)
    {
        var newHabit = new HabitTemplate
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            AuthorId = userId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Type = request.Type,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            RecurrenceRule = request.Type == HabitType.Routine ? request.RecurrenceRule : null,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.HabitTemplates.Add(newHabit);

        if (request.Type == HabitType.Mission && request.MissionTasks != null && request.MissionTasks.Count != 0)
        {
            var tasks = request.MissionTasks.Select(t => new MissionTask
            {
                HabitTemplateId = newHabit.Id,
                Title = t.Title,
                Description = t.Description,
                SequenceOrder = t.SequenceOrder,
                EstimatedDuration = t.EstimatedDuration
            });
            _dbContext.MissionTasks.AddRange(tasks);
        }

        await _dbContext.SaveChangesAsync();
        return newHabit.Id;
    }

    public async Task<PagedResponse<HabitResponse>> GetAllHabitsAsync(Guid userId, PaginationRequest pagination)
    {
        var query = _dbContext.HabitTemplates
                              .Where(h => h.UserId == userId && !h.IsDeleted)
                              .AsNoTracking()
                              .OrderByDescending(h => h.CreatedAt);
        var totalCount = await query.CountAsync();
        var habits = await query.Skip((pagination.Page - 1) * pagination.PageSize)
                                .Take(pagination.PageSize)
                                .ToListAsync();

        return new PagedResponse<HabitResponse>
        {
            Data = habits.Select(h => h.ToResponse()),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<HabitResponse?> GetHabitByIdAsync(Guid userId, Guid id)
    {
        var habit = await _dbContext.HabitTemplates.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return null;

        var tasks = habit.Type == HabitType.Mission
                                ? await _dbContext.MissionTasks
                                        .Where(t => t.HabitTemplateId == id && !t.IsDeleted)
                                        .OrderBy(t => t.SequenceOrder)
                                        .ToListAsync()
                                : null;

        return habit.ToResponse(tasks);
    }

    public async Task<bool> UpdateHabitAsync(Guid userId, Guid id, UpdateHabitRequest request)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return false;

        if (request.Type.HasValue && request.Type.Value != habit.Type)
        {
            throw new ValidationException("Habit type cannot be changed after creation.");
        }

        habit.Title = request.Title ?? habit.Title;
        habit.Description = request.Description ?? habit.Description;
        habit.Category = request.Category ?? habit.Category;
        habit.StartDate = request.StartDate ?? habit.StartDate;
        habit.EndDate = request.EndDate ?? habit.EndDate;
        habit.RecurrenceRule = habit.Type == HabitType.Routine ? (request?.RecurrenceRule ?? habit.RecurrenceRule) : null;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteHabitAsync(Guid userId, Guid id)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return false;

        habit.IsDeleted = true;
        await _dbContext.MissionTasks.Where(t => t.HabitTemplateId == id && !t.IsDeleted)
                                     .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsDeleted, true));

        await _dbContext.OrbitInstances.Where(o => o.HabitId == id && o.State == OrbitState.Pending)
                                     .ExecuteUpdateAsync(s => s
                                                .SetProperty(o => o.IsDeleted, true)
                                                .SetProperty(o => o.State, OrbitState.Delete));

        await _dbContext.SaveChangesAsync();
        return true;
    }
}
