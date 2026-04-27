using MobileApi.Enums;

namespace MobileApi.DTOs.Requests;

/*
 * ĐÂY CHÍNH LÀ REQ.BODY TRONG EXPRESS
 * DTO (Data Transfer Object) chỉ dùng để định nghĩa cấu trúc dữ liệu gửi lên.
 */
public class CreateHabitRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public HabitType Type { get; set; }
}
