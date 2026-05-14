using Microsoft.EntityFrameworkCore;
using MobileApi.Data;
using MobileApi.Models;
using MobileApi.DTOs.Requests;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;


namespace MobileApi.Services;

public interface IBusyTimeService
{
    Task<IEnumerable<BusyTime>> GetUserBusyTimesAsync(Guid userId);
    Task<BusyTime?> GetBusyTimeByIdAsync(Guid userId, Guid id);
    Task<Guid> CreateBusyTimeAsync(Guid userId, CreateBusyTimeRequest request);
    Task<bool> UpdateBusyTimeAsync(Guid userId, Guid id, UpdateBusyTimeRequest request);
    Task<bool> DeleteBusyTimeAsync(Guid userId, Guid id);
    
    // Logic Step 6
    Task SyncGoogleCalendarAsync(Guid userId, DateTime? syncFrom = null);
}

public class BusyTimeService(ApplicationDbContext dbContext, IGoogleCalendarService googleCalendarService) : IBusyTimeService
{
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly IGoogleCalendarService _googleCalendarService = googleCalendarService;

    public async Task<IEnumerable<BusyTime>> GetUserBusyTimesAsync(Guid userId)
    {
        return await _dbContext.BusyTimes
            .Where(b => b.UserId == userId)
            .OrderBy(b => b.StartTime)
            .ToListAsync();
    }

    public async Task<BusyTime?> GetBusyTimeByIdAsync(Guid userId, Guid id)
    {
        return await _dbContext.BusyTimes
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
    }

    public async Task<Guid> CreateBusyTimeAsync(Guid userId, CreateBusyTimeRequest request)
    {
        var busyTime = new BusyTime
        {
            UserId = userId,
            Title = request.Title,
            StartTime = request.StartTime.ToUniversalTime(),
            EndTime = request.EndTime.ToUniversalTime(),
            IsImported = false
        };
        _dbContext.BusyTimes.Add(busyTime);
        await _dbContext.SaveChangesAsync();
        return busyTime.Id;
    }

    public async Task<bool> UpdateBusyTimeAsync(Guid userId, Guid id, UpdateBusyTimeRequest request)
    {
        var existing = await _dbContext.BusyTimes
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (existing == null) return false;

        // Chỉ cập nhật trường nào được cung cấp (null = không thay đổi)
        if (request.Title != null)     existing.Title = request.Title;
        if (request.StartTime != null) existing.StartTime = request.StartTime.Value.ToUniversalTime();
        if (request.EndTime != null)   existing.EndTime = request.EndTime.Value.ToUniversalTime();
        // IsImported & BusyId không cho User sửa thủ công

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBusyTimeAsync(Guid userId, Guid id)
    {
        var busyTime = await _dbContext.BusyTimes
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (busyTime == null) return false;

        _dbContext.BusyTimes.Remove(busyTime);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    // ==============================================
    // BƯỚC 6: ĐỒNG BỘ GOOGLE CALENDAR
    // ==============================================

    public async Task SyncGoogleCalendarAsync(Guid userId, DateTime? syncFrom = null)
    {
        // 1. Lấy Google Calendar Service đã được xác thực (từ Bước 5)
        var service = await _googleCalendarService.GetCalendarServiceAsync(userId);
        if (service == null) return;

        // 2. Cấu hình khoảng thời gian đồng bộ (Mặc định: từ nay đến 30 ngày tới)
        var timeMin = syncFrom ?? DateTime.UtcNow;
        var timeMax = DateTime.UtcNow.AddDays(30);

        var request = service.Events.List("primary");
        request.TimeMinDateTimeOffset = new DateTimeOffset(timeMin, TimeSpan.Zero);
        request.TimeMaxDateTimeOffset = new DateTimeOffset(timeMax, TimeSpan.Zero);
        request.SingleEvents = true; // Để bung các sự kiện lặp lại (recurring) thành các thực thể riêng
        request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

        // 3. Gọi API Google
        var events = await request.ExecuteAsync();
        if (events.Items == null) return;

        // 4. Lưu vào Database
        foreach (var item in events.Items)
        {
            // Bỏ qua sự kiện không có thời gian bắt đầu/kết thúc (All day events)
            if (item.Start?.DateTimeRaw == null || item.End?.DateTimeRaw == null) continue;

            var startTime = DateTime.Parse(item.Start.DateTimeRaw).ToUniversalTime();
            var endTime = DateTime.Parse(item.End.DateTimeRaw).ToUniversalTime();
            var busyId = $"google_{item.Id}"; // Key duy nhất để tránh lưu trùng

            var existing = await _dbContext.BusyTimes
                .FirstOrDefaultAsync(b => b.UserId == userId && b.BusyId == busyId);

            if (existing != null)
            {
                // Cập nhật nếu sự kiện đã tồn tại (Google event bị chỉnh sửa)
                existing.Title = item.Summary ?? "Google Event";
                existing.StartTime = DateTime.Parse(item.Start.DateTimeRaw).ToUniversalTime();
                existing.EndTime = DateTime.Parse(item.End.DateTimeRaw).ToUniversalTime();
            }
            else
            {
                // Thêm mới
                _dbContext.BusyTimes.Add(new BusyTime
                {
                    UserId = userId,
                    BusyId = busyId,
                    Title = item.Summary ?? "Google Event",
                    StartTime = DateTime.Parse(item.Start.DateTimeRaw).ToUniversalTime(),
                    EndTime = DateTime.Parse(item.End.DateTimeRaw).ToUniversalTime(),
                    IsImported = true
                });
            }
        }

        await _dbContext.SaveChangesAsync();
    }
}
