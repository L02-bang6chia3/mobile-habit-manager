# Hướng dẫn Cấu trúc Backend (Kiến trúc N-Tier / MVC)

Chào mừng bạn đến với dự án Backend .NET! Dự án này được thiết kế theo **Kiến trúc phân tầng (N-Tier Architecture)**.
Nếu bạn đã từng làm việc với Node.js/Express, bạn sẽ thấy cấu trúc này giống **100% cách chia thư mục của Express** (Controllers, Services, Models). 

Điều này giúp bạn học và code .NET với tốc độ cực nhanh mà không cần thay đổi tư duy!

---

## 1. Cấu trúc Thư mục Chi tiết

```text
backend/
├── MobileBackend.sln               # File giải pháp (Solution) - Quản lý tất cả project
└── MobileApi/                      # Project chính (Web API)
    ├── Controllers/                # Chứa các Endpoints (Tương đương routes/ + controllers/ của Express)
    │   └── HabitsController.cs
    ├── Services/                   # Nơi chứa logic nghiệp vụ (Tương đương services/ của Express)
    │   ├── IHabitService.cs        # Interface định nghĩa các hàm
    │   └── HabitService.cs         # Class chứa code thực tế (Lưu DB, gọi AI...)
    ├── Models/                     # Chứa các Database Schema (Tương đương models/ Mongoose)
    │   └── HabitTemplate.cs
    ├── DTOs/                       # Định nghĩa "hình dáng" của req.body và res.data
    │   ├── Requests/               # Ví dụ: CreateHabitRequest.cs
    │   └── Responses/              
    ├── Enums/                      # Các biến hằng số (Ví dụ: Routine = 0, Mission = 1)
    ├── Infrastructure/             # Giao tiếp với bên thứ 3 (PayOS, Google Calendar)
    │   ├── BackgroundJobs/         # Chứa các file chạy ngầm (Cronjobs)
    │   └── PayOS/                  # Logic gọi API thanh toán
    ├── Data/                       # Quản lý kết nối Database PostgreSQL
    │   └── ApplicationDbContext.cs # Cầu nối giữa Models và Database thực tế
    ├── Migrations/                 # Nơi lưu lịch sử thay đổi cấu trúc Database
    ├── Common/                     # Code dùng chung (Security, Utilities, Exceptions)
    ├── Properties/                 # Cấu hình môi trường chạy (launchSettings.json)
    ├── obj/ & bin/                 # Thư mục mã máy (Tự động sinh ra, không cần đụng tới)
    ├── Program.cs                  # File gốc khởi động ứng dụng (Giống index.js/app.js)
    └── .env                        # File chứa biến môi trường (Connection String, JWT Secret)
```

---

## 2. Giải thích chi tiết sự tương đồng với Express.js

### 1. Thư mục `Controllers` (Thay thế cho Routes)
Trong Express, bạn khai báo: `router.post('/api/habits', habitController.create)`
Trong .NET, bạn không cần file Routes rườm rà. Bạn viết thẳng vào **Controller**:
```csharp
[ApiController]
[Route("api/[controller]")] // Tự động nhận URL: /api/habits
public class HabitsController : ControllerBase 
{
    [HttpPost] // Lắng nghe phương thức POST
    public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest req) { ... }
}
```

### 2. Thư mục `DTOs` (Data Transfer Objects)
Trong Express, `req.body` là một cục JSON không rõ ràng, bạn phải tự `if/else` để kiểm tra.
Trong .NET, bạn tạo ra các class DTO (ví dụ `CreateHabitRequest`). .NET sẽ tự động map cái JSON người dùng gửi lên thành class này. Bạn sẽ luôn biết chắc chắn dữ liệu mình nhận được là gì.

### 3. Thư mục `Services`
Đây là nơi chứa "Não bộ" của hệ thống. Controller chỉ làm nhiệm vụ giao tiếp, còn việc kiểm tra điều kiện, lưu vào DB, gọi AI... đều phải viết trong **Services**.

### 4. Thư mục `Models`
Thay vì dùng Mongoose Schema (`new mongoose.Schema(...)`), bạn khai báo class C# bình thường. Mỗi "Property" (thuộc tính) sẽ biến thành 1 Cột trong Database.

### 5. Thư mục `Infrastructure`
Nơi chứa code kết nối ứng dụng với các "thế giới bên ngoài". 

