import templates from './emails.js';

export default async function handler(req, res) {
    const email = req.query.email || 'minhtantt1994@gmail.com';
    const fullname = req.query.fullname || 'Lê Minh Tấn';
    
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const days = [0, 1, 2, 3, 4, 5, 6, 7];

    try {
        const results = [];
        
        // 1. GỬI LÁ THƯ DUYỆT ĐƠN (WELCOME APPROVAL)
        const approvalRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Minh Tấn <challenge@minhtanacademy.com>',
                to: email,
                subject: '🎉 Chúc mừng! Đơn đăng ký học của bạn đã được duyệt thành công!',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                        <h2 style="color: #000;">Chào mừng ${fullname}!</h2>
                        <p>Tôi đã xác nhận bạn tham gia <b>Thử thách 7 Ngày Lên Tay Phó Nháy</b>.</p>
                        <p><strong>Bắt đầu từ đâu?</strong> Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                        <p>-- <br><strong>Minh Tấn</strong></p>
                    </div>
                `
            })
        });
        results.push({ day: 'Approval', status: approvalRes.status });

        // 2. Gửi các ngày còn lại
        for (const day of days) {
            const templateKey = `day${day}`;
            const { subject, html } = templates[templateKey](fullname);

            const emailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: email,
                    subject: subject,
                    html: html
                })
            });

            results.push({ day, status: emailRes.status });
            
            // Đợi 2 giây trước khi gửi ngày tiếp theo
            await new Promise(r => setTimeout(r, 2000));
        }

        res.status(200).json({ 
            success: true, 
            message: `🚀 ĐÃ PHÁT HỎA TOÀN BỘ 7 NGÀY (NỘI DUNG CHUẨN) TỚI ${email}`,
            details: results 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
