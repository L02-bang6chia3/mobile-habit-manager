using Microsoft.EntityFrameworkCore;
using MobileApi.Common.Exceptions;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Extensions;
using MobileApi.Enums;
using MobileApi.Models;

namespace MobileApi.Services;

public interface IMissionTaskService
{
    Task<IEnumerable<MissionTaskResponse>> GetTaskByHabitAsync(Guid userId, Guid habitId);
    Task<Guid> CreateTaskAsync(Guid userId, Guid habitId, CreateMissionTaskRequest request);
    Task<bool> UpdateTaskAsync(Guid userId, Guid taskId, UpdateMissionTaskRequest request);
    Task<bool> DeleteTaskAsync(Guid userId, Guid taskId);
    Task<bool> ReorderTasksAsync(Guid userId, Guid habitId, List<Guid> orderIds);
}

public class MissionTaskService(ApplicationDbContext dbContext) : IMissionTaskService
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<IEnumerable<MissionTaskResponse>> GetTaskByHabitAsync(Guid userId, Guid habitId)
    {
        var habitExists = await _dbContext.HabitTemplates.AnyAsync(h => h.Id == habitId && h.UserId == userId && !h.IsDeleted);
        if (!habitExists) return [];

        return await _dbContext.MissionTasks.AsNoTracking()
                                            .Where(t => t.HabitTemplateId == habitId && !t.IsDeleted)
                                            .OrderBy(t => t.SequenceOrder)
                                            .Select(t => t.ToResponse())
                                            .ToListAsync();
    }

    public async Task<Guid> CreateTaskAsync(Guid userId, Guid habitId, CreateMissionTaskRequest request)
    {
        var habit = await _dbContext.HabitTemplates.FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId && !h.IsDeleted) ?? throw new NotFoundException("Habit", habitId);
        if (habit.Type != HabitType.Mission)
        {
            throw new ValidationException("Cannot add tasks to a Routine habit");
        }

        var task = new MissionTask
        {
            HabitTemplateId = habitId,
            Title = request.Title,
            Description = request.Description,
            SequenceOrder = request.SequenceOrder,
            EstimatedDuration = request.EstimatedDuration
        };

        _dbContext.MissionTasks.Add(task);
        await _dbContext.SaveChangesAsync();
        return task.Id;
    }

    public async Task<bool> UpdateTaskAsync(Guid userId, Guid taskId, UpdateMissionTaskRequest request)
    {
        var task = await _dbContext.MissionTasks.FirstOrDefaultAsync(t => t.Id == taskId
                                                                    && !t.IsDeleted
                                                                    && _dbContext.HabitTemplates.Any(h => h.Id == t.HabitTemplateId
                                                                                                    && h.UserId == userId
                                                                                                    && !h.IsDeleted));
        if (task == null) return false;

        task.Title = request.Title ?? task.Title;
        task.Description = request.Description ?? task.Description;
        task.SequenceOrder = request.SequenceOrder ?? task.SequenceOrder;
        task.EstimatedDuration = request.EstimatedDuration ?? task.EstimatedDuration;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteTaskAsync(Guid userId, Guid taskId)
    {
        var task = await _dbContext.MissionTasks.FirstOrDefaultAsync(t => t.Id == taskId
                                                                    && !t.IsDeleted
                                                                    && _dbContext.HabitTemplates.Any(h => h.Id == t.HabitTemplateId
                                                                                                    && h.UserId == userId
                                                                                                    && !h.IsDeleted));
        if (task == null) return false;

        task.IsDeleted = true;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderTasksAsync(Guid userId, Guid habitId, List<Guid> orderIds)
    {
        var habitExists = await _dbContext.HabitTemplates.AnyAsync(h => h.Id == habitId && h.UserId == userId && !h.IsDeleted);
        if (!habitExists) return false;

        var tasks = await _dbContext.MissionTasks.Where(t => t.HabitTemplateId == habitId && !t.IsDeleted).ToListAsync();

        for (int i = 0; i < orderIds.Count; i++)
        {
            var task = tasks.FirstOrDefault(t => t.Id == orderIds[i]);
            task?.SequenceOrder = i + 1;
        }

        await _dbContext.SaveChangesAsync();
        return true;
    }
}