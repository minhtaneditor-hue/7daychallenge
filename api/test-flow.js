import templates from './emails-templates.js';
import { RESEND_API_KEY, FROM_EMAIL } from './_constants.js';

export default async function handler(req, res) {
    const email = req.query.email || 'minhtantt1994@gmail.com';
    const fullname = req.query.fullname || 'Lê Minh Tấn';
    
    const days = [0, 1, 2, 3, 4, 5, 6, 7];

    try {
        const results = [];
        
        // 1. GỬI LÁ THƯ DUYỆT ĐƠN (WELCOME APPROVAL)
        try {
            const approvalRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: FROM_EMAIL,
                    to: email,
                    subject: '🎉 Chúc mừng! Đơn đăng ký học của bạn đã được duyệt thành công!',
                    html: `<h2>Chào mừng ${fullname}!</h2><p>Hệ thống đã kích hoạt khóa học cho bạn.</p>`
                })
            });
            const resData = await approvalRes.json();
            results.push({ step: 'Approval', status: approvalRes.status, data: resData });
        } catch (e) { results.push({ step: 'Approval', error: e.message }); }

        // 2. GỬI TIẾP NGÀY 0 VÀ NGÀY 1 ĐỂ KIỂM TRA TEMPLATE
        const testDays = [0, 1];
        for (const day of testDays) {
            try {
                const templateKey = `day${day}`;
                const { subject, html } = templates[templateKey](fullname);

                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: FROM_EMAIL,
                        to: email,
                        subject: subject,
                        html: html
                    })
                });
                const resData = await emailRes.json();
                results.push({ step: `Day ${day}`, status: emailRes.status, data: resData });
            } catch (e) { results.push({ step: `Day ${day}`, error: e.message }); }
        }

        res.status(200).json({ 
            success: true, 
            message: `🚀 Đã gửi thử nghiệm 3 mail (Duyệt, Day 0, Day 1) tới ${email}`,
            details: results 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
