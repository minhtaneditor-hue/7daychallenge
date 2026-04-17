import { RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import templates from './emails-templates.js';

export default async function handler(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
        const template = templates.waitlistWelcome('Test User');
        const body = {
            from: FROM_EMAIL,
            to: email,
            subject: '[Debug] ' + template.subject,
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
        return res.status(response.status).json({
            status: response.status,
            resendResponse: resData,
            config: {
                from: FROM_EMAIL,
                to: email,
                hasApiKey: !!RESEND_API_KEY
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
