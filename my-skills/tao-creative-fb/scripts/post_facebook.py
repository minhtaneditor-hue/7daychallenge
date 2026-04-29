import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

def post_to_facebook(image_url, caption):
    page_id = os.getenv("FB_PAGE_ID")
    page_token = os.getenv("FB_PAGE_TOKEN")
    dry_run = os.getenv("DRY_RUN", "true").lower() == "true"
    
    if dry_run:
        print("\n⚠️ CHẾ ĐỘ TEST (DRY_RUN=true):")
        print(f"📸 Ảnh sẽ đăng: {image_url}")
        print(f"✍️ Nội dung: {caption}")
        print("✅ Giả lập đăng bài thành công!")
        return True

    # Bước 1: Chuẩn bị file ảnh
    temp_image = "temp_fb_image.jpg"
    
    if image_url.startswith("http"):
        try:
            print(f"📥 Đang tải ảnh từ URL: {image_url}")
            res = requests.get(image_url)
            if res.status_code != 200:
                print(f"❌ Lỗi: URL ảnh trả về mã {res.status_code}")
                return False
            img_data = res.content
            with open(temp_image, 'wb') as handler:
                handler.write(img_data)
        except Exception as e:
            print(f"❌ Lỗi tải ảnh: {e}")
            return False
    else:
        # Nếu là file cục bộ, copy sang file tạm để đồng nhất
        import shutil
        if os.path.exists(image_url):
            shutil.copy(image_url, temp_image)
        else:
            print(f"❌ Lỗi: Không tìm thấy file {image_url}")
            return False

    file_size = os.path.getsize(temp_image) / (1024 * 1024)
    print(f"✅ Ảnh đã sẵn sàng. Dung lượng: {file_size:.2f} MB")

    # Bước 2: Upload file lên Facebook
    url = f"https://graph.facebook.com/v18.0/{page_id}/photos"
    payload = {
        "caption": caption,
        "access_token": page_token
    }
    
    try:
        with open(temp_image, "rb") as f:
            files = {"source": f}
            print(f"🚀 Đang upload ảnh thật lên Fanpage {page_id}...")
            response = requests.post(url, data=payload, files=files)
            result = response.json()
        
        if "id" in result:
            print(f"✅ ĐĂNG BÀI THÀNH CÔNG! ID bài viết: {result['id']}")
            print(f"🔗 Xem tại: https://facebook.com/{result['id']}")
            if os.path.exists(temp_image): os.remove(temp_image)
            return True
        else:
            print(f"❌ Lỗi Facebook Chi Tiết: {result}")
            # Giữ lại file để debug nếu lỗi
            print(f"⚠️ Đã giữ lại file {temp_image} để sếp kiểm tra.")
            return False
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 2:
        img_url = sys.argv[1]
        cap = sys.argv[2]
        post_to_facebook(img_url, cap)
    else:
        print("Vui lòng nhập Image URL và Caption.")