**💡 Mẹo dễ nhớ (Não bộ vs Tay chân):**
- **`Services/` là Não bộ**: Chuyên làm tính toán, kiểm tra đúng sai (Ví dụ: Tính giờ rảnh, kiểm tra đủ tiền mua Premium). Não bộ không trực tiếp làm việc chân tay.
- **`Infrastructure/` là Tay chân**: Nhận lệnh từ não để tương tác với bên ngoài (Ví dụ: Tay cầm mã QR từ PayOS về, Mắt đọc lịch từ Google Calendar, hay các Worker thức đêm để chạy ngầm).

**Tại sao phải chia ra? (Nguyên lý dễ thay máu)**
- **Trong Express**: Bạn thường nhét luôn code gọi API PayOS vào file `services/payment.js`. Lỡ ngày mai chuyển sang dùng Momo, bạn phải xóa nát cái file Service đi viết lại.
- **Trong .NET**: Nhờ tách Tay chân ra riêng, nếu đổi sang Momo, bạn chỉ cần ném cái "Tay PayOS" đi, thay bằng "Tay Momo" trong thư mục `Infrastructure`. Còn Não bộ (`PaymentService`) thì **không phải sửa một dòng code nào**, vì não bộ chỉ ra lệnh "thanh toán đi" chứ không quan tâm tay nào làm!

### 6. Thư mục `Migrations` (Lịch sử Database)
- **Trong Node.js**: Giống với thư mục `migrations/` của Prisma hoặc Sequelize.
- **Trong .NET**: Khi bạn thay đổi code ở `Models` (ví dụ thêm 1 cột mới), .NET sẽ tự động tạo ra một file lịch sử nằm trong thư mục này. Nó giúp bạn theo dõi việc Database thay đổi qua từng ngày và có thể "quay ngược thời gian" nếu cần.

### 7. Thư mục `Properties`, `obj`, và `bin`
- `Properties/`: Chứa `launchSettings.json` (tương đương với các script `"start": "node server.js --port 5000"` trong `package.json`). Dùng để cấu hình Port chạy ở máy tính Local.
- **`obj/` (Object)**: Đây là "bãi rác tạm" hay bản "nháp" của hệ thống. Khi bắt đầu biên dịch code, .NET sẽ quăng các mảnh mã trung gian và tải thư viện vào đây.
- **`bin/` (Binary)**: Đây là nơi chứa kết quả cuối cùng. Sau khi ráp nối các bản nháp ở `obj/`, .NET sẽ xuất ra các file chạy (.dll, .exe) vào thư mục này.

**💡 Mẹo**: `obj/` và `bin/` giống hệt thư mục `dist/` hoặc `build/` của TypeScript. Cứ mỗi lần bạn bấm "Run", hệ thống sẽ tự sinh ra chúng. Vì thế, bạn **tuyệt đối không cần quan tâm**, không được đẩy lên GitHub, và **có thể xóa thẳng tay** bất cứ lúc nào nếu thấy dự án bị lỗi lặt vặt (hệ thống sẽ tự tạo lại cái mới sạch sẽ hơn).

---

## 3. Luồng hoạt động của một API (Workflow)

Hãy tưởng tượng luồng đi của tính năng **"Tạo Thói quen"**:

1. **Request**: Mobile App gửi JSON lên `POST /api/habits`.
2. **Controller**: `HabitsController` nhận yêu cầu. Nó ép kiểu JSON thành class `CreateHabitRequest` (trong thư mục DTOs).
3. **Gọi Service**: Controller truyền cục data đó qua `HabitService`.
4. **Xử lý Logic**: `HabitService` kiểm tra hợp lệ, gom dữ liệu lại thành `HabitTemplate` (trong thư mục Models).
5. **Lưu Database**: `HabitService` gọi `ApplicationDbContext` để lưu `HabitTemplate` xuống PostgreSQL.
6. **Response**: Trả về cho Controller chữ `Ok` (tương đương `res.status(200)`), và Controller gửi lại JSON cho Mobile App.

---

## 4. Các File quan trọng ở gốc

### Program.cs
Đây là "Trạm điều khiển" (Giống `app.js` trong Express). Nó thực hiện:
1. Nạp biến môi trường từ file `.env`.
2. Đăng ký Database và cấu hình JWT.
3. Đăng ký (Dependency Injection) các Service (như `builder.Services.AddScoped<IHabitService, HabitService>();`).
4. Kích hoạt `app.MapControllers()` để mở cổng API.

### appsettings.json và .env
Nơi chứa các cấu hình bảo mật. 
**Lưu ý:** Tuyệt đối không commit file `.env` lên GitHub. Hãy copy mẫu từ `.env.example`.

---
*Chúc bạn code .NET thật bay bổng và tốc độ như viết Node.js!*
