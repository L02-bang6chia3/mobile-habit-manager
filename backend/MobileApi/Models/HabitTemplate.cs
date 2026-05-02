using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MobileApi.Enums;

namespace MobileApi.Models;

/*
 * ==========================================
 * HƯỚNG DẪN DÀNH CHO BẠN (TỪ EXPRESS.JS SANG .NET)
 * ==========================================
 * - Trong Express/MongoDB, bạn thường dùng Mongoose Schema: 
 *   const HabitSchema = new mongoose.Schema({ title: String, ... })
 * 
 * - Trong .NET, bạn dùng một "Class" gọi là "Entity". Mỗi Property (thuộc tính) 
 *   sẽ tương ứng với một cột trong Database (PostgreSQL).
 * 
 * - "Guid" (Globally Unique Identifier) tương đương với ObjectId của MongoDB.
 * - "{ get; set; }" nghĩa là cho phép Đọc (get) và Ghi (set) dữ liệu vào biến này.
 */

public class HabitTemplate
{
    [Key] // Đánh dấu đây là Khóa chính (Primary Key)
    public Guid Id { get; set; } = Guid.NewGuid(); // Tự động sinh ID mới

    [Required] // Bắt buộc phải có (Tương đương required: true trong Mongoose)
    public Guid UserId { get; set; }

    public Guid AuthorId { get; set; }

    [Required]
    [MaxLength(200)] // Độ dài tối đa 200 ký tự
    public string Title { get; set; } = string.Empty; // Khởi tạo chuỗi rỗng để tránh lỗi Null

    public string Description { get; set; } = string.Empty;
    
    public string Category { get; set; } = string.Empty;

    // TODO: Tham chiếu tới thư mục Enums bạn sẽ thấy HabitType.
    public Enums.HabitType Type { get; set; } 

    // Dấu hỏi (?) nghĩa là trường này có thể bị Bỏ trống (Nullable - giống default: null)
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // PostgreSQL hỗ trợ lưu JSONB. Trong C#, ta tạm thời dùng string chứa chuỗi JSON
    [Column(TypeName = "jsonb")]
    public string? RecurrenceRule { get; set; }

    public bool IsPublic { get; set; } = false;

    // TODO: Bạn cần định nghĩa Enum HabitStatus tương tự HabitType
    // public Enums.HabitStatus Status { get; set; } 

    public Guid? ClonedFromId { get; set; }

    public int CurrentStreak { get; set; } = 0;
    
    public int LongestStreak { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Tương đương Date.now()

    public bool IsDeleted { get; set; } = false;
}
