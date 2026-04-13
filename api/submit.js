import { GOOGLE_SHEET_URL, LEAD_SPREADSHEET_ID, WAITLIST_SCRIPT_URL, WAITLIST_SPREADSHEET_ID, BOT_TOKEN, CHAT_ID } from './_constants.js';

export default async (req, res) => {
    const notifyAdmin = async (text, msgId = null, replyMarkup = null) => {
        try {
            const method = msgId ? 'editMessageText' : 'sendMessage';
            const body = { chat_id: CHAT_ID, text };
            if (msgId) body.message_id = msgId;
            if (replyMarkup) body.reply_markup = replyMarkup;

            const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await tgRes.json();
        } catch (e) { console.error('Telegram Notify Error:', e); return null; }
    };

    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: 'No body' });
        
        const { action, teleMsgId, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD)
        if (!action || action === 'submit-lead') {
            const firstMsg = await notifyAdmin(`🔔 **CÓ KHÁCH MỚI!**\n⏳ Đang lưu...`);
            const msgId = firstMsg?.result?.message_id;

            // Cập nhật Google Sheet Lead
            let sheetStatus = "\n📊 Sheet: ✅ Đã lưu";
            try {
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'submit-lead', 
                        spreadsheetId: LEAD_SPREADSHEET_ID,
                        ...data 
                    })
                });
            } catch (err) { 
                sheetStatus = "\n📊 Sheet: ❌ Lỗi ghi"; 
            }

            // Cập nhật lại tin nhắn Telegram
            if (msgId) {
                await notifyAdmin(`👤 **KHÁCH ĐĂNG KÝ MỚI**\n👤: ${data.fullname}\n📞: ${data.phone}${sheetStatus}`, msgId);
            }
            return res.status(200).json({ success: true, teleMsgId: msgId });
        }

        // 1.5. WAITLIST
        if (action === 'submit-waitlist') {
            try {
                // Chỉ ghi vào Google Sheet, KHÔNG báo Telegram theo yêu cầu
                await fetch(WAITLIST_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'submit-waitlist', 
                        spreadsheetId: WAITLIST_SPREADSHEET_ID,
                        ...data 
                    })
                });
            } catch (err) { }

            return res.status(200).json({ success: true });
        }

        // 2. CONFIRM
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

            if (teleMsgId) {
                await notifyAdmin(message, teleMsgId, replyMarkup);
            } else {
                await notifyAdmin(message, null, replyMarkup);
            }

            return res.status(200).json({ success: true });
        }
    } catch (error) {
        // Luôn cố gắng báo Telegram khi có lỗi nghiêm trọng
        try {
            await notifyAdmin(`🚨 **CRASH API SUBMIT:** ${error.message}`);
        } catch (e) {}
        res.status(500).json({ success: false });
    }
}
