import { query, execute } from './_lib/db.js';

export default async function handler(req, res) {
    const CRON_SECRET = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // Auth bypass for local testing if needed, or strict for production
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        // 1. LẤY DANH SÁCH PAID STUDENTS TỪ BD (Orders success JOIN Customers)
        const students = await query(sql);

        if (!students || students.length === 0) {
            return res.status(200).json({ message: 'No active students found' });
        }

        const results = [];
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;

        for (const student of students) {
            // Xác định ngày tiếp theo
            let currentDay = 0;
            if (student.order_status.startsWith('DAY')) {
                currentDay = parseInt(student.order_status.replace('DAY', ''));
            } else if (student.order_status === 'success') {
                currentDay = 0; // Vừa mua xong, chuẩn bị sang DAY1
            }
            
            const nextDay = currentDay + 1;

            if (nextDay <= 7) {
                // Gửi Email bài học (gọi API emails)
                await fetch(`${protocol}://${host}/api/emails`, {
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

                // Cập nhật trạng thái mới vào table orders
                await execute('UPDATE orders SET status = ? WHERE id = ?', [`DAY${nextDay}`, student.order_id]);

                results.push({ student: student.fullname, day: nextDay });
            } else {
                // Kết thúc khóa học
                await execute("UPDATE orders SET status = 'DONE' WHERE id = ?", [student.order_id]);
            }
        }

        return res.status(200).json({ success: true, sent: results });
    } catch (error) {
        console.error('Cron Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
