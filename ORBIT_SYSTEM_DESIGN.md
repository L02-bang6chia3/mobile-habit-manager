# 🚀 ORBIT - Intelligent Habit Ecosystem | System Design Document

## 1. Tầm nhìn & Triết lý (Project Vision)
ORBIT định nghĩa lại việc quản lý thời gian thông qua ẩn dụ về **Hệ Mặt Trời**. Người dùng là trung tâm (Mặt trời), thói quen là các hành tinh xoay quanh, và AI đóng vai trò là Lực hấp dẫn giữ cho mọi thứ luôn cân bằng.

### Thuật ngữ "Vũ trụ" (Terminology Mapping)
| Thuật ngữ kỹ thuật | Thuật ngữ ORBIT | Ý nghĩa |
| :--- | :--- | :--- |
| **Scheduling** | Aligning | Căn chỉnh các hành tinh vào quỹ đạo tối ưu. |
| **Habit Instance** | Orbiting | Một lần thực hiện thói quen thành công. |
| **Busy Time** | Space-time Distortion | Những khoảng thời gian bận rộn làm biến dạng lịch trình. |
| **Notification** | Signal | Tín hiệu từ trung tâm nhắc nhở thực hiện nhiệm vụ. |
| **Overload Alert** | Trajectory Alert | Cảnh báo khi quỹ đạo quá dày đặc, dễ xảy ra va chạm (stress). |

---

## 2. Kiến trúc Hệ thống (System Architecture)

- **Mobile App (Frontend)**: Xây dựng bằng **React Native**, đảm nhận giao diện "Solar Dashboard" đa nền tảng (iOS/Android) và hiệu ứng chuyển động mượt mà.
- **Backend (Web API)**: Sử dụng **.NET 10** với kiến trúc **Vertical Slice**, xử lý logic căn chỉnh quỹ đạo, tích hợp PayOS và Google Calendar.
- **Background Processing**: Sử dụng Hosted Services (hoặc Worker Services) chạy ngầm để xử lý các tác vụ nặng như đồng bộ Google Calendar và sinh lịch trình tự động mà không làm treo luồng API chính.
- **Database (PostgreSQL)**: Lưu trữ dữ liệu quan hệ, đảm bảo tính nhất quán cho các thực thể thói quen và thanh toán. Tận dụng kiểu dữ liệu `JSONB` cho các cấu hình linh hoạt.
- **AI Engine (The Gravity)**: Thuật toán cốt lõi giúp tối ưu hóa lịch trình dựa trên độ ưu tiên, mức năng lượng và các vùng "không gian biến dạng" (Busy Times).

---

## 3. Thiết kế Cơ sở dữ liệu (Database Schema)

Dưới đây là cấu trúc các bảng được thiết kế tối ưu trên PostgreSQL:

### 3.1. Users (Người dùng)
- `id`: `Guid` (Primary Key)
- `email`: `string` (Unique)
- `password_hash`: `string`
- `username`: `string`
- `role`: `Enum` (Admin, Customer, Premium_Customer)
- `avatar`: `string` (URL)
- `birthday`: `DateTime`
- `created_at`: `DateTime`

### 3.2. HabitTemplates (Mẫu thói quen & Lộ trình - Bản thiết kế không gian)
Đóng vai trò là khuôn mẫu để sinh ra các hành tinh lặp lại hoặc một chiến dịch/lộ trình (Mission) có thời hạn.
- `id`: `Guid` (PK)
- `user_id`: `Guid` (FK -> Users)
- `author_id`: `Guid`
- `title`: `string`
- `description`: `string`
- `category`: `string` 
- `type`: `Enum` (Routine, Mission) - *Routine (Lặp lại), Mission (Lộ trình có deadline)*
- `start_date`: `DateTime?` - *Ngày bắt đầu (Dành cho Mission)*
- `end_date`: `DateTime?` - *Deadline kết thúc (Dành cho Mission)*
- `recurrence_rule`: `JSONB` - *Quy tắc lặp (Dành cho Routine)*
- `is_public`: `boolean` - *Dùng cho Thư viện chia sẻ*
- `status`: `Enum` (Private, Pending_Approval, Approved) - *Trạng thái duyệt của Admin*
- `cloned_from_id`: `Guid?` (FK -> HabitTemplates)
- `current_streak`: `int` 
- `longest_streak`: `int` 
- `created_at`: `DateTime`

