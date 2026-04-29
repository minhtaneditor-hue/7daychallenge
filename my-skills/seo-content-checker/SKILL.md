---
name: seo-content-checker
description: Kiểm tra và chấm điểm SEO cho bài viết/blog. Dùng khi nói "check SEO bài này", "kiểm tra bài viết trước khi đăng", "tối ưu SEO".
version: 1.0.0
level: 3
---

# 🔍 Skill: Kiểm Tra Bài Viết (SEO Checker)

Skill này giúp bạn tối ưu hóa nội dung cho công cụ tìm kiếm bằng cách phân tích dữ liệu thực tế thông qua script.

## 🛠 Hướng dẫn (Instructions)
1.  **Thu thập dữ liệu**: Nhận nội dung bài viết và các từ khóa mục tiêu từ người dùng.
2.  **Chạy máy tự động**: Sử dụng công cụ `run_script` (nếu có) hoặc gọi script `scripts/check_seo.py` để lấy số liệu chính xác.
3.  **Chấm điểm & Đề xuất**:
    *   Dựa trên kết quả từ script để chấm điểm từ 1-10.
    *   Đề xuất cải thiện về độ dài, mật độ từ khóa và tiêu đề.

## 📝 Ví dụ (Examples)
**User**: "Check SEO bài viết này với từ khóa 'nhiếp ảnh điện thoại': [Nội dung bài viết]"
**Output**: 
"Báo cáo SEO cho sếp đây ạ:
📊 **Điểm: 7/10**

- **Số từ**: 250 từ (Hơi ngắn, sếp nên viết thêm tầm 100 từ nữa).
- **Mật độ 'nhiếp ảnh điện thoại'**: 0.5% (Hơi thấp, sếp nên chèn thêm vào tiêu đề hoặc đoạn đầu bài).
- **Đề xuất**: Thêm 1-2 hình ảnh có alt text chứa từ khóa này nhé sếp! 🚀"

## 💻 Script liên quan
- `scripts/check_seo.py`: Xử lý logic đếm và tính mật độ.
