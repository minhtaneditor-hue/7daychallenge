import { RESEND_API_KEY, FROM_EMAIL } from './api/_constants.js';

async function testEmail() {
    const to = 'chutantrip@gmail.com';
    const subject = 'Test Email from Minh Tấn Academy';
    const html = '<h1>Hello!</h1><p>Đây là email test để kiểm tra hệ thống Resend.</p>';

    console.log('Using API Key:', RESEND_API_KEY.substring(0, 10) + '...');
    console.log('Sending from:', FROM_EMAIL);

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: to,
                subject: subject,
                html: html
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('✅ Email sent successfully! ID:', data.id);
        } else {
            console.error('❌ Resend Error:', data);
        }
    } catch (e) {
        console.error('❌ Network Error:', e.message);
    }
}

testEmail();
