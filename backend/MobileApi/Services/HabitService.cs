using MobileApi.DTOs.Requests;

namespace MobileApi.Services;

// Giao diện (Interface) để mô tả Service này có những hàm gì
public interface IHabitService
{
    Task<Guid> CreateHabitAsync(CreateHabitRequest request);
}

/*
 * ĐÂY LÀ PHẦN TƯƠNG ĐƯƠNG VỚI services/ TRONG EXPRESS.JS
 * Nơi chứa toàn bộ logic (Lưu DB, Tính toán, AI...)
 */
public class HabitService : IHabitService
{
    // Constructor để gọi Database
    // private readonly ApplicationDbContext _dbContext;
    // public HabitService(ApplicationDbContext dbContext) { _dbContext = dbContext; }

    public async Task<Guid> CreateHabitAsync(CreateHabitRequest request)
    {
        // Logic xử lý tạo Habit sẽ nằm ở đây
        // var newHabit = new HabitTemplate { Title = request.Title, ... };
        // _dbContext.Habits.Add(newHabit);
        // await _dbContext.SaveChangesAsync();
        
        await Task.Delay(10); // Giả lập async delay
        return Guid.NewGuid(); // Giả lập ID
    }
}
