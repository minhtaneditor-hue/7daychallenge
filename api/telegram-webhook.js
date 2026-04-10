import { GOOGLE_SHEET_URL, BOT_TOKEN } from './_constants.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { message, callback_query } = req.body;

        // XỬ LÝ NÚT BẤM (CALLBACK QUERY)
        if (callback_query) {
            const data = callback_query.data;
            const chatId = callback_query.message.chat.id;
            const messageId = callback_query.message.message_id;
            const originalText = callback_query.message.text;

            if (data.startsWith('approve_') || data.startsWith('reject_')) {
                const [action, phone] = data.split('_');
                const isApprove = action === 'approve';
                const status = isApprove ? 'PAID' : 'CANCEL';

                // 1. CẬP NHẬT GOOGLE SHEET
                const gsRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update-status', phone, status })
                });
                const gsData = await gsRes.json();

                if (gsData.success) {
                    // 2. NẾU DUYỆT -> GỬI EMAIL CHÀO MỪNG (Dùng api/emails)
                    if (isApprove) {
                        try {
                            const protocol = req.headers['x-forwarded-proto'] || 'http';
                            const host = req.headers.host;
                            // Lấy thông tin khách từ dữ liệu trả về của Sheet (nếu Google Script trả về)
                            // Hoặc gọi email welcome đơn giản
                            await fetch(`${protocol}://${host}/api/emails`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                    action: 'welcome', 
                                    fullname: gsData.fullname || 'Học viên', 
                                    email: gsData.email,
                                    phone: phone 
                                })
                            });
                        } catch (e) { console.error('Email trigger error:', e); }
                    }

                    // 3. CẬP NHẬT LẠI TIN NHẮN TELEGRAM (Ẩn nút)
                    const statusText = isApprove ? '✅ ĐÃ DUYỆT (PAID)' : '❌ ĐÃ HỦY ĐƠN';
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: messageId,
                            text: `${originalText}\n\nTrạng thái: ${statusText}`
                        })
                    });
                }
            }
            return res.status(200).json({ success: true });
        }

        // PHẢN HỒI TIN NHẮN THƯỜNG (Nếu cần)
        if (message && message.text === '/start') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: message.chat.id,
                    text: "Chào Tấn, Bot quản trị 7 Day Challenge đã sẵn sàng!"
                })
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(200).json({ error: error.message }); // Luôn trả 200 cho Tele
    }
}
