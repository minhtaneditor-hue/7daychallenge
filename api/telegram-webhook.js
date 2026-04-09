export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const update = req.body;
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwswjN83gB61Hk4nRuOvLBh3I0PahQJlgZ-o6BIKR6Qv4NjerujSL6ZGLSP9J3iafNzZg/exec';

    try {
        if (update.callback_query) {
            const { id: callbackId, data, message } = update.callback_query;
            const [action, phone] = data.split('_');
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            if (action === 'approve') {
                // 1. Phản hồi Telegram ngay lập tức
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '⏳ Đang xác thực và gửi Email chào mừng...' })
                });

                try {
                    // 2. Lấy thông tin Email từ Google Sheet để gửi Mail
                    const gsRes = await fetch(GOOGLE_SHEET_URL);
                    const leads = await gsRes.json();
                    const student = leads.find(l => String(l.phone).replace(/\D/g,'').includes(phone.replace(/\D/g,'')));

                    if (student && student.email) {
                        // 3. GỬI EMAIL CHÀO MỪNG QUA RESEND
                        const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
                        await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${RESEND_API_KEY}`
                            },
                            body: JSON.stringify({
                                from: 'Minh Tấn <challenge@minhtanacademy.com>',
                                to: student.email,
                                subject: '🎉 Chúc mừng! Đơn đăng ký học của bạn đã được duyệt thành công!',
                                html: `
                                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                                        <h2 style="color: #000;">Chào mừng ${student.fullname || 'bạn'}!</h2>
                                        <p>Tôi đã nhận được thanh toán và chính thức xác nhận bạn tham gia <b>Thử thách 7 Ngày Lên Tay Phó Nháy</b>.</p>
                                        <p><strong>Bắt đầu từ đâu?</strong> Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                                        <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #000; margin: 20px 0;">
                                            Bạn sẽ nhận được bài học mỗi ngày qua Email này. Hãy kiểm tra cả hộp thư Spam nếu không thấy nhé.
                                        </div>
                                        <p>Chúc bạn có một hành trình đầy thú vị!</p>
                                        <p>-- <br><strong>Minh Tấn</strong></p>
                                    </div>
                                `
                            })
                        });
                    }

                    // 4. Cập nhật trạng thái PAID lên Google Sheet
                    await fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'update-status', phone: phone, status: 'PAID' })
                    });
                    
                    // 5. Gửi tin nhắn thông báo mới
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            chat_id: CHAT_ID, 
                            text: `✅ ĐÃ DUYỆT & GỬI EMAIL CHO KHÁCH: ${phone}\n📅 Thời gian: ${vnTime}` 
                        })
                    });

                    // 6. Cập nhật giao diện nút bấm
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            message_id: message.message_id,
                            text: message.text + `\n\n✅ TRẠNG THÁI: ĐÃ DUYỆT & GỬI MAIL`,
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "✅ THÀNH CÔNG - ĐÃ GỬI MAIL", callback_data: "none" }]
                                ]
                            }
                        })
                    });
                } catch (err) {
                    console.error('Approve Error:', err);
                }
            }
        }
        res.status(200).json({ ok: true });
    } catch (error) { res.status(200).json({ ok: true }); }
}
