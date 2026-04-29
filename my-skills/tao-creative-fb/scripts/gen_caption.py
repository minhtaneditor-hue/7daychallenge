import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Cấu hình Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_caption(topic, mode="organic"):
    # Đọc brand voice từ file nếu có
    brand_voice = "Nhiệt huyết, xởi lởi, thực chiến, chân thành. Dùng từ ngữ gần gũi, không hoa mỹ."
    
    prompt = f"""
    Bạn là chuyên gia Content Marketing cho Minh Tấn Academy. 
    Viết một bài đăng Facebook về chủ đề: {topic}
    
    Phong cách (Brand Voice): {brand_voice}
    Chế độ: {'Bài đăng chia sẻ giá trị (Organic)' if mode == 'organic' else 'Bài đăng quảng cáo (Ads)'}
    
    Yêu cầu:
    1. Hook hấp dẫn ở ngay câu đầu tiên.
    2. Body chia sẻ giá trị hoặc lợi ích rõ ràng.
    3. {'CTA mềm mại, kêu gọi thảo luận' if mode == 'organic' else 'CTA mạnh mẽ, kêu gọi hành động'}
    4. Độ dài: 80-150 từ.
    5. Thêm 3-5 hashtag phù hợp.
    
    Đầu ra chỉ trả về nội dung bài viết.
    """
    
    try:
        print(f"📝 Đang dùng GEMINI soạn caption cho: {topic}...")
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Lỗi soạn caption bằng Gemini: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        topic = sys.argv[1]
        mode = sys.argv[2] if len(sys.argv) > 2 else "organic"
        caption = generate_caption(topic, mode)
        if caption:
            print(f"\n--- CAPTION (GEMINI) ---\n\n{caption}")
    else:
        print("Vui lòng nhập chủ đề bài viết.")
