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
                    await fetch(resendUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                        body: JSON.stringify({ from: 'Minh Tấn Academy <marketing@minhtanacademy.com>', to: lead.email, subject: emailData.subject, html: emailData.html })
                    });
                    await fetch(GOOGLE_SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-status', phone: lead.phone, status: 'REMINDED' }) });
                    continue;
                }

                const status = (lead.status || '').toUpperCase();
                if (status === 'PAID' || status.startsWith('DAY_')) {
                    let nextDay = status === 'PAID' ? 1 : (parseInt(status.match(/DAY_(\d+)/)?.[1] || 0) + 1);
                    if (nextDay >= 1 && nextDay <= 7 && diffInDays >= nextDay) {
                        const emailData = templates[`day${nextDay}`](lead.fullname);
                        await fetch(resendUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                            body: JSON.stringify({ from: 'Minh Tấn Academy <marketing@minhtanacademy.com>', to: lead.email, subject: emailData.subject, html: emailData.html })
                        });
                        await fetch(GOOGLE_SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-status', phone: lead.phone, status: `DAY_${nextDay}` }) });
                        sentLogs.push({ email: lead.email, sent_day: nextDay });
                    }
                }
            } catch (e) { console.error(e); }
        }
        res.status(200).json({ success: true, sent: sentLogs });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
}
