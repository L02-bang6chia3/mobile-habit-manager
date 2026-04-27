namespace MobileApi.Enums;

/*
 * HƯỚNG DẪN CHO NODE.JS DEV:
 * Trong JS/TS bạn thường dùng Union Type: type HabitType = "Routine" | "Mission";
 * Hoặc dùng Object mapping.
 * 
 * Trong C#, Enum là kiểu dữ liệu chuẩn và cực kỳ mạnh. 
 * Mặc định Routine sẽ có giá trị số là 0 trong DB, Mission là 1.
 * Entity Framework sẽ tự động map (chuyển đổi) qua lại giữa DB và Code.
 */
public enum HabitType
{
    Routine = 0, // Thói quen lặp lại (Chạy bộ, Uống nước)
    Mission = 1  // Lộ trình có deadline (Học React 30 ngày)
}
