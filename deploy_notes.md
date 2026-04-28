# Lịch sử và Hướng dẫn Deploy lên VPS

## 1. Môi trường cần chuẩn bị trên VPS
Cần có Node.js (khuyến nghị bản 20 trở lên để hỗ trợ `--env-file=.env`).

## 2. Danh sách các biến trong `.env` cần thiết lập trên VPS
```env
ADMIN_PASSWORD=
BOT_TOKEN=
CHAT_ID=
RESEND_API_KEY=
FROM_EMAIL=
BANK_ID=
ACCOUNT_NO=
ACCOUNT_NAME=
SEPAY_API_KEY=
TURSO_URL=
TURSO_TOKEN=
PORT=3000
NODE_ENV=production
```

## 3. Lệnh để chạy server
Để chạy server với file `.env`, sử dụng lệnh sau:
```bash
node --env-file=.env server.js
```
Hoặc cấu hình systemd đọc file `.env` qua chỉ thị `EnvironmentFile=/opt/my-website/.env`.

## 4. Cổng đang lắng nghe
Mặc định server sẽ lắng nghe ở port được quy định trong `.env` (ví dụ `PORT=3000`). Nếu không có, fallback là `3000`.
