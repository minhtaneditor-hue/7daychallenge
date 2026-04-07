import templates from './emails.js';

export default async function handler(req, res) {
    // Chỉ cho phép Vercel Cron hoặc request có Authorization (để bảo mật)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).end('Unauthorized');
    // }

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlqXGgzQVl47NiiQ4A4Rmv09dCb1rEcipqK4MbyvrT7_2nLZE3403h49kArxO2bLKRyQ/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const resendUrl = 'https://api.resend.com/emails';

    try {
        // 1. Lấy danh sách học viên từ Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL);
        const leads = await response.json();
        
        const now = new Date();
        const sentLogs = [];

        // 2. Duyệt qua từng học viên để kiểm tra ngày
        for (const lead of leads) {
            const signupDate = new Date(lead.timestamp);
            const diffInMs = now - signupDate;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // Chỉ gửi từ Day 1 đến Day 7
            if (diffInDays >= 1 && diffInDays <= 7) {
                const day = diffInDays;
                const templateKey = `day${day}`;
                
                if (templates[templateKey]) {
                    const emailData = templates[templateKey](lead.fullname);
                    
                    // Gửi email bài học tương ứng
                    await fetch(resendUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'Minh Tấn <challenge@minhtanacademy.com>',
                            to: lead.email,
                            subject: `📸 ${emailData.subject}`,
                            html: emailData.html
                        })
                    });
                    sentLogs.push({ email: lead.email, day: day });
                }
            }
        }

        res.status(200).json({ success: true, processed: leads.length, sent: sentLogs });
    } catch (error) {
        console.error('Cron Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
