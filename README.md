# The Orbit FE

## Hướng dẫn Testing & Quality Control
### 1. Chạy Test tại máy cá nhân (Local)
Để kiểm tra chất lượng mã nguồn trước khi push lên GitHub, thực hiện các bước sau:

```bash
cd the-orbit-fe

npm install --legacy-peer-deps

npm audit fix

npm run test:coverage
```

### 2. Xem báo cáo chi tiết (HTML Report)
Sau khi chạy lệnh trên, hệ thống sẽ tự động sinh ra báo cáo định dạng HTML. Bạn có thể mở để kiểm tra từng dòng code:
* **Đường dẫn:** `the-orbit-fe/coverage/lcov-report/index.html`
* **Cách xem:** Chuột phải vào file `index.html` -> **Open with Browser** (Chrome/Edge).
nhé!

## Yêu cầu

- Node.js 20 LTS hoặc mới hơn
- npm 10 hoặc mới hơn
- Expo Go trên điện thoại, hoặc Android Studio / Xcode simulator nếu muốn chạy giả lập

## Cài đặt

Từ thư mục repo gốc:

```bash
cd the-orbit-fe
npm install
```

## Chạy local

Khởi động Expo dev server:

```bash
npm start
```

Sau khi chạy, bạn có thể:

- Nhấn `a` để mở Android emulator
- Nhấn `i` để mở iOS simulator (chỉ dùng được trên macOS)
- Nhấn `w` để chạy bản web
- Quét QR bằng Expo Go để mở trên điện thoại

Hoặc chạy trực tiếp:

```bash
npm run android
npm run ios
npm run web
```

## Test và lint

Chạy test:

```bash
npm test
```

Chạy test dạng watch:

```bash
npm run test:watch
```

Chạy coverage và xuất HTML report:

```bash
npm run test:coverage
```

Chạy lint:

```bash
npm run lint
```

## Cấu trúc liên quan

- App dùng `Expo Router`
- Entry point: `expo-router/entry`
- Mã nguồn chính nằm trong thư mục `app/`

## Lưu ý

- Hiện tại project không thấy yêu cầu biến môi trường riêng để chạy local.
- Nếu Android emulator không lên, hãy mở Android Studio và start emulator trước rồi chạy lại `npm run android`.
- Nếu gặp lỗi cache của Expo, có thể thử:

```bash
npx expo start -c
```
