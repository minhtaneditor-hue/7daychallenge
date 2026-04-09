export default async function handler(req, res) {
    const email = req.query.email || 'minhtantt1994@gmail.com';
    const fullname = req.query.fullname || 'Lê Minh Tấn';
    
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const days = [1, 2, 3, 4, 5, 6, 7];

    try {
        const promises = days.map(day => {
            return fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: email,
                    subject: `[DAY ${day}] Thử thách 7 Ngày Lên Tay Phó Nháy`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                            <h2 style="color: #000;">BÀI HỌC NGÀY ${day}</h2>
                            <p>Chào ${fullname},</p>
                            <p>Đây là bài học thử nghiệm cho ngày thứ ${day} trong chuỗi thử thách của bạn.</p>
                            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p>Nội dung đang được bạn tinh chỉnh trong dashboard admin sẽ xuất hiện tại đây!</p>
                            </div>
                            <p>Hẹn gặp lại bạn vào bài học tiếp theo!</p>
                            <p>-- <br><strong>Minh Tấn</strong></p>
                        </div>
                    `
                })
            });
        });

        await Promise.all(promises);
        res.status(200).json({ success: true, message: '7-day test emails sent to ' + email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
