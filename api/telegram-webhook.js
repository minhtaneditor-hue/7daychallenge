import { BOT_TOKEN } from './_constants.js';
import { query, execute } from './_db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { message, callback_query } = req.body;

        if (callback_query) {
            const data = callback_query.data;
            const chatId = callback_query.message.chat.id;
            const messageId = callback_query.message.message_id;
            const originalText = callback_query.message.text;

            if (data.startsWith('approve_') || data.startsWith('reject_')) {
                const [action, phone] = data.split('_');
                const isApprove = action === 'approve';
                const status = isApprove ? 'success' : 'cancel';

                // 1. FIND CUSTOMER IN SQLITE
                const customers = await query('SELECT * FROM customers WHERE phone = ?', [phone]);
                const customer = customers[0];
                
                if (customer) {
                    // 2. FIND AND UPDATE LATEST ORDER
                    const orders = await query('SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC LIMIT 1', [customer.id]);
                    const latestOrder = orders[0];
                    
                    if (latestOrder) {
                        await execute('UPDATE orders SET status = ? WHERE id = ?', [status, latestOrder.id]);

                        // 3. IF APPROVED -> TRIGGER EMAIL DAY 0 (WELCOME)
                        if (isApprove) {
                            try {
                                const protocol = req.headers['x-forwarded-proto'] || 'http';
                                const host = req.headers.host;
                                await fetch(`${protocol}://${host}/api/emails`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        action: 'welcome', 
                                        fullname: customer.fullname, 
                                        email: customer.email,
                                        phone: phone 
                                    })
                                });
                            } catch (e) { console.error('Email error:', e); }
                        }
                    }
                }

                // 4. UPDATE TELEGRAM UI
                const statusEmoji = isApprove ? '✅ ĐÃ DUYỆT (PAID)' : '❌ ĐÃ HỦY ĐƠN';
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: messageId,
                        text: `${originalText}\n\n<b>Trạng thái: ${statusEmoji}</b>`,
                        parse_mode: 'HTML'
                    })
                });
            }
            return res.status(200).json({ success: true });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram Webhook Error:', error);
        return res.status(200).json({ error: error.message });
    }
}
