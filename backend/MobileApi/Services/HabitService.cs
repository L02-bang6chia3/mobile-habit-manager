using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.Models;
using MobileApi.Enums;

namespace MobileApi.Services;

public interface IHabitService
{
    Task<Guid> CreateHabitAsync(Guid userId, CreateHabitRequest request);
    Task<IEnumerable<HabitTemplate>> GetAllHabitsAsync(Guid userId);
    Task<HabitTemplate?> GetHabitByIdAsync(Guid userId, Guid id);
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
                RecurrenceRule = request.RecurrenceRule,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.HabitTemplates.Add(newHabit);
            await _dbContext.SaveChangesAsync();

            if (request.Type == HabitType.Mission && request.MissionTasks != null)
            {
                var tasks = request.MissionTasks.Select(t => new MissionTask
                {
                    HabitTemplateId = newHabit.Id,
                    Title = t.Title,
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

    public async Task<IEnumerable<HabitTemplate>> GetAllHabitsAsync(Guid userId)
    {
        return await _dbContext.HabitTemplates
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.CreatedAt)
            .ToListAsync();
    }

    public async Task<HabitTemplate?> GetHabitByIdAsync(Guid userId, Guid id)
    {
        return await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
    }

    public async Task<bool> UpdateHabitAsync(Guid userId, Guid id, UpdateHabitRequest request)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        if (habit == null) return false;

        habit.Title = request.Title ?? habit.Title;
        habit.Description = request.Description ?? habit.Description;
        habit.Category = request.Category ?? habit.Category;
        if (request.Type != habit.Type)
        {
            habit.Type = request.Type;
        }

        // MissionTasks here

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteHabitAsync(Guid userId, Guid id)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        if (habit == null) return false;

        _dbContext.HabitTemplates.Remove(habit);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}
