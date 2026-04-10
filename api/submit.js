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
        } catch (e) { return null; }
    };

    try {
        const body = req.body;
        const { action, teleMsgId, ...data } = body;

        // 1. LEAD
        if (!action || action === 'submit-lead') {
            const firstMsg = await notifyAdmin(`🔔 **CÓ KHÁCH MỚI!**\n⏳ Đang lưu...`);
            const msgId = firstMsg?.result?.message_id;

            let sheetStatus = "✅";
            try {
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-lead', ...data }),
                    redirect: 'follow'
                });
                if (!gsRes.ok) throw new Error();
            } catch (err) { sheetStatus = "❌"; }

            if (msgId) {
                await notifyAdmin(`👤 **KHÁCH ĐĂNG KÝ MỚI**\n👤: ${data.fullname}\n📞: ${data.phone}\n📊 Sheet: ${sheetStatus}`, msgId);
            }
            return res.status(200).json({ success: true, teleMsgId: msgId });
        }

        // 1.5. WAITLIST
        if (action === 'submit-waitlist') {
            try {
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'submit-waitlist', ...data }),
                    redirect: 'follow'
                });
                
                if (!gsRes.ok) {
                    const errorMsg = await gsRes.text();
                    return res.status(500).json({ success: false, error: "GS Error: " + errorMsg });
                }
                
                return res.status(200).json({ success: true });
            } catch (err) { 
                return res.status(500).json({ success: false, error: err.message });
            }
        }

        // 2. CONFIRM
        if (action === 'confirm-payment') {
            await notifyAdmin(`💰 **XÁC NHẬN CHUYỂN TIỀN!**\n👤 Khách: ${data.fullname}\n📞 SĐT: ${data.phone}`, teleMsgId, {
                inline_keyboard: [[{ text: "✅ DUYỆT", callback_data: `approve_${data.phone}` }]]
            });
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
