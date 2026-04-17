# Deploy Checklist - Dự án 7 Ngày Lên Tay Phó Nháy

Dự án này đã sẵn sàng để đưa lên VPS chạy Linux. Đây là bản đồ để bạn thực hiện vào ngày mai.

### (1) Công nghệ sử dụng
- **Ngôn ngữ:** Node.js (v18+)
- **Frontend:** Vanilla HTML/JS/CSS (SPA style)
- **Backend:** Node.js API functions (Custom implementation)
- **Database:** SQLite (local file `brain.db`)

### (2) Các việc cần làm ngay (Đã được AI fix ở Bước 4)
- [x] Tách các API Key/Token ra khỏi code (Sử dụng biến môi trường).
- [x] Tạo file `server.js` để chạy được trên VPS (thay vì phụ thuộc serverless).
- [x] Tạo file `.env.example` làm mẫu.
- [x] Tạo file `README.md` hướng dẫn chi tiết.

### (3) Những thứ cần chuẩn bị trước khi deploy (Khách hàng cần làm)
- [ ] **VPS chạy Linux** (Ubuntu 22.04 là tốt nhất).
- [ ] **Tên miền** đã trỏ về IP của VPS.
- [ ] **API Keys thật**: Resend, Telegram, SePay.
- [ ] **Hệ thống Certbot (SSL)** để chạy HTTPS.

### (4) Quy trình deploy (Dự kiến)
1. Copy code lên VPS (via Git hoặc SCP).
2. Chạy `npm install`.
3. Tạo file `.env` từ `.env.example` và điền key thật.
4. Chạy `node server.js` để kiểm tra.
5. Setup **PM2** để website chạy ngầm vĩnh viễn.
6. Setup **Nginx** làm Reverse Proxy để nhận traffic cổng 80/443.

---
> [!IMPORTANT]
> Toàn bộ thông tin bí mật đã được xóa khỏi code và chuyển sang cơ chế biến môi trường (`.env`). Không bao giờ được commit file `.env` lên GitHub công khai.
