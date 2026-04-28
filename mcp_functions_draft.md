# Draft: MCP Functions cho Minh Tấn Academy

Dựa trên cấu trúc database (`brain.db` chứa `orders`, `customers`, `products`) và luồng bán khóa học của bạn, dưới đây là 5 "cánh tay" hữu ích nhất cho AI Agent để quản lý qua Telegram:

### 1. `get_recent_orders`
- **Input params:** `limit` (số lượng đơn, mặc định 5), `status` (tùy chọn: 'pending', 'paid').
- **Output dự kiến:** Danh sách đơn hàng kèm tên khách, số tiền, và trạng thái.
- **Tình huống dùng hàng ngày:** "Hôm nay có bao nhiêu người đăng ký khóa 7 Ngày mới rồi?"
- **Độ ưu tiên:** 5/5

### 2. `get_revenue_report`
- **Input params:** `timeframe` ('today', 'week', 'month').
- **Output dự kiến:** Tổng số đơn thành công và tổng doanh thu.
- **Tình huống dùng hàng ngày:** "Báo cáo doanh thu tuần này cho tôi."
- **Độ ưu tiên:** 5/5

### 3. `update_product_info`
- **Input params:** `product_id` (số), `new_price` (tùy chọn), `new_name` (tùy chọn).
- **Output dự kiến:** Xác nhận đã cập nhật database.
- **Tình huống dùng hàng ngày:** "Giảm giá khóa 30 Ngày Masterclass xuống còn 199k để làm Flash Sale cuối tuần."
- **Độ ưu tiên:** 4/5

### 4. `get_customer_info`
- **Input params:** `search_term` (số điện thoại hoặc email).
- **Output dự kiến:** Thông tin khách hàng, ngày đăng ký, và các khóa học họ đã mua.
- **Tình huống dùng hàng ngày:** "Kiểm tra xem sđt 0901234567 đã thanh toán chưa."
- **Độ ưu tiên:** 4/5

### 5. `confirm_order_manual`
- **Input params:** `order_id` (số).
- **Output dự kiến:** Đơn hàng chuyển sang 'paid' và gửi email tự động.
- **Tình huống dùng hàng ngày:** "Xác nhận đơn hàng số #15 (khách ck khác ngân hàng nên bot SePay không nhận)."
- **Độ ưu tiên:** 3/5

---
👉 **Hành động của bạn:** Hãy chọn ra **3 function** mà bạn thấy cần thiết nhất để tôi build trước. (Ví dụ: 1, 2 và 4). Sau đó báo tôi chốt danh sách nhé!
