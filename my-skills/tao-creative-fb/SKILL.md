---
name: tao-creative-fb
description: Sản xuất full content (ảnh + văn bản) cho Facebook. Gồm 2 mode: (1) Content Free - đăng Page mỗi sáng, (2) Creative Ads - tạo 3 bộ ảnh + copy để chạy quảng cáo.
triggers:
  - "tạo content cho ngày mai"
  - "gen bài Page"
  - "content free"
  - "tạo creative ads"
  - "gen ads"
  - "cần creative cho chiến dịch"
level: 5
---

# Skill: Sản Xuất Content Facebook Đa Năng

Skill này giúp bạn tạo ra các nội dung hoàn chỉnh gồm cả **Hình ảnh (AI vẽ)** và **Văn bản (Caption)** theo đúng phong cách thương hiệu của bạn.

## 🛠 Các Chế Độ Hoạt Động

### Mode 1: Content Free (Dùng cho đăng bài hàng ngày)
- **Mục tiêu**: Duy trì tương tác trên Fanpage mà không cần tốn sức.
- **Quy trình**: 
  1. Agent đề xuất 3 ý tưởng.
  2. Bạn chọn 1 ý tưởng.
  3. Agent vẽ ảnh và viết bài hoàn chỉnh.
  4. Bạn duyệt và Agent tự động đăng lên Fanpage.

### Mode 2: Creative Ads (Dùng cho chạy quảng cáo)
- **Mục tiêu**: Tạo ra nhiều mẫu quảng cáo để test hiệu quả.
- **Quy trình**: Agent tạo ra 3 bộ (mỗi bộ gồm 1 ảnh Ads và 1 Ad Copy) với các góc tiếp cận khác nhau (Nỗi đau, Giải pháp, Chứng thực).
- **Lưu ý**: Chế độ này KHÔNG tự đăng bài, chỉ trả kết quả để bạn copy vào Ads Manager.

## 📁 Cấu trúc Scripts
- `gen_image.py`: Gọi OpenAI DALL-E 3 để tạo ảnh.
- `gen_caption.py`: Viết nội dung theo Brand Voice.
- `post_facebook.py`: Đăng bài lên Fanpage qua Facebook Graph API.

## ⚙️ Cấu hình (.env)
Yêu cầu các biến:
- `OPENAI_API_KEY`: Chìa khóa OpenAI.
- `FB_PAGE_ID`: ID của Fanpage.
- `FB_PAGE_TOKEN`: Token vĩnh viễn của Page.
- `DRY_RUN`: Set "true" để test (không đăng thật), "false" để đăng thật.
