import { GOOGLE_SHEET_URL, BOT_TOKEN, CHAT_ID, RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import templates from './emails-templates.js';

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
            try {
                // Sync with Plan B CRM logic (GET-ONLY STABLE)
                const payload = {
                    fullname: data.fullname,
                    phone: data.phone,
                    email: data.email,
                    zalo: data.zalo || ''
                };
                const url = `${GOOGLE_SHEET_URL}?action=create&type=customer&payload=${encodeURIComponent(JSON.stringify(payload))}`;
                await fetch(url);
            } catch (err) { 
                sheetStatus = "\n📊 CRM: ❌ Lỗi ghi"; 
            }
            } catch (err) { 
                sheetStatus = "\n📊 CRM: ❌ Lỗi ghi"; 
            }

            if (msgId) {
                await notifyAdmin(`👤 <b>KHÁCH ĐĂNG KÝ MỚI</b>\n👤: ${data.fullname}\n📧: ${data.email}\n📞: ${data.phone}${sheetStatus}`, msgId);
            }

            // GỬI QUÀ TẶNG NGAY LẬP TỨC (STEP 5)
            try {
                const { subject, html } = templates.gift(data.fullname);
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: FROM_EMAIL,
                        to: data.email,
                        subject: subject,
                        html: html
                    })
                });
            } catch (err) {
                console.error('Gift Email Error:', err);
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
