import { BOT_TOKEN, RESEND_API_KEY, FROM_EMAIL } from './_lib/constants.js';
import templates from './_lib/emails-templates.js';
import { query, execute } from './_lib/db.js';

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
                        // Tránh tình trạng bấm nhiều lần gửi nhiều email
                        if (latestOrder.status === 'success' || latestOrder.status === 'cancel') {
                             return res.status(200).json({ success: true, message: 'Already processed' });
                        }

                        await execute('UPDATE orders SET status = ? WHERE id = ?', [status, latestOrder.id]);

                        // 3. IF APPROVED -> GỬI EMAIL THÀNH CÔNG VÀ LÊN LỊCH DAY 1-7
                        if (isApprove) {
                            try {
                                const productId = latestOrder.product_id;
                                const products = await query('SELECT name FROM products WHERE id = ? LIMIT 1', [productId]);
                                const productName = (products && products[0]) ? products[0].name : "Thử thách 7 Ngày Lên Tay Phó Nháy";
                                const amount = latestOrder.amount;

                                if (productId == 6) {
                                    // TRƯỜNG HỢP EBOOK: Chỉ gửi 1 mail trả kết quả ebook
                                    const ebookTemplate = templates.ebookDelivery(customer.fullname);
                                    await fetch('https://api.resend.com/emails', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${RESEND_API_KEY}`
                                        },
                                        body: JSON.stringify({ 
                                            from: FROM_EMAIL, 
                                            to: customer.email, 
                                            subject: ebookTemplate.subject, 
                                            html: ebookTemplate.html 
                                        })
                                    });
                                } else {
                                    // TRƯỜNG HỢP THỬ THÁCH 7 NGÀY: Gửi xác nhận và lên lịch 7 ngày
                                    // Email 0: Order Success (Ngay lập tức)
                                    const successTemplate = templates.orderSuccess(customer.fullname, productName, amount);
                                    await fetch('https://api.resend.com/emails', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${RESEND_API_KEY}`
                                        },
                                        body: JSON.stringify({ 
                                            from: FROM_EMAIL, 
                                            to: customer.email, 
                                            subject: successTemplate.subject, 
                                            html: successTemplate.html 
                                        })
                                    });

                                    // Lên lịch Day 1 đến Day 7
                                    for (let i = 1; i <= 7; i++) {
                                        const dayTemplate = templates[`day${i}`](customer.fullname);
                                        const scheduledDate = new Date();
                                        scheduledDate.setDate(scheduledDate.getDate() + i);
                                        scheduledDate.setHours(8, 0, 0, 0);

                                        await fetch('https://api.resend.com/emails', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${RESEND_API_KEY}`
                                            },
                                            body: JSON.stringify({
                                                from: FROM_EMAIL,
                                                to: customer.email,
                                                subject: dayTemplate.subject,
                                                html: dayTemplate.html,
                                                scheduled_at: scheduledDate.toISOString()
                                            })
                                        });
                                    }
                                }
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
