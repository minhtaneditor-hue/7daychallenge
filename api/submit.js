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
        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });

        if (!telegramResponse.ok) {
            throw new Error(`Telegram Error: ${telegramResponse.statusText}`);
        }

        res.status(200).json({ success: true, message: 'Data sent to Telegram successfully' });
    } catch (error) {
        console.error('Error fetching Telegram API:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
