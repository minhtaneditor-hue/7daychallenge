import { Resend } from 'resend';
import templates from './emails-templates.js'; // Tôi sẽ tách template ra để file gọn hơn

const resend = new Resend(process.env.RESEND_API_KEY || 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { action, fullname, email, phone, day } = req.body;

    try {
        let emailData;

        // 1. GỬI MAIL CHÀO MỪNG (Welcome / Day 0)
        if (action === 'welcome') {
            emailData = templates.day0(fullname);
        } 
        // 2. GỬI MAIL THEO NGÀY (Day 1 - Day 7)
        else if (action === 'send-day' && day) {
            const templateKey = `day${day}`;
            if (templates[templateKey]) {
                emailData = templates[templateKey](fullname);
            }
        }
        // 3. NHẮC NHỞ THANH TOÁN
        else if (action === 'reminder') {
            emailData = templates.paymentReminder(fullname, phone);
        }

        if (!emailData) return res.status(400).json({ error: 'Invalid action or day' });

        const { data, error } = await resend.emails.send({
            from: 'Minh Tấn Academy <marketing@minhtanacademy.com>',
            to: [email],
            subject: emailData.subject,
            html: emailData.html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(400).json(error);
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
