import { CHAT_ID, CRON_SECRET, BOT_TOKEN } from './_lib/constants.js';
import { query } from './_lib/db.js';

async function sendTelegram(text) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    });
}

export default async function handler(req, res) {
    // Bảo vệ endpoint - chỉ Vercel Cron hoặc request có secret mới gọi được
    const authHeader = req.headers.authorization || '';
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // Lấy thống kê từ DB
        const [totalOrders] = await query(`SELECT COUNT(*) as total FROM orders`);
        const [successOrders] = await query(`SELECT COUNT(*) as total FROM orders WHERE status = 'success' OR status LIKE 'DAY%' OR status = 'DONE'`);
        const [pendingOrders] = await query(`SELECT COUNT(*) as total FROM orders WHERE status = 'pending'`);
        const [todayOrders] = await query(`SELECT COUNT(*) as total FROM orders WHERE date(created_at) = date('now')`);
        const [totalCustomers] = await query(`SELECT COUNT(*) as total FROM customers`);

        const totalCount = totalOrders?.total || 0;
        const successCount = successOrders?.total || 0;
        const pendingCount = pendingOrders?.total || 0;
        const todayCount = todayOrders?.total || 0;
        const customerCount = totalCustomers?.total || 0;

        const message = `💓 <b>HEARTBEAT - Hệ thống đang sống</b>
🕐 <b>Thời gian:</b> ${now}

📊 <b>THỐNG KÊ TỔNG QUAN:</b>
👥 Khách hàng: <b>${customerCount}</b>
📦 Tổng đơn: <b>${totalCount}</b>
✅ Đã thanh toán: <b>${successCount}</b>
⏳ Chờ duyệt: <b>${pendingCount}</b>
🆕 Hôm nay: <b>${todayCount}</b>

🟢 <i>Server OK | DB OK | Bot OK</i>`;

        await sendTelegram(message);

        return res.status(200).json({
            success: true,
            timestamp: now,
            stats: { totalOrders: totalCount, successOrders: successCount, pendingOrders: pendingCount, todayOrders: todayCount, totalCustomers: customerCount }
        });
    } catch (error) {
        console.error('Heartbeat Error:', error);

        // Vẫn gửi alert dù lỗi
        try {
            const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            await sendTelegram(`🔴 <b>HEARTBEAT ALERT</b>\n🕐 ${now}\n❌ Lỗi hệ thống: <code>${error.message}</code>`);
        } catch (_) {}

        return res.status(500).json({ error: error.message });
    }
}