### 3.3. MissionTasks (Các chặng trong Lộ trình)
Chỉ áp dụng khi HabitTemplate có `type = Mission`. Định nghĩa các bước cần học/làm theo thứ tự.
- `id`: `Guid` (PK)
- `habit_template_id`: `Guid` (FK -> HabitTemplates)
- `title`: `string` (VD: "Học React Components")
- `description`: `string`
- `sequence_order`: `int` (Thứ tự thực hiện: 1, 2, 3...)
- `estimated_duration`: `TimeSpan` (Thời gian dự kiến để hoàn thành chặng này)

### 3.4. OrbitInstances (Các hành tinh thực tế)
Các thực thể "Hành tinh" đang thực sự xoay quanh quỹ đạo hàng ngày (Task cụ thể).
- `id`: `Guid` (PK)
- `user_id`: `Guid` (FK -> Users)
- `habit_id`: `Guid` (FK -> HabitTemplates)
- `mission_task_id`: `Guid?` (FK -> MissionTasks - *Null nếu là Routine, có giá trị nếu thuộc Mission*)
- `title`: `string` (Tên task cụ thể, VD "Học React Components")
- `time_start`: `DateTime`
- `time_end`: `DateTime`
- `duration`: `TimeSpan`
- `state`: `Enum` (Done, Pending, Delete, Delay)

### 3.5. BusyTimes (Thời gian bận rộn)
Các vùng "Biến dạng không gian" AI cần tránh khi sắp xếp lịch.
- `id`: `Guid` (PK)
- `user_id`: `Guid` (FK -> Users)
- `busy_start`: `DateTime`
- `busy_end`: `DateTime`
- `description`: `string`

### 3.6. Orders & Payments (Thanh toán qua PayOS)

**Orders (Đơn hàng nội bộ)**
- `id`: `string` (Mã đơn: ORB_123456)
- `user_id`: `Guid` (FK -> Users)
- `status`: `Enum` (Pending, Done, Cancelled)
- `amount`: `decimal`
- `created_at`: `DateTime`

**Payments (Chi tiết giao dịch PayOS)**
- `id`: `Guid` (PK)
- `order_id`: `string` (FK -> Orders)
- `payos_order_code`: `long` (Unique)
- `payos_link_id`: `string`
- `checkout_url`: `string`
- `amount`: `decimal`
- `status`: `string`
- `webhook_event_id`: `string` (Unique - Chống duplicate webhook)
- `paid_at`: `DateTime?`

### 3.7. UserIntegrations (Kết nối ngoại vi)
- `id`: `Guid` (PK)
- `user_id`: `Guid` (FK -> Users)
- `provider`: `string` (Ví dụ: "GoogleCalendar")
- `access_token`: `string`
- `refresh_token`: `string`
- `expiry_date`: `DateTime`
- `sync_token`: `string`

---

## 4. Chiến lược Sinh Hành Tinh & Lộ trình (Recurrence & Mission Strategy)

Để tránh làm quá tải cơ sở dữ liệu và giữ tính linh hoạt khi lịch trình thay đổi, hệ thống áp dụng cơ chế **Rolling Window (Cửa sổ thời gian trượt)**:
Hệ thống xử lý hai loại "Hành tinh" khác nhau:

**A. Routine (Thói quen lặp lại - Cửa sổ 14 ngày)**
1. **Phạm vi khởi tạo**: Khi tạo Habit dạng Routine (như Uống nước, Chạy bộ), hệ thống chỉ sinh ra các `OrbitInstances` cho **14 ngày tới**.
2. **Cronjob chạy ngầm**: Quét hàng đêm để "bổ sung" hành tinh lặp lại vào quỹ đạo tương lai, giữ nguyên cửa sổ 14 ngày.

