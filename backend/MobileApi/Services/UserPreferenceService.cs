using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.DTOs.Requests;
using MobileApi.DTOs.Responses;
using MobileApi.Models;

namespace MobileApi.Services;

public interface IUserPreferenceService
{
    Task<UserPreferenceResponse> GetAsync(Guid userId);
    Task<UserPreferenceResponse> UpsertAsync(Guid userId, UpdateUserPreferenceRequest request);
}

public class UserPreferenceService(ApplicationDbContext db) : IUserPreferenceService
{
    public async Task<UserPreferenceResponse> GetAsync(Guid userId)
    {
        var pref = await FindOrCreateAsync(userId);
        return ToResponse(pref);
    }

    public async Task<UserPreferenceResponse> UpsertAsync(Guid userId, UpdateUserPreferenceRequest request)
    {
        var pref = await FindOrCreateAsync(userId);

        if (request.WorkdayStart.HasValue) pref.WorkdayStart = request.WorkdayStart.Value;
        if (request.WorkdayEnd.HasValue)   pref.WorkdayEnd   = request.WorkdayEnd.Value;
        if (request.MinSlotMinutes.HasValue) pref.MinSlotMinutes = request.MinSlotMinutes.Value;
        if (request.BufferMinutes.HasValue)  pref.BufferMinutes  = request.BufferMinutes.Value;
        if (request.Timezone != null)        pref.Timezone       = request.Timezone;

        await db.SaveChangesAsync();
        return ToResponse(pref);
    }

    private async Task<UserPreference> FindOrCreateAsync(Guid userId)
    {
        var pref = await db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
        if (pref != null) return pref;

        pref = new UserPreference { UserId = userId };
        db.UserPreferences.Add(pref);
        await db.SaveChangesAsync();
        return pref;
    }

    private static UserPreferenceResponse ToResponse(UserPreference p) => new()
    {
        UserId         = p.UserId,
        WorkdayStart   = p.WorkdayStart,
        WorkdayEnd     = p.WorkdayEnd,
        MinSlotMinutes = p.MinSlotMinutes,
        BufferMinutes  = p.BufferMinutes,
        Timezone       = p.Timezone
    };
}
