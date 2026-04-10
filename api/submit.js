export default async (req, res) => {
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxbChrkAVLRFvQ128Qde_o123wYGBwHN-zPrd34Cm2k_QpiqtlgZNpM5acf9Yy2YCjCgg/exec';

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
            // Bước 1: Thông báo Telegram NGAY LẬP TỨC để Admin nắm thông tin khách
            const leadMsg = `🔔 **CÓ KHÁCH MỚI ĐĂNG KÝ!**\n` +
                          `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                          `📞 SĐT: ${data.phone || 'Không có'}\n` +
                          `📧 Email: ${data.email || 'Không có'}\n` +
                          `----------------------------\n` +
                          `⏳ Đang ghi vào Google Sheet...`;
            await notifyAdmin(leadMsg);

            // Bước 2: Kích hoạt Email Chào mừng (Day 0) luôn để khách nhận được mail ngay
            try {
                const protocol = req.headers['x-forwarded-proto'] || 'http';
                const host = req.headers.host;
                fetch(`${protocol}://${host}/api/emails`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'welcome', 
                        fullname: data.fullname, 
                        email: data.email, 
                        phone: data.phone 
                    })
                }); // Không await để tránh block luồng chính
            } catch (e) { console.error('Email trigger error:', e); }

            // Bước 3: Gửi Google Sheet
            try {
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-lead', ...data })
                });
                
                if (!gsRes.ok) throw new Error(`Status: ${gsRes.status}`);
                
                // Cập nhật trạng thái thành công lên Telegram (tùy chọn)
                // await notifyAdmin(`✅ Đã lưu vào Google Sheet thành công cho: ${data.fullname}`);

            } catch (err) {
                await notifyAdmin(`🚨 **LỖI GHI SHEET (LEAD):**\n👤 Khách: ${data.fullname}\n⚠️ Chi tiết: ${err.message}`);
            }

            return res.status(200).json({ success: true });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
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
                            { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
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
