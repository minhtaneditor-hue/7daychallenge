import { GOOGLE_SHEET_URL, BOT_TOKEN, CHAT_ID } from './_constants.js';

export default async (req, res) => {
    const notifyAdmin = async (text, msgId = null, replyMarkup = null) => {
        try {
            const method = msgId ? 'editMessageText' : 'sendMessage';
            const body = { chat_id: CHAT_ID, text };
            if (msgId) body.message_id = msgId;
            if (replyMarkup) body.reply_markup = replyMarkup;

            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) { console.error('Telegram Notify Error:', e); return null; }
    };

    try {
        const body = req.body;
        const { action, teleMsgId, ...data } = body;

            // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD)
        if (!action || action === 'submit-lead') {
            const leadMsg = `🔔 **CÓ KHÁCH MỚI ĐĂNG KÝ!**\n` +
                          `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                          `📞 SĐT: ${data.phone || 'Không có'}\n` +
                          `📧 Email: ${data.email || 'Không có'}\n` +
                          `----------------------------\n` +
                          `⏳ Đang ghi vào Google Sheet...`;
            
            const firstMsg = await notifyAdmin(leadMsg);
            const msgId = firstMsg?.result?.message_id;

            // Cập nhật Google Sheet
            let sheetStatus = "\n📊 Sheet: ✅ Đã lưu";
            try {
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-lead', ...data })
                });
                if (!gsRes.ok) throw new Error();
            } catch (err) { 
                sheetStatus = "\n📊 Sheet: ❌ Lỗi ghi (Vẫn có Bot báo)"; 
            }

            // Cập nhật lại tin nhắn duy nhất
            if (msgId) {
                const finalLeadMsg = `👤 **KHÁCH ĐĂNG KÝ MỚI**\n` +
                                   `━━━━━━━━━━━━━━━\n` +
                                   `👤 Họ tên: ${data.fullname}\n` +
                                   `📞 SĐT: ${data.phone}\n` +
                                   `📧 Mail: ${data.email}\n` +
                                   `━━━━━━━━━━━━━━━\n` +
                                   `📧 Email: ⏳ Chờ thanh toán${sheetStatus}`;
                await notifyAdmin(finalLeadMsg, msgId);
            }

            return res.status(200).json({ success: true, teleMsgId: msgId });
        }

        // 1.5. DANH SÁCH CHỜ (WAITLIST)
        if (action === 'submit-waitlist') {
            const waitlistMsg = `✨ **KHÁCH MỚI GIA NHẬP DANH SÁCH CHỜ!**\n` +
                              `━━━━━━━━━━━━━━━\n` +
                              `👤 Họ tên: ${data.name || 'Không có'}\n` +
                              `📞 SĐT: ${data.phone || 'Không có'}\n` +
                              `📱 Máy: ${data.device || 'Không có'}\n` +
                              `💡 Kỹ năng: ${data.target_skill || 'Không chọn'}\n` +
                              `❌ Phàn nàn: ${data.complaint || 'Không có'}\n` +
                              `━━━━━━━━━━━━━━━\n` +
                              `📊 Đang ghi vào Google Sheet...`;
            
            const firstMsg = await notifyAdmin(waitlistMsg);
            const msgId = firstMsg?.result?.message_id;

            // Cập nhật Google Sheet
            let sheetStatus = "\n📊 Sheet: ✅ Đã lưu";
            try {
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-waitlist', ...data })
                });
            } catch (err) { 
                sheetStatus = "\n📊 Sheet: ❌ Lỗi ghi"; 
            }

            if (msgId) {
                await notifyAdmin(waitlistMsg.replace('📊 Đang ghi vào Google Sheet...', sheetStatus), msgId);
            }

            return res.status(200).json({ success: true });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
            const message = `💰 **XÁC NHẬN CHUYỂN TIỀN!**\n` +
                          `━━━━━━━━━━━━━━━\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng và DUYỆT ngay nhé!`;

            const replyMarkup = {
                inline_keyboard: [[
                    { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
                    { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                ]]
            };

            // Nếu có mã tin nhắn cũ -> Tìm và sửa lại chính tin nhắn đó
            if (teleMsgId) {
                await notifyAdmin(message, teleMsgId, replyMarkup);
            } else {
                // Nếu không có (lỗi trình duyệt) -> Gửi tin nhắn mới như cũ
                await notifyAdmin(message, null, replyMarkup);
            }

            return res.status(200).json({ success: true });
        }
    } catch (error) {
        await notifyAdmin(`🚨 **CRASH API SUBMIT:** ${error.message}`);
        res.status(500).json({ success: false });
    }
}
