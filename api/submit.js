import { BOT_TOKEN, CHAT_ID, RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import templates from './emails-templates.js';
import { execute } from './_db.js';

export default async (req, res) => {
    const notifyAdmin = async (text, msgId = null, replyMarkup = null) => {
        try {
            const method = msgId ? 'editMessageText' : 'sendMessage';
            const body = { chat_id: CHAT_ID, text, parse_mode: 'HTML' };
            if (msgId) body.message_id = msgId;
            if (replyMarkup) body.reply_markup = replyMarkup;

            const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await tgRes.json();
        } catch (e) { console.error('Telegram Notify Error:', e); return null; }
    };

    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: 'No body' });
        
        const { action, teleMsgId, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD / WAITLIST -> CUSTOMER IN CRM)
        if (!action || action === 'submit-lead' || action === 'submit-waitlist') {
            const firstMsg = await notifyAdmin(`🔔 <b>CÓ KHÁCH MỚI (${action || 'lead'})!</b>\n⏳ Đang lưu vào CRM...`);
            const msgId = firstMsg?.result?.message_id;

            let dbStatus = "\n📊 CRM: ✅ Đã lưu";
            let orderId = null;
            try {
                // 1. Lưu Customer
                const custSql = `INSERT INTO customers (fullname, phone, email, zalo) VALUES (?, ?, ?, ?)`;
                const custRes = await execute(custSql, [data.name || data.fullname, data.phone, data.email || '', data.zalo || '']);
                const customerId = custRes.id;

                // 2. Tạo Order ở trạng thái PENDING
                // Lấy sản phẩm đầu tiên (khóa học chính) hoặc mặc định ID 1
                const products = await query('SELECT id FROM products LIMIT 1');
                const productId = products[0]?.id || 1;
                
                const orderSql = `INSERT INTO orders (customer_id, product_id, amount, status) VALUES (?, ?, ?, ?)`;
                const orderRes = await execute(orderSql, [customerId, productId, 199000, 'pending']);
                orderId = orderRes.id;

            } catch (err) {
                console.error('DB Insert Error:', err);
                dbStatus = "\n📊 CRM: ❌ Lỗi ghi (SQLite)";
            }

            if (msgId) {
                await notifyAdmin(`👤 <b>KHÁCH ĐĂNG KÝ MỚI</b>\n👤: ${data.name || data.fullname}\n📞: ${data.phone}${dbStatus}${orderId ? `\n🆔 Đơn hàng: #${orderId}` : ''}`, msgId);
            }

            // GỬI QUÀ TẶNG NGAY LẬP TỨC nếu có email
            if (data.email) {
                try {
                    const { subject, html } = templates.gift(data.name || data.fullname);
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: FROM_EMAIL,
                            to: data.email,
                            subject: subject,
                            html: html
                        })
                    });
                } catch (err) {
                    console.error('Gift Email Error:', err);
                }
            }

            return res.status(200).json({ success: true, teleMsgId: msgId, orderId: orderId });
        }

        // 2. CONFIRM PAYMENT (NOTIFY FOR MANUAL CHECK)
        if (action === 'confirm-payment') {
            const message = `💰 <b>XÁC NHẬN CHUYỂN TIỀN!</b>\n` +
                          `━━━━━━━━━━━━━━━\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng và DUYỆT ngay nhé!\n(Hoặc đợi SePay tự động duyệt)`;

            const replyMarkup = {
                inline_keyboard: [[
                    { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
                    { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                ]]
            };

            await notifyAdmin(message, teleMsgId, replyMarkup);
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Submit API Error:', error);
        res.status(500).json({ success: false });
    }
}
