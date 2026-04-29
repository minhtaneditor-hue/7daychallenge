import os
import sys
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

# Cấu hình Hugging Face bằng SDK chính chủ
client = InferenceClient(
    token=os.getenv("HF_TOKEN")
)

def generate_image(prompt):
    try:
        print(f"🎨 Đang dùng Hugging Face SDK vẽ ảnh cho prompt: {prompt}...")
        
        # Sử dụng model FLUX.1-schnell (hoặc stabilityai/stable-diffusion-xl-base-1.0)
        image = client.text_to_image(
            prompt,
            model="black-forest-labs/FLUX.1-schnell"
        )
        
        # Lưu ảnh cục bộ
        save_path = "generated_image.jpg"
        image.save(save_path)
        
        file_size = os.path.getsize(save_path) / (1024 * 1024)
        print(f"✅ Đã vẽ xong ảnh HD! Dung lượng: {file_size:.2f} MB")
        
        return save_path
    except Exception as e:
        print(f"❌ Lỗi vẽ ảnh qua SDK: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
        path = generate_image(prompt)
        if path:
            print(f"📍 Ảnh đã lưu tại: {os.path.abspath(path)}")
    else:
        print("Vui lòng nhập prompt cho ảnh.")
