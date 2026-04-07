export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const data = req.body;
        
        // Cấu hình Telegram (Mã hoá trực tiếp Backend)
        const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
        const CHAT_ID = '7384174497'; // Lấy từ kết quả vừa check

        // Chuẩn bị nội dung tin nhắn Telegram
        const message = `
🎉 ĐƠN HÀNG MỚI: 7 DAY BOYFRIEND CAMERA 🎉
------------------------------------------
👤 Tên: ${data.fullname || 'Không có'}
📱 SĐT: ${data.phone || 'Không có'}
📧 Email: ${data.email || 'Không có'}
🌍 Facebook: ${data.fblink || 'Không có'}
        `;

        // Gọi API Telegram để gửi tin nhắn
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });

        // Gửi dữ liệu sang Google Sheets CRM
        const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlqXGgzQVl47NiiQ4A4Rmv09dCb1rEcipqK4MbyvrT7_2nLZE3403h49kArxO2bLKRyQ/exec';
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors if not handling preflight
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        res.status(200).json({ success: true, message: 'Data sent to Telegram and Google Sheets successfully' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
