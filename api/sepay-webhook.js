import { RESEND_API_KEY, FROM_EMAIL, BOT_TOKEN, CHAT_ID } from './_lib/constants.js';
import templates from './_lib/emails-templates.js';
import { query, execute } from './_lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const notifyAdmin = async (text) => {
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
            });
        } catch (e) { console.error('Telegram Notify Error:', e); }
    };

    try {
        const body = req.body;
        const { amount, content, referenceNum, transferType } = body;

        if (transferType !== 'In') {
            return res.status(200).json({ success: true, message: 'Not inbound' });
        }

        const phoneMatch = content.match(/0\d{9,10}/);
        if (!phoneMatch) return res.status(200).json({ success: true, message: 'No phone matched' });
        const phone = phoneMatch[0];

        // 1. FIND CUSTOMER IN SQLITE
        const customers = await query('SELECT * FROM customers WHERE phone = ?', [phone]);
        const customer = customers[0];
        if (!customer) return res.status(200).json({ success: true, message: 'Customer not found' });

        // 2. FIND PENDING ORDER
        const orders = await query('SELECT * FROM orders WHERE customer_id = ? AND status = ? ORDER BY id DESC LIMIT 1', [customer.id, 'pending']);
        const pendingOrder = orders[0];

        let productId = 5; // Default to 7-day challenge
        let orderId = null;

        if (pendingOrder) {
            productId = pendingOrder.product_id;
            orderId = pendingOrder.id;
            await execute(
                'UPDATE orders SET status = ?, transaction_id = ?, amount = ? WHERE id = ?',
                ['success', referenceNum, amount, pendingOrder.id]
            );
        } else {
            // Trường hợp không tìm thấy đơn pending (khách ck trực tiếp không qua form)
            await execute(
                'INSERT INTO orders (customer_id, product_id, amount, status, transaction_id) VALUES (?, ?, ?, ?, ?)',
                [customer.id, 5, amount, 'success', referenceNum]
            );
            const lastOrders = await query('SELECT id FROM orders ORDER BY id DESC LIMIT 1');
            orderId = lastOrders[0].id;
        }

        // 3. GET PRODUCT INFO & UPDATE STOCK
        const products = await query('SELECT * FROM products WHERE id = ? LIMIT 1', [productId]);
        const product = products[0] || { id: 5, name: "Thử thách 7 Ngày Lên Tay Phó Nháy" };
        await execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [productId]);

        // 4. TRIGGER EMAIL & TELEGRAM ALERT
        try {
            const productName = product.name;
            
            if (productId == 6) {
                // TRƯỜNG HỢP EBOOK: Chỉ gửi mail trả kết quả
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

                // Schedule Day 1 to Day 7
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

            // TELEGRAM NOTIFICATION
            await notifyAdmin(`💰 <b>TIỀN ĐÃ VỀ TỰ ĐỘNG!</b>\n━━━━━━━━━━━━━━━\n👤: ${customer.fullname}\n📧: ${customer.email}\n📞: ${phone}\n💵: ${amount.toLocaleString()}đ\n\n✅ Đã kích hoạt lộ trình 7 ngày học tập tự động cho học viên!`);
        } catch (e) { 
            console.error('Notification error:', e); 
        }

        return res.status(200).json({ success: true, message: 'Success' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
