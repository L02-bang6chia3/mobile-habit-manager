using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Extensions;

namespace MobileApi.Services;

public interface IUserService
{
    // USER
    Task<UserResponse?> GetMeAsync(Guid userId);
    Task<bool> UpdateMeAsync(Guid userId, UpdateUserRequest request);

    // ADMIN
    Task<PagedResponse<UserResponse>> GetUsersAsync(PaginationRequest pagination);
    Task<UserResponse?> GetUserByIdAsync(Guid targetId);
    Task<bool> AdminDeleteUserAsync(Guid targetId);
}

public class UserService(ApplicationDbContext dbContext) : IUserService
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    // USER
    public async Task<UserResponse?> GetMeAsync(Guid userId)
    {
        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        return user?.ToResponse();
    }

    public async Task<bool> UpdateMeAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        user.Username = request.Username ?? user.Username;
        user.Avatar = request.Avatar ?? user.Avatar;
        user.Birthday = request.Birthday ?? user.Birthday;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    // ADMIN
    public async Task<PagedResponse<UserResponse>> GetUsersAsync(PaginationRequest pagination)
    {
        var query = _dbContext.Users.AsNoTracking().OrderBy(u => u.CreatedAt);
        var totalCount = await query.CountAsync();
        var users = await query.Skip((pagination.Page - 1) * pagination.PageSize)
                               .Take(pagination.PageSize)
                               .ToListAsync();

        return new PagedResponse<UserResponse>
        {
            Data = users.Select(u => u.ToResponse()),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<UserResponse?> GetUserByIdAsync(Guid targetId)
    {
        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == targetId);
        return user?.ToResponse();
    }

    public async Task<bool> AdminDeleteUserAsync(Guid targetId)
    {
        var userExists = await _dbContext.Users.AnyAsync(u => u.Id == targetId);
        if (!userExists) return false;

        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            await _dbContext.OrbitInstances.Where(o => o.UserId == targetId).ExecuteDeleteAsync();
            await _dbContext.MissionTasks.Where(m => _dbContext.HabitTemplates
                                             .Where(h => h.UserId == targetId)
                                             .Select(h => h.Id)
                                             .Contains(m.HabitTemplateId))
                                         .ExecuteDeleteAsync();
            await _dbContext.HabitTemplates.Where(h => h.UserId == targetId).ExecuteDeleteAsync();
            await _dbContext.Users.Where(u => u.Id == targetId).ExecuteDeleteAsync();

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