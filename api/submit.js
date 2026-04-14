import { GOOGLE_SHEET_URL, BOT_TOKEN, CHAT_ID } from './_constants.js';

export default async (req, res) => {
    const notifyAdmin = async (text, msgId = null, replyMarkup = null) => {
        try {
            const method = msgId ? 'editMessageText' : 'sendMessage';
            const body = { chat_id: CHAT_ID, text, parse_mode: 'HTML' };
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

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD -> CUSTOMER IN CRM)
        if (!action || action === 'submit-lead') {
            const firstMsg = await notifyAdmin(`🔔 <b>CÓ KHÁCH MỚI!</b>\n⏳ Đang lưu vào CRM...`);
            const msgId = firstMsg?.result?.message_id;

            let sheetStatus = "\n📊 CRM: ✅ Đã lưu";
            try {
                // Sync with Plan B CRM logic
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'create', 
                        type: 'customer',
                        payload: {
                            fullname: data.fullname,
                            phone: data.phone,
                            email: data.email,
                            zalo: data.zalo || ''
                        }
                    })
                });
            } catch (err) { 
                sheetStatus = "\n📊 CRM: ❌ Lỗi ghi"; 
            }

            if (msgId) {
                await notifyAdmin(`👤 <b>KHÁCH ĐĂNG KÝ MỚI</b>\n👤: ${data.fullname}\n📞: ${data.phone}${sheetStatus}`, msgId);
            }
            return res.status(200).json({ success: true, teleMsgId: msgId });
        }

        // 2. CONFIRM PAYMENT (STILL NOTIFY FOR MANUAL CHECK IF NEEDED)
        if (action === 'confirm-payment') {
            const message = `💰 <b>XÁC NHẬN CHUYỂN TIỀN!</b>\n` +
                          `━━━━━━━━━━━━━━━\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng và DUYỆT ngay nhé!\n(Hoặc đợi SePay tự động duyệt)`;

            const replyMarkup = {
                inline_keyboard: [[
                    { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
                    { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                ]]
            };

            await notifyAdmin(message, teleMsgId, replyMarkup);
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Submit API Error:', error);
        res.status(500).json({ success: false });
    }
}
