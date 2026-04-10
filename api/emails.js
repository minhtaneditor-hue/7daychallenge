import { Resend } from 'resend';
import templates from './emails-templates.js';
import { RESEND_API_KEY, FROM_EMAIL, BOT_TOKEN, CHAT_ID } from './_constants.js';

const resend = new Resend(RESEND_API_KEY);

async function notifyTelegram(message, teleMsgId = null) {
    try {
        const method = teleMsgId ? 'editMessageText' : 'sendMessage';
        const body = { chat_id: CHAT_ID, text: message };
        if (teleMsgId) body.message_id = teleMsgId;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    } catch (e) { console.error('Telegram Error:', e); }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { action, fullname, email, phone, day, teleMsgId } = req.body;

    try {
        let emailData;
        let logType = '';

        if (action === 'welcome') {
            emailData = templates.day0(fullname);
            logType = 'CHÀO MỪNG (Day 0)';
        } 
        else if (action === 'send-day' && day) {
            const templateKey = `day${day}`;
            if (templates[templateKey]) {
                emailData = templates[templateKey](fullname);
                logType = `BÀI HỌC NGÀY ${day}`;
            }
        }
        else if (action === 'reminder') {
            emailData = templates.paymentReminder(fullname, phone);
            logType = 'NHẮC THANH TOÁN';
        }

        if (!emailData) return res.status(400).json({ error: 'Action hoặc Day không hợp lệ' });

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [email],
            subject: emailData.subject,
            html: emailData.html,
        });

        if (error) {
            const errorMsg = `⚠️ **LỖI GỬI MAIL:** ${logType}\n👤 Khách: ${fullname}\n📧 Email: ${email}\n❌ Lỗi: ${JSON.stringify(error)}`;
            await notifyTelegram(errorMsg); // Lỗi thì có thể nổ tin mới để admin biết
            return res.status(400).json(error);
        }

        // THÀNH CÔNG: Nếu có teleMsgId thì không báo tin mới, chỉ cần log/update (tùy nhu cầu)
        // Trong flow này, chúng ta sẽ để tệp gọi (webhook/admin) tự update UI cho đẹp
        return res.status(200).json({ success: true, data });
    } catch (err) {
        await notifyTelegram(`🚨 **HỆ THỐNG EMAIL CRASH**\n⚠️ Lỗi: ${err.message}`);
        return res.status(500).json({ error: err.message });
    }
}
