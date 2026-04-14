import { GOOGLE_SHEET_URL } from './_constants.js';

export default async function handler(req, res) {
    const CRON_SECRET = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        // 1. LẤY DANH SÁCH PAID STUDENTS
        const response = await fetch(`${GOOGLE_SHEET_URL}?action=get-students`);
        const students = await response.json();

        if (!students || !Array.isArray(students)) {
            return res.status(200).json({ message: 'No students found' });
        }

        // 2. LỌC NHỮNG NGƯỜI ĐANG TRONG QUÁ TRÌNH HỌC (PAID hoặc DAY X)
        const activeStudents = students.filter(s => 
            s.status !== 'LEAD' && s.status !== 'CANCEL' && s.status !== 'DONE'
        );

        const results = [];
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;

        for (const student of activeStudents) {
            // Xác định ngày tiếp theo
            let currentDay = 0;
            if (student.status.startsWith('DAY')) {
                currentDay = parseInt(student.status.replace('DAY', ''));
            }
            const nextDay = currentDay + 1;

            if (nextDay <= 7) {
                // Gửi Email bài học
                const emailRes = await fetch(`${protocol}://${host}/api/emails`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'send-day',
                        day: nextDay,
                        fullname: student.fullname,
                        email: student.email,
                        phone: student.phone
                    })
                });

                // Cập nhật trạng thái mới lên Sheet
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update-status',
                        phone: student.phone,
                        status: `DAY${nextDay}`
                    })
                });

                results.push({ student: student.fullname, day: nextDay });
            } else {
                // Kết thúc khóa học
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update-status',
                        phone: student.phone,
                        status: 'DONE'
                    })
                });
            }
        }

        return res.status(200).json({ success: true, sent: results });
    } catch (error) {
        console.error('Cron Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
