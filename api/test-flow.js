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
        
        // 2. Gửi song song toàn bộ 7 ngày
        const promises = days.map(day => {
            return fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: student.email,
                    subject: `[TEST DAY ${day}] Bài học Thử thách 7 Ngày`,
                    html: `<h3>Chào ${student.fullname}, đây là bài học Ngày ${day} của bạn.</h3><p>Nội dung đang được kiểm tra...</p>`
                })
            });
        });

        const responses = await Promise.all(promises);
        res.status(200).json({ success: true, count: responses.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