**B. Mission (Lộ trình có thời hạn - Space Mission)**
1. **Căn chỉnh toàn cục**: Dựa vào `start_date` và `end_date`, AI phân bổ đều các `MissionTasks` thành các `OrbitInstances` rải rác trong suốt khoảng thời gian chiến dịch.
2. **Deadline-Driven**: Thuật toán ưu tiên nhét các chặng (tasks) chưa hoàn thành vào các khe rảnh sao cho kịp deadline, đảm bảo tuân thủ đúng `sequence_order` (VD: học bài 1 xong mới được xếp lịch học bài 2).

**C. Thích ứng linh hoạt**: Khi phát sinh `BusyTimes` đột xuất, thuật toán The Gravity sẽ dời các hành tinh lân cận sang khe rảnh khác, ưu tiên giữ nguyên cấu trúc chuỗi của Mission và tránh vi phạm Deadline.

---

## 5. Cơ chế Đồng bộ Google Calendar (Sync Flow)

1. **OAuth2 Flow**: Người dùng cấp quyền từ App React Native, lưu Token vào **UserIntegrations**.
2. **Đồng bộ nền (Background Sync)**: Tác vụ chạy ngầm định kỳ kéo các sự kiện mới nhất từ Google Calendar và ánh xạ thành **BusyTimes** để thuật toán né tránh.
3. **Đồng bộ 2 chiều (Tùy chọn)**: Đẩy các **OrbitInstances** ngược lên Google Calendar như một sự kiện nhắc nhở.

---

## 6. Phân định Tính năng (Feature Breakdown)

### 6.1. Giai đoạn MVP (Tính năng Cốt lõi)
1. **Auto-Scheduling (Căn chỉnh cơ bản)**: Thuật toán tự động quét và nhét các `OrbitInstances` (Task) vào các khoảng thời gian rảnh được đồng bộ từ Google Calendar (Né các `BusyTimes`).
2. **Signals (Cơ chế Nhắc nhở)**: Gửi thông báo (chuông, rung haptic) đến điện thoại người dùng khi đến lịch trình thực hiện thói quen.
3. **Habit Library (Thư viện Thói quen Cộng đồng)**:
   - Người dùng đăng tải mẫu thói quen của họ lên hệ thống.
   - Admin kiểm duyệt để xuất hiện trên thư viện chung.
   - Người dùng khác có thể xem, **Copy (Clone)** về tài khoản cá nhân, chỉnh sửa thông số và đồng bộ vào quỹ đạo của họ.

### 6.2. Giai đoạn Post-MVP / Premium (Mở khóa qua PayOS)
1. **Dynamic Rescheduling (Căn chỉnh Động)**: Khi có một sự kiện bận đột xuất (Busy đột ngột), hệ thống tự động dời các `OrbitInstances` bị chèn ép sang các khung giờ rảnh khác một cách thông minh.
2. **AI Gravity Chat (Trợ lý Vũ trụ AI)**: Người dùng chat với AI để mô tả mục tiêu (VD: "Tôi muốn học IELTS 7.0 trong 6 tháng"). AI tự động phân tích lộ trình, bóc tách thành các Habit và Task chi tiết, sau đó tự động sắp xếp (integrate) vào các khung giờ rảnh của người dùng đó.
3. **Monetization (Thanh toán)**: Tích hợp PayOS. Tính năng cơ bản (MVP) miễn phí. Tính năng "AI Chat" và "Dynamic Rescheduling" yêu cầu mua gói Premium.

---

## 7. Trải nghiệm Giao diện (UI/UX Guidelines)

- **Phong cách Minimalist**: Giao diện "Solar Dashboard" sử dụng thiết kế tối giản, sạch sẽ. Ưu tiên tông màu tối (Dark Mode) chuẩn mực với các đường nét thanh mảnh, tạo độ tương phản cao cho các "Hành tinh" (thói quen).
- **Tương tác chạm (Haptic Feedback)**: Tích hợp rung phản hồi khi hoàn thành một OrbitInstance hoặc khi nhận thông báo "Signals", mang lại cảm giác cao cấp và thỏa mãn.
- **Thiết lập chu kỳ lặp tinh gọn**: Thay vì hiển thị form phức tạp, ưu tiên các Preset (Hàng ngày, Cuối tuần, 3 lần/tuần) qua các nút bấm bo góc. Thiết lập nâng cao chỉ xuất hiện qua dạng trượt Bottom Sheet.

