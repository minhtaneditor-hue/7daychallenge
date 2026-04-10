export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const update = req.body;
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxbChrkAVLRFvQ128Qde_o123wYGBwHN-zPrd34Cm2k_QpiqtlgZNpM5acf9Yy2YCjCgg/exec';

    // Helper to send message back to admin
    const notifyAdmin = async (text) => {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text })
        });
    };

    try {
        if (update.callback_query) {
            const { id: callbackId, data, message } = update.callback_query;
            const [action, phone] = data.split('_');
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

            if (action === 'approve') {
                // Immediate feedback to Telegram UI
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '⌛ Đang xử lý Duyệt & Gửi Email...' })
                });

                try {
                    // 1. Fetch data from Google Sheet to get Email
                    const gsRes = await fetch(GOOGLE_SHEET_URL);
                    const leads = await gsRes.json();
                    const student = leads.find(l => String(l.phone).replace(/\D/g,'').includes(phone.replace(/\D/g,'')));

                    if (!student) {
                        await notifyAdmin(`❌ KHÔNG TÌM THẤY SĐT: ${phone} trong Google Sheet!`);
                        return res.status(200).json({ ok: true });
                    }

                    // 2. Trigger Welcome Email
                    const protocol = req.headers['x-forwarded-proto'] || 'https';
                    const host = req.headers.host;
                    const emailRes = await fetch(`${protocol}://${host}/api/emails`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            action: 'welcome', 
                            fullname: student.fullname, 
                            email: student.email, 
                            phone: student.phone 
                        })
                    });

                    if (!emailRes.ok) {
                        const errData = await emailRes.json();
                        await notifyAdmin(`⚠️ LỖI GỬI EMAIL: ${JSON.stringify(errData)}`);
                    }

                    // 3. Update Status to PAID in Google Sheet
                    await fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'update-status', phone: phone, status: 'PAID' })
                    });
                    
                    // 4. Update the message buttons in chat
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            message_id: message.message_id,
                            text: message.text + `\n\n✅ ĐÃ DUYỆT & GỬI CHÀO MỪNG\n⏰ ${vnTime}`,
                            reply_markup: { inline_keyboard: [[{ text: "✅ THÀNH CÔNG", callback_data: "none" }]] }
                        })
                    });

                } catch (err) {
                    await notifyAdmin(`🚨 LỖI WEBHOOK: ${err.message}`);
                }
            }
        }
        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(200).json({ ok: true });
    }
}
