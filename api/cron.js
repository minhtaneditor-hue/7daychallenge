import templates from './emails-templates.js';

export default async function handler(req, res) {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzY6Y0FzxnoyZUzeqmnWbM2MFqlCJEEVnlFVAW_ewZTYbiwA7EXVicOvms8k_MZ0DO9EA/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const resendUrl = 'https://api.resend.com/emails';

    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const leads = await response.json();
        const now = new Date();
        const sentLogs = [];
        const errors = [];

        async function notifyTelegram(message) {
            const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
            const CHAT_ID = '7384174497';
            try {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text: message })
                });
            } catch (e) { console.error('Telegram Error:', e); }
        }

        const getDiffDays = (dateStr) => {
            if (!dateStr) return -1;
            const signupDate = new Date(dateStr);
            const d1 = new Date(signupDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
            const d2 = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
            d1.setHours(0,0,0,0);
            d2.setHours(0,0,0,0);
            return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
        };

        for (const lead of leads) {
            try {
                const diffInDays = getDiffDays(lead.timestamp);
                const signupDate = new Date(lead.timestamp);
                const diffInMs = now - signupDate;
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

                if (!lead.status && diffInMinutes >= 30 && diffInMinutes <= 90) {
                    const emailData = templates.paymentReminder(lead.fullname, lead.phone);
                    const res = await fetch(resendUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                        body: JSON.stringify({ from: 'Minh Tấn Academy <marketing@minhtanacademy.com>', to: lead.email, subject: emailData.subject, html: emailData.html })
                    });
                    if (res.ok) {
                        await fetch(GOOGLE_SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-status', phone: lead.phone, status: 'REMINDED' }) });
                        sentLogs.push({ email: lead.email, type: 'Reminder' });
                    } else {
                        errors.push({ email: lead.email, stage: 'Reminder', status: res.status });
                    }
                    continue;
                }

                const status = (lead.status || '').toUpperCase();
                if (status === 'PAID' || status.startsWith('DAY_')) {
                    let nextDay = status === 'PAID' ? 1 : (parseInt(status.match(/DAY_(\d+)/)?.[1] || 0) + 1);
                    if (nextDay >= 1 && nextDay <= 7 && diffInDays >= nextDay) {
                        const emailData = templates[`day${nextDay}`](lead.fullname);
                        const res = await fetch(resendUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                            body: JSON.stringify({ from: 'Minh Tấn Academy <marketing@minhtanacademy.com>', to: lead.email, subject: emailData.subject, html: emailData.html })
                        });
                        if (res.ok) {
                            await fetch(GOOGLE_SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-status', phone: lead.phone, status: `DAY_${nextDay}` }) });
                            sentLogs.push({ email: lead.email, sent_day: nextDay });
                        } else {
                            errors.push({ email: lead.email, stage: `Day ${nextDay}`, status: res.status });
                        }
                    }
                }
            } catch (e) { errors.push({ error: e.message }); }
        }

        // GỬI BÁO CÁO TỔNG KẾT QUA TELEGRAM
        if (sentLogs.length > 0 || errors.length > 0) {
            let summary = `📊 BÁO CÁO GỬI MAIL HÀNG NGÀY\n`;
            summary += `✅ Thành công: ${sentLogs.length}\n`;
            summary += `❌ Thất bại: ${errors.length}\n`;
            if (sentLogs.length > 0) {
                summary += `\n📝 Chi tiết gửi thành công:\n` + sentLogs.map(l => `- ${l.email} (${l.sent_day ? 'Day '+l.sent_day : 'Reminder'})`).join('\n');
            }
            if (errors.length > 0) {
                summary += `\n⚠️ Chi tiết lỗi:\n` + errors.map(e => `- ${e.email || 'System'}: ${e.stage || ''} (${e.status || e.error})`).join('\n');
            }
            await notifyTelegram(summary);
        }

        res.status(200).json({ success: true, sent: sentLogs, errors });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
