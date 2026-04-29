import { BOT_TOKEN, CHAT_ID, RESEND_API_KEY, FROM_EMAIL } from './_lib/constants.js';
import templates from './_lib/emails-templates.js';
import { query, execute } from './_lib/db.js';

export default async (req, res) => {
    try {
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

        const body = req.body;
        if (!body) return res.status(400).json({ error: 'No body' });
        
        const { action, teleMsgId, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD / WAITLIST -> CUSTOMER IN CRM)
        if (!action || action === 'submit-lead' || action === 'submit-waitlist') {
            const firstMsg = await notifyAdmin(`🔔 <b>CÓ KHÁCH MỚI (${action || 'lead'})!</b>\n⏳ Đang lưu vào CRM...`);
            const msgId = firstMsg?.result?.message_id;

            let dbStatus = "\n📊 CRM: ✅ Đã lưu";
            let orderId = null;
            let product = null;

            try {
                // 1. Lưu Customer (Xử lý trùng SĐT bằng ON CONFLICT)
                const custSql = `
                    INSERT INTO customers (fullname, phone, email, zalo) 
                    VALUES (?, ?, ?, ?) 
                    ON CONFLICT(phone) DO UPDATE SET 
                        fullname = excluded.fullname,
                        email = excluded.email,
                        zalo = excluded.zalo
                `;
                await execute(custSql, [data.name || data.fullname, data.phone, data.email || '', data.zalo || '']);
                
                // Lấy ID của customer vừa tạo/cập nhật
                const custRows = await query('SELECT id FROM customers WHERE phone = ?', [data.phone]);
                const customerId = custRows[0].id;

                // 2. Lấy thông tin sản phẩm
                const selProductId = data.productId || 5;
                const products = await query('SELECT * FROM products WHERE id = ?', [selProductId]);
                if (products && products[0]) {
                    product = products[0];
                } else {
                    throw new Error('Product not found');
                }
                
                // 2. Tạo Order
                const status = product.price == 0 ? 'success' : 'pending';
                const orderSql = `INSERT INTO orders (customer_id, product_id, amount, status) VALUES (?, ?, ?, ?)`;
                const orderRes = await execute(orderSql, [customerId, product.id, product.price, status]);
                orderId = orderRes.id;

                if (msgId) {
                    await notifyAdmin(`👤 <b>KHÁCH ĐĂNG KÝ MỚI</b>\n👤: ${data.name || data.fullname}\n📦: ${product.name}\n💵: ${product.price.toLocaleString()}đ\n📞: ${data.phone}${dbStatus}${orderId ? `\n🆔 Đơn hàng: #${orderId}` : ''}\n🔔 Trạng thái: ${status === 'success' ? '✅ TỰ ĐỘNG KÍCH HOẠT' : '⏳ CHỜ THANH TOÁN'}`, msgId);
                }

            } catch (err) {
                console.error('DB Insert Error:', err);
                dbStatus = "\n📊 CRM: ❌ Lỗi ghi (Cloud)";
            }

            let emailError = null;
            if (data.email) {
                try {
                    const email = data.email;
                    const name = data.name || data.fullname;
                    const isTestMode = email.includes('+test');

                    const sendEmail = async (templateName) => {
                        const template = templates[templateName](name);
                        const body = {
                            from: FROM_EMAIL,
                            to: email,
                            subject: template.subject,
                            html: template.html
                        };

                        const response = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${RESEND_API_KEY}`
                            },
                            body: JSON.stringify(body)
                        });

                        const resData = await response.json();
                        return resData;
                    };

                    if (product.id == 6) {
                        // TRƯỜNG HỢP EBOOK: Gửi mail trả kết quả ngay
                        await sendEmail('ebookDelivery');
                    } else {
                        // TRƯỜNG HỢP THỬ THÁCH: Gửi welcome và hẹn giờ nhắc thanh toán
                        await sendEmail('welcome');

                        const delayMinutes = 30;
                        const scheduledDate = new Date();
                        scheduledDate.setMinutes(scheduledDate.getMinutes() + delayMinutes);
                        
                        const templateRemind = templates.paymentFollowUp(name, data.phone);
                        await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${RESEND_API_KEY}`
                            },
                            body: JSON.stringify({
                                from: FROM_EMAIL,
                                to: email,
                                subject: templateRemind.subject,
                                html: templateRemind.html,
                                scheduled_at: scheduledDate.toISOString()
                            })
                        });
                    }
                } catch (err) {
                    console.error('Email Sequence Error:', err.message);
                    emailError = err.message;
                    await notifyAdmin(`❌ <b>LỖI GỬI EMAIL:</b>\n${err.message}`);
                }
            }

            const finalAmount = (product && product.price !== undefined) ? parseInt(product.price) : 199000;

            return res.status(200).json({ 
                success: true, 
                teleMsgId: msgId, 
                orderId: orderId,
                amount: finalAmount,
                productName: product.name,
                transferContent: `${product.code_prefix || '7DAY'} ${data.phone}`,
                emailError: emailError
            });
        }

        // 2. CONFIRM PAYMENT (NOTIFY FOR MANUAL CHECK)
        if (action === 'confirm-payment') {
            const orderAmount = data.amount || 199000;
            const message = `💰 <b>XÁC NHẬN CHUYỂN TIỀN!</b>\n` +
                          `━━━━━━━━━━━━━━━\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: ${parseInt(orderAmount).toLocaleString()}đ\n\n` +
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
        console.error('Submit API Fatal Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            stack: error.stack,
            context: 'Submit API Diagnostic Block'
        });
    }
}
