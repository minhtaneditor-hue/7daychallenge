# 7-Day Photography Challenge (Vibe Code Project)

Chào mừng bạn đến với dự án **7 Ngày Lên Tay Phó Nháy**. Đây là một hệ thống bán hàng và chăm sóc khách hàng tự động được xây dựng hoàn toàn bằng "Vibe Coding" (Lập trình bằng ngôn ngữ tự nhiên thông qua AI).

## 🚀 Tính năng chính
- **CRM Tự Động**: Quản lý Khách hàng, Sản phẩm, Đơn hàng qua SQLite (`brain.db`).
- **Thanh toán QR**: Kết nối SePay để xác nhận giao dịch 2,000đ - 199,000đ tự động.
- **Email Marketing**: Tự động gửi chuỗi email chào mừng và chăm sóc (3 ngày) qua Resend.
- **Admin Panel**: Trang quản lý tại `/admin` để theo dõi doanh thu và duyệt đơn.
- **Telegram Notify**: Thông báo biến động số dư và khách đăng ký mới ngay vào Messenger.

## 🛠 Hướng dẫn cài đặt (Local)
1. Cài đặt Node.js (v18 trở lên).
2. Tạo file `.env` từ `.env.example` và điền các API Key của bạn.
3. Chạy lệnh: `node server.js`
4. Mở trình duyệt: `http://localhost:3000`

## 🌐 Hướng dẫn Deploy lên VPS (Linux)
1. Copy toàn bộ thư mục lên VPS.
2. Cài đặt PM2 để chạy ngầm: `npm install -g pm2`
3. Khởi chạy dự án: `pm2 start server.js --name "7day-challenge"`
4. Setup Nginx trỏ tên miền về cổng 3000.
5. Setup SSL (Certbot) để chạy https.

## 📁 Cấu trúc thư mục
- `api/`: Chứa các "Serverless Functions" xử lý logic backend.
- `my-brain/`: Chứa các tài liệu chiến lược, Brand Voice và bài đăng content.
- `brain.db`: Cơ sở dữ liệu SQLite (Lưu trữ đơn hàng & khách hàng).
- `index.html`: Giao diện chính của website.

---
**Build by Minh Tấn Academy with AI Assistance**
