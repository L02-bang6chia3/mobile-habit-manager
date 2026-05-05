using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Models;
using MobileApi.Enums;

namespace MobileApi.Services;

public interface IHabitService
{
    Task<Guid> CreateHabitAsync(Guid userId, CreateHabitRequest request);
    Task<IEnumerable<HabitResponse>> GetAllHabitsAsync(Guid userId);
    Task<HabitResponse?> GetHabitByIdAsync(Guid userId, Guid id);
    Task<bool> UpdateHabitAsync(Guid userId, Guid id, UpdateHabitRequest request);
    Task<bool> DeleteHabitAsync(Guid userId, Guid id);
}

public class HabitService(ApplicationDbContext dbContext) : IHabitService
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<Guid> CreateHabitAsync(Guid userId, CreateHabitRequest request)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
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
            await _dbContext.SaveChangesAsync();

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
                await _dbContext.SaveChangesAsync();
            }

            await transaction.CommitAsync();
            return newHabit.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<HabitResponse>> GetAllHabitsAsync(Guid userId)
    {
        var habits = await _dbContext.HabitTemplates
            .Where(h => h.UserId == userId && !h.IsDeleted)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();

        return habits.Select(h => new HabitResponse
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
            RecurrenceRule = h.RecurrenceRule,
            IsPublic = h.IsPublic,
            ClonedFromId = h.ClonedFromId,
            CurrentStreak = h.CurrentStreak,
            LongestStreak = h.LongestStreak,
            CreatedAt = h.CreatedAt
        });
    }

    public async Task<HabitResponse?> GetHabitByIdAsync(Guid userId, Guid id)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return null;

        var response = new HabitResponse
        {
            Id = habit.Id,
            UserId = habit.UserId,
            AuthorId = habit.AuthorId,
            Title = habit.Title,
            Description = habit.Description,
            Category = habit.Category,
            Type = habit.Type,
            StartDate = habit.StartDate,
            EndDate = habit.EndDate,
            RecurrenceRule = habit.RecurrenceRule,
            IsPublic = habit.IsPublic,
            ClonedFromId = habit.ClonedFromId,
            CurrentStreak = habit.CurrentStreak,
            LongestStreak = habit.LongestStreak,
            CreatedAt = habit.CreatedAt
        };

        if (habit.Type == HabitType.Mission)
        {
            var tasks = await _dbContext.MissionTasks
                .Where(t => t.HabitTemplateId == id && !t.IsDeleted)
                .OrderBy(t => t.SequenceOrder)
                .ToListAsync();

            response.MissionTasks = [.. tasks.Select(t => new MissionTaskResponse
            {
                Id = t.Id,
                HabitTemplateId = t.HabitTemplateId,
                Title = t.Title,
                Description = t.Description,
                SequenceOrder = t.SequenceOrder,
                EstimatedDuration = t.EstimatedDuration
            })];
        }

        return response;
    }

    public async Task<bool> UpdateHabitAsync(Guid userId, Guid id, UpdateHabitRequest request)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
        if (habit == null) return false;

        habit.Title = request.Title ?? habit.Title;
        habit.Description = request.Description ?? habit.Description;
        habit.Category = request.Category ?? habit.Category;
        habit.StartDate = request.StartDate ?? habit.StartDate;
        habit.EndDate = request.EndDate ?? habit.EndDate;

        var existingTasks = await _dbContext.MissionTasks.Where(t => t.HabitTemplateId == id && !t.IsDeleted).ToListAsync();

        if (request.Type.HasValue && request.Type.Value != habit.Type)
        {
            habit.Type = request.Type.Value;
            if (habit.Type == HabitType.Routine)
            {
                if (existingTasks.Count != 0)
                {
                    foreach (var task in existingTasks)
                    {
                        task.IsDeleted = true;
                    }
                }
            }
        }

        habit.RecurrenceRule = habit.Type == HabitType.Routine ? (request.RecurrenceRule ?? habit.RecurrenceRule) : null ;

        if (habit.Type == HabitType.Mission && request.MissionTasks != null)
        {
            var requestTaskIds = request.MissionTasks.Select(t => t.Id).OfType<Guid>().ToList();
            var tasksRemove = existingTasks.Where(t => !requestTaskIds.Contains(t.Id)).ToList();

            if (tasksRemove.Count != 0)
            {
                foreach (var task in tasksRemove)
                {
                    task.IsDeleted = true;
                }
            }

            foreach (var reqTask in request.MissionTasks)
            {
                if (reqTask.Id.HasValue)
                {
                    var taskUpdate = existingTasks.FirstOrDefault(t => t.Id == reqTask.Id.Value);
                    if (taskUpdate != null)
                    {
                        taskUpdate.Title = reqTask.Title ?? taskUpdate.Title;
                        taskUpdate.Description = reqTask.Description ?? taskUpdate.Description;
                        taskUpdate.SequenceOrder = reqTask.SequenceOrder ?? taskUpdate.SequenceOrder;
                        taskUpdate.EstimatedDuration = reqTask.EstimatedDuration ?? taskUpdate.EstimatedDuration;
                    }
                }
                else
                {
                    var newTask = new MissionTask
                    {
                        HabitTemplateId = habit.Id,
                        Title = reqTask.Title ?? string.Empty,
                        Description = reqTask.Description ?? string.Empty,
                        SequenceOrder = reqTask.SequenceOrder ?? 0,
                        EstimatedDuration = reqTask.EstimatedDuration ?? TimeSpan.Zero
                    };

                    _dbContext.MissionTasks.Add(newTask);
                }
            }
        }

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteHabitAsync(Guid userId, Guid id)
    {
        var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId && !h.IsDeleted);
            if (habit == null) return false;

            habit.IsDeleted = true;
            var existingTasks = await _dbContext.MissionTasks.Where(t => t.HabitTemplateId == id && !t.IsDeleted).ToListAsync();

            foreach (var task in existingTasks)
            {
                task.IsDeleted = true;
            }

            var pendingOrbits = await _dbContext.OrbitInstances.Where(o => o.HabitId == id && o.State == 0).ToListAsync();
            foreach (var orbit in pendingOrbits)
            {
                orbit.State = OrbitState.Delete;
                orbit.IsDeleted = true;
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
