# 🛠️ GÓI TỰ SỬA LỖI GIAO DIỆN (UI AUTO-FIX)

Nếu bạn muốn tự tay điều chỉnh hoặc reset lại giao diện cho chuẩn, hãy sử dụng các đoạn mã "Expert" dưới đây.

## 1. Code xử lý "Chữ mồ côi" (Ngắt dòng sai)
Dùng class `.no-break` bọc quanh cụm từ bạn muốn đi cùng nhau:
```html
<span class="no-break">Cụm từ quan trọng</span>
```

## 2. CSS Tối ưu căn giữa & Tỷ lệ (Thêm vào cuối style.css)
```css
/* Ép căn giữa đồng hồ & nội dung quan trọng */
.reward-countdown {
    display: flex !important;
    justify-content: center !important;
}

/* Fix lỗi Icon đè Text trên button */
.social-btn {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
}

/* Safe Zone Cushion (5px) */
.container {
    padding-left: max(5px, env(safe-area-inset-left)) !important;
    padding-right: max(5px, env(safe-area-inset-right)) !important;
}
```

## 3. Script tối ưu Messenger Button cho Mobile
Chèn đoạn này vào cuối `index.html` trước thẻ `</body>`:
```javascript
<script>
    window.addEventListener('load', () => {
        const chatBtn = document.getElementById('messenger-chat-button');
        if (chatBtn && window.innerWidth < 768) {
            chatBtn.style.padding = '12px';
            chatBtn.style.borderRadius = '50%';
            chatBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.36 2 1.81 6.13 1.81 11.23c0 2.86 1.48 5.4 3.8 7.08v3.42l3.47-1.92c.93.26 1.91.4 2.92.4 5.64 0 10.19-4.13 10.19-9.23S17.64 2 12 2zm1.09 12.35l-2.73-2.9-5.32 2.9 5.86-6.22 2.83 2.9 5.21-2.9-5.85 6.22z"/></svg>';
        }
    });
</script>
```

---
*Created by Antigravity - Chuyên gia tối ưu hóa của bạn*
