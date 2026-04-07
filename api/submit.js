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
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // GỬI EMAIL CHÀO MỪNG (DAY 0) QUA RESEND
        const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
        const resendUrl = 'https://api.resend.com/emails';
        
        await fetch(resendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Minh Tấn <challenge@minhtanacademy.com>',
                to: data.email,
                subject: '🎉 Chào mừng bạn đến với Thử thách 7 Ngày Boyfriend Camera!',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Xin chào ${data.fullname || 'bạn'}!</h2>
                        <p>Chúc mừng bạn đã chính thức tham gia vào hành trình biến chiếc điện thoại thành "vũ khí" chụp ảnh đỉnh cao.</p>
                        <p><strong>Ngày hôm nay (Day 0):</strong> Hãy chuẩn bị tâm lý và kiểm tra thiết bị của bạn. Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                        <p>Hẹn gặp lại bạn vào sáng mai!</p>
                        <p>-- <br><strong>Minh Tấn</strong></p>
                    </div>
                `
            })
        });

        res.status(200).json({ success: true, message: 'Lead captured and Day 0 email sent.' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
