export default async (req, res) => {
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzY6Y0FzxnoyZUzeqmnWbM2MFqlCJEEVnlFVAW_ewZTYbiwA7EXVicOvms8k_MZ0DO9EA/exec';

    const notifyAdmin = async (text) => {
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text })
            });
        } catch (e) { console.error('Telegram Notify Error:', e); }
    };

    try {
        const body = req.body;
        const { action, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD)
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            // Gửi Google Sheet TRƯỚC để đảm bảo dữ liệu được lưu
            try {
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-lead', ...data })
                });
                
                if (!gsRes.ok) throw new Error(`Google Sheet Error: ${gsRes.status}`);

                // Nếu lưu Sheet thành công thì mới báo Telegram
                const message = `🔔 **CÓ KHÁCH MỚI ĐĂNG KÝ!**\n` +
                              `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                              `📞 SĐT: ${data.phone || 'Không có'}\n` +
                              `📧 Email: ${data.email || 'Không có'}\n` +
                              `----------------------------\n` +
                              `✅ Đã lưu vào Google Sheet thành công.`;
                await notifyAdmin(message);

            } catch (err) {
                await notifyAdmin(`🚨 **LỖI GHI SHEET (LEAD):**\n👤 Khách: ${data.fullname}\n📞 SĐT: ${data.phone}\n⚠️ Chi tiết: ${err.message}`);
            }

            return res.status(200).json({ success: true });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const message = `💰 **XÁC NHẬN CHUYỂN TIỀN!**\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng và DUYỆT ngay nhé!`;

            // Gửi Telegram kèm nút DUYỆT
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: CHAT_ID, 
                    text: message,
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "✅ DUYỆT (PAID & Gửi Email)", callback_data: `approve_${data.phone}` },
                            { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                        ]]
                    }
                })
            });

            return res.status(200).json({ success: true });
        }

    } catch (error) {
        await notifyAdmin(`🚨 **CRASH API SUBMIT:** ${error.message}`);
        res.status(500).json({ success: false });
    }
}
