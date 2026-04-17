import { RESEND_API_KEY, FROM_EMAIL } from './_lib/constants.js';
import templates from './_lib/emails-templates.js';

export default async function handler(req, res) {
    const testEmail = 'chutantrip+test@gmail.com';
    const testName = 'Minh Tấn (Test)';
    const results = [];

    const send = async (name, template) => {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: FROM_EMAIL,
                    to: testEmail,
                    subject: template.subject,
                    html: template.html
                })
            });
            const data = await response.json();
            results.push({ name, status: response.ok ? 'SUCCESS' : 'FAILED', data });
        } catch (e) {
            results.push({ name, status: 'ERROR', error: e.message });
        }
    };

    try {
        // Essential templates
        await send('Welcome', templates.welcome(testName));
        await send('Payment Follow-up', templates.paymentFollowUp(testName, '0922255861'));
        await send('Order Success', templates.orderSuccess(testName, '7 Ngày Lên Tay Phó Nháy', 199000));
        
        // 7 Day Sequence
        for (let i = 1; i <= 7; i++) {
            await send(`Day ${i}`, templates[`day${i}`](testName));
        }

        return res.status(200).json({ testEmail, results });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
