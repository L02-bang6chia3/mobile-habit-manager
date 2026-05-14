# Lộ trình Hiện thực Dự án ORBIT (N-Tier Architecture)

Lộ trình này được chia rõ ràng thành 2 chặng: MVP (Sản phẩm khả thi tối thiểu để nộp bài, bao gồm cả Thanh toán, Cộng đồng & Thông báo) và Post-MVP (Các tính năng Trí tuệ nhân tạo nâng cao).

---

# PHẦN 1: SẢN PHẨM KHẢ THI TỐI THIỂU (MVP)

## Phase 1: Nền tảng Database & Xác thực
- [ ] Bước 1: Hoàn thiện Models (Entities)
  - Viết code cho các file: User.cs, HabitTemplate.cs, OrbitInstance.cs, BusyTime.cs, Order.cs, Payment.cs.
- [ ] Bước 2: Cấu hình ApplicationDbContext & Chạy Migrations
  - Khai báo các DbSet<T> và đẩy cấu trúc lên Neon PostgreSQL.
- [ ] Bước 3: Hiện thực Auth (Đăng ký / Đăng nhập)
  - Viết AuthService băm mật khẩu, tạo JWT Token.

## Phase 2: Thói quen Cơ bản & Google Calendar
- [ ] Bước 4: CRUD HabitTemplate
  - Viết HabitService và HabitsController để Quản lý Thói quen.
- [ ] Bước 5: Tích hợp OAuth2 Google Calendar
  - Xin quyền và lưu access_token vào bảng UserIntegrations.
- [ ] Bước 6: Kéo lịch Google (BusyTimes)
  - Viết BusyTimeService gọi Google API để lấy danh sách sự kiện và lưu vào DB.

## Phase 3: Thuật toán Tự động Xếp lịch & Thông báo (The Gravity MVP)
- [ ] Bước 7: Thuật toán Sinh Lịch Cơ bản (Rolling Window)
  - Thuật toán tìm "khe rảnh" trên lịch (tránh BusyTimes) và nhét OrbitInstance (Task) vào lịch cho 14 ngày tới.
- [ ] Bước 8: Tương tác với Hành tinh (Task)
  - API đánh dấu Task là: Done, Delayed, hoặc Deleted.
- [ ] Bước 9: Cơ chế Thông báo (Push Notifications)
  - Chuông/Rung nhắc nhở người dùng khi đến giờ của một OrbitInstance (Dùng Firebase Cloud Messaging hoặc Expo Push).

## Phase 4: Kiếm tiền & Thư viện Cộng đồng (Monetization & Viral)
- [ ] Bước 10: Thư viện Thói quen (Habit Library)
  - API đăng Habit lên cộng đồng, Admin duyệt, người khác có thể bấm Clone về.
- [ ] Bước 11: Cổng thanh toán PayOS
  - Gọi API PayOS sinh QR code mua gói Premium.
- [ ] Bước 12: Webhook & Idempotency
  - Xử lý Webhook thanh toán thành công, dùng Khóa dòng (Row-Level Lock) chống cộng tiền 2 lần.

## Phase 5: Giao diện Mobile App (Frontend MVP)
- [ ] Bước 13: Dựng khung React Native
  - Màn hình Auth, Màn hình Calendar View (Hiển thị Hành tinh xen kẽ Lịch bận).
  - Quét mã QR thanh toán PayOS ngay trên App.

---
---

# PHẦN 2: TÍNH NĂNG NÂNG CAO (POST-MVP)

## Phase 6: Trợ lý AI Sinh Lộ Trình (Gravity AI Chat)
- [ ] Bước 14: Cấu trúc dữ liệu Lộ trình (Missions)
  - Nâng cấp Models hỗ trợ Habit có type Mission (Có sequence_order, deadline).
- [ ] Bước 15: Tích hợp LLM API (SambaNova / Llama 3.3)
  - Kết nối Backend với API Trí tuệ nhân tạo.
- [ ] Bước 16: Chatbot phân tích mục tiêu
  - User nhập: "Tôi muốn học React trong 30 ngày".
  - AI trả về một file JSON chi tiết chia thành các MissionTasks nhỏ lẻ. Hệ thống tự động đẩy chuỗi task này vào HabitTemplate và ép lịch.

## Phase 7: Dời lịch tự động (Dynamic Rescheduling)
- [ ] Bước 17: Dời lịch thông minh
  - Khi có sự kiện BusyTime mới đột xuất chèn vào Task hiện tại, AI tự động "dồn" các Task lân cận sang khe rảnh tiếp theo mà không làm trễ Deadline.

## Phase 8: Giao diện Mobile App Cao Cấp
- [ ] Bước 18: Giao diện Chat AI
  - Dựng màn hình Chatbot để người dùng nhắn tin nhờ AI thiết kế lộ trình.
- [ ] Bước 19: Mission Tracker UI
  - Giao diện dạng cây kỹ năng (Skill Tree) hoặc Roadmaps để người dùng thấy họ đang ở đâu trong Lộ trình học tập.
