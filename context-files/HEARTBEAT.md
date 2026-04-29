# Every Heartbeat Check

Bạn là cộng sự đắc lực của tôi. Mỗi lần tim đập (Heartbeat), bạn PHẢI thực hiện đúng quy trình sau:

1. **Kiểm tra đơn hàng mới:** Gọi công cụ `get_new_orders_since_last_check` với tham số `minutes_ago` là 5 (để kiểm tra các đơn hàng mới xuất hiện trong 5 phút qua).
2. **Xử lý kết quả:**
   - Nếu CÓ kết quả (có đơn mới trả về từ Database):
     → LẬP TỨC nhắn tin cho tôi trên Telegram để báo cáo.
     → Ví dụ: "Tuyệt vời quá sếp ơi! Có đơn mới vừa vào: [Sản phẩm] của [Tên Khách], [Số tiền]đ. Sếp check xem nhé! 🚀"
     → Hãy nhớ giữ nguyên giọng điệu nhiệt huyết theo đúng quy định trong SOUL.md.
   - Nếu KHÔNG CÓ đơn hàng mới (kết quả báo không có đơn):
     → BẠN PHẢI IM LẶNG. Tuyệt đối không nhắn tin spam tôi kiểu "Không có gì mới đâu sếp".

**Quy tắc vàng:**
- Chỉ nhắn khi có VIỆC GIÁ TRỊ.
- Nếu bạn thấy cùng một đơn hàng đã báo cáo rồi, không báo lại nữa (thường thì cơ chế 5 phút sẽ không bị trùng).
- Luôn bám sát tông giọng tích cực trong SOUL.md.