---

## 8. Kiến trúc Chịu tải & Xử lý Đồng thời (Concurrency & Scalability)

Khi hệ thống có lượng truy cập lớn (hàng ngàn người dùng Đăng ký/Đăng nhập hoặc Thanh toán cùng lúc), ORBIT áp dụng các chiến lược sau để đảm bảo không bị sập và không sai lệch dữ liệu:

### 8.1. Xử lý Nút thắt Đăng nhập / Đăng ký (Auth Bottlenecks)
- **Bất đồng bộ (Async/Await)**: Toàn bộ API của .NET 10 được viết theo chuẩn `async/Task`, giúp giải phóng luồng xử lý (thread) trong khi chờ Database phản hồi, giúp server chịu được lượng Request khổng lồ.
- **Connection Pooling**: PostgreSQL (thông qua Npgsql) tự động duy trì một "hồ chứa" các kết nối sẵn sàng. Thay vì mở/đóng kết nối liên tục gây nghẽn, các request sẽ dùng chung pool này.
- **Rate Limiting (Giới hạn tỷ lệ)**: Áp dụng Middleware của .NET để giới hạn số lần gọi API `/login` hoặc `/register` từ 1 IP trong 1 phút, ngăn chặn tấn công DDoS hoặc Brute-force làm treo Database.

### 8.2. Xử lý Xung đột Thanh toán (Payment Concurrency & Race Conditions)
Thanh toán là khu vực nhạy cảm nhất. Nếu PayOS gửi 2 webhook báo thành công cùng một lúc cho 1 đơn hàng, hệ thống phải xử lý triệt để:
- **Idempotency Key (Khóa chống trùng lặp)**: Trường `webhook_event_id` trong bảng `Payments` được đánh index `UNIQUE`. Khi 2 request cùng cố gắng insert/update 1 event, Database sẽ văng lỗi ở request thứ 2, chặn đứng việc cộng tiền 2 lần.
- **Database Transactions & Row-Level Lock**: Khi cập nhật trạng thái đơn hàng (từ `Pending` -> `Paid`), hệ thống sử dụng Transaction và khóa dòng (`SELECT FOR UPDATE`). Request thứ 2 đến phải xếp hàng chờ request 1 làm xong, và khi request 1 xong (trạng thái đã là Paid), request 2 sẽ tự động bỏ qua (không xử lý lại).
- **Message Queue (Kế hoạch mở rộng)**: Nếu lượng thanh toán quá khủng khiếp, các Webhook từ PayOS sẽ không đập thẳng vào DB mà được đẩy vào một hàng đợi (ví dụ: RabbitMQ hoặc .NET Channels). Một Worker chạy ngầm sẽ từ tốn lấy từng webhook ra xử lý tuần tự, đảm bảo Server không bao giờ bị nghẽn CPU.

---

## 9. Lộ trình Phát triển (Development Roadmap)
- **Phase 1 (Core MVP)**: Cấu trúc Database, Auth, CRUD cơ bản, và luồng Đồng bộ Google Calendar 1 chiều.
- **Phase 2 (Scheduling & Signals MVP)**: Thuật toán nhét Task vào giờ rảnh (Auto-Scheduling), và thiết lập cơ chế Push Notification.
- **Phase 3 (Habit Library MVP)**: Xây dựng tính năng Thư viện (Đăng tải, Admin Duyệt, Copy, Sync).
- **Phase 4 (Monetization)**: Tích hợp PayOS để nâng cấp tài khoản Premium.
- **Phase 5 (Advanced AI & Rescheduling)**: Thuật toán dời lịch tự động khi bận đột xuất, và tích hợp Trợ lý AI Chat sinh lộ trình cá nhân hóa.