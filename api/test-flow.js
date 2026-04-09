import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Missing phone' });

    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbswjN83gB61Hk4nRuOvLBh3I0PahQJlgZ-o6BIKR6Qv4NjerujSL6ZGLSP9J3iafNzZg/exec';

    try {
        // 1. Tìm Email của bạn
        const gsRes = await fetch(GOOGLE_SHEET_URL);
        const leads = await gsRes.json();
        const student = leads.find(l => String(l.phone).replace(/\D/g,'').includes(phone.replace(/\D/g,'')));

        if (!student || !student.email) return res.status(404).json({ error: 'Student not found' });

        const days = [1, 2, 3, 4, 5, 6, 7];
        const results = [];

        // 2. Gửi lần lượt 7 ngày (Mỗi ngày cách nhau 1 giây để tránh bị spam block)
        for (const day of days) {
            const emailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: student.email,
                    subject: `[DAY ${day}] Bài học Thử thách 7 Ngày Lên Tay Phó Nháy`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2>Học phần Ngày ${day}</h2>
                            <p>Chào ${student.fullname}, đây là bài học thử nghiệm cho Ngày ${day} của bạn.</p>
                            <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0;">
                                <p>Nội dung bài học Ngày ${day} sẽ xuất hiện tại đây...</p>
                                <p>Bạn hãy kiểm tra giao diện và nội dung xem đã ưng ý chưa nhé!</p>
                            </div>
                            <p>-- <br><strong>Minh Tấn</strong></p>
                        </div>
                    `
                })
            });
            results.push({ day, status: emailRes.status });
            await new Promise(r => setTimeout(r, 1000));
        }

        res.status(200).json({ success: true, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
