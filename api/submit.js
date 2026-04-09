export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const body = req.body;
        const { action, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD)
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const message = `🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                          `📞 SĐT: ${data.phone || 'Không có'}\n` +
                          `📧 Email: ${data.email || 'Không có'}\n\n` +
                          `Hệ thống đã ghi nhận Lead vào Google Sheet. Đang đợi khách xác nhận thanh toán...`;

            // 1. Gửi Telegram thông báo (KHÔNG CÓ NÚT)
            const telegramUrl = `https://api.telegram.org/bot8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E/sendMessage`;
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: '7384174497', text: message })
            });

            // 2. Gửi Google Sheet
            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwDgqqxjsvFPLWfmJT4P0WmKXJC5ALwycTPgE5YoaKAayXi_zoCJ3vO3dgEdokNP5ZcdQ/exec';
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submit-lead', ...data })
            });

            return res.status(200).json({ success: true, message: 'Lead captured locally' });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const message = `💰 XÁC NHẬN CHUYỂN TIỀN!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng và DUYỆT ngay nhé!`;

            // Gửi Telegram kèm nút DUYỆT / HUỶ
            await fetch(`https://api.telegram.org/bot8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: '7384174497', 
                    text: message,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ DUYỆT (PAID & Gửi Email)", callback_data: `approve_${data.phone}` },
                                { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                            ]
                        ]
                    }
                })
            });

            return res.status(200).json({ success: true, message: 'Payment confirmation sent' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
