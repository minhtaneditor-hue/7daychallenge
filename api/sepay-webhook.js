import { GOOGLE_SHEET_URL, RESEND_API_KEY, FROM_EMAIL, BOT_TOKEN, CHAT_ID } from './_constants.js';
import templates from './emails-templates.js';

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

        // 1. FETCH CRM DATA
        const sheetRes = await fetch(`${GOOGLE_SHEET_URL}?action=get-data`);
        const { customers, products } = await sheetRes.json();

        // 2. FIND CUSTOMER
        const customer = customers.find(c => String(c.phone) === String(phone));
        if (!customer) return res.status(200).json({ success: true, message: 'Customer not found' });

        // 3. CREATE ORDER
        const product = products[0] || { id: 1 };
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create',
                type: 'order',
                payload: {
                    customer_id: customer.id,
                    product_id: product.id,
                    amount: amount,
                    status: 'success',
                    transaction_id: referenceNum
                }
            })
        });

        // 4. TRIGGER EMAIL & TELEGRAM ALERT
        try {
            const { subject, html } = templates.day0(customer.fullname);
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({ from: FROM_EMAIL, to: customer.email, subject, html })
            });

            // TELEGRAM NOTIFICATION
            await notifyAdmin(`💰 <b>TIỀN ĐÃ VỀ TỰ ĐỘNG!</b>\n━━━━━━━━━━━━━━━\n👤: ${customer.fullname}\n📧: ${customer.email}\n📞: ${phone}\n💵: ${amount.toLocaleString()}đ\n\n✅ Hệ thống đã tự động duyệt và gửi mail kích hoạt cho học viên!`);
        } catch (e) { 
            console.error('Notification error:', e); 
        }

        return res.status(200).json({ success: true, message: 'Success' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
