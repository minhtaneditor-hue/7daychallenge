import { GOOGLE_SHEET_URL, BOT_TOKEN } from './_constants.js';

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

                // 1. FETCH ALL CRM DATA
                const listRes = await fetch(`${GOOGLE_SHEET_URL}?action=get-data`);
                const { customers, orders } = await listRes.json();
                
                const customer = customers.find(c => String(c.phone) === String(phone));
                
                if (customer) {
                    // Update latest order for this customer
                    const latestOrder = orders.filter(o => String(o.customer_id) === String(customer.id)).sort((a,b) => b.id - a.id)[0];
                    
                    if (latestOrder) {
                        // 2. UPDATE STATUS IN CRM
                        await fetch(GOOGLE_SHEET_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                action: 'update', 
                                type: 'order', 
                                payload: { id: latestOrder.id, status: status } 
                            })
                        });

                        // 3. IF APPROVED -> TRIGGER EMAIL DAY 0
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
