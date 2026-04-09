export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const update = req.body;
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';

    try {
        if (update.callback_query) {
            const { id, data, message } = update.callback_query;
            const [action, phone] = data.split('_');
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: id, text: '⏳ Đang xử lý...' }) });

            if (action === 'approve') {
                try {
                    await fetch(GOOGLE_SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-status', phone: phone, status: 'PAID' }) });
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: CHAT_ID, text: `✅ ĐÃ DUYỆT: ${phone}\n📅 ${vnTime}` }) });
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: CHAT_ID, message_id: message.message_id, text: message.text + `\n\n✅ TRẠNG THÁI: ĐÃ DUYỆT lúc ${vnTime}` }) });
                } catch (e) { console.error(e); }
            }
        }
        res.status(200).json({ ok: true });
    } catch (error) { res.status(200).json({ ok: true }); }
}
