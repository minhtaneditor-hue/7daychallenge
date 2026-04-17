import { RESEND_API_KEY, FROM_EMAIL, BOT_TOKEN, CHAT_ID } from './_constants.js';
import templates from './emails-templates.js';
import { query, execute } from './_db.js';

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

        // 2. FIND PENDING ORDER OR CREATE SUCCESS
        const orders = await query('SELECT * FROM orders WHERE customer_id = ? AND status = ? ORDER BY id DESC LIMIT 1', [customer.id, 'pending']);
        const pendingOrder = orders[0];

        if (pendingOrder) {
            await execute(
                'UPDATE orders SET status = ?, transaction_id = ?, amount = ? WHERE id = ?',
                ['success', referenceNum, amount, pendingOrder.id]
            );
        } else {
            await execute(
                'INSERT INTO orders (customer_id, product_id, amount, status, transaction_id) VALUES (?, ?, ?, ?, ?)',
                [customer.id, 1, amount, 'success', referenceNum]
            );
        }

        // 3. UPDATE STOCK
        const products = await query('SELECT id FROM products LIMIT 1');
        const product = products[0] || { id: 1 };
        await execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [product.id]);

        // 4. TRIGGER EMAIL & TELEGRAM ALERT
        try {
            // Lấy tên sản phẩm nếu có, mặc định là sản phẩm chính
            const productName = product.name || "Khóa học 7 Ngày Lên Tay Phó Nháy";
            const { subject, html } = templates.orderSuccess(customer.fullname, productName, amount);
            
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({ from: FROM_EMAIL, to: customer.email, subject, html })
            });

            // TELEGRAM NOTIFICATION
            await notifyAdmin(`💰 <b>TIỀN ĐÃ VỀ TỰ ĐỘNG!</b>\n━━━━━━━━━━━━━━━\n👤: ${customer.fullname}\n📧: ${customer.email}\n📞: ${phone}\n💵: ${amount.toLocaleString()}đ\n\n✅ Hệ thống đã tự động duyệt và gửi mail xác nhận đơn hàng cho học viên!`);
        } catch (e) { 
            console.error('Notification error:', e); 
        }

        return res.status(200).json({ success: true, message: 'Success' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
