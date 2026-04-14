import { GOOGLE_SHEET_URL, RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import templates from './emails-templates.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = req.body;
        const { amount, content, referenceNum, transferType } = body;

        if (transferType !== 'In') {
            return res.status(200).json({ success: true, message: 'Not inbound' });
        }

        // Extract phone number from content (Format: 7Day 09xxxxxxxx)
        const phoneMatch = content.match(/0\d{9,10}/);
        if (!phoneMatch) return res.status(200).json({ success: true, message: 'No phone matched' });
        const phone = phoneMatch[0];

        // 1. FETCH ALL DATA TO FIND CUSTOMER
        const sheetRes = await fetch(`${GOOGLE_SHEET_URL}?action=get-data`);
        const { customers, products } = await sheetRes.json();

        // 2. FIND CUSTOMER
        const customer = customers.find(c => String(c.phone) === String(phone));
        if (!customer) return res.status(200).json({ success: true, message: 'Customer not found' });

        // 3. CREATE ORDER IN GOOGLE SHEETS
        // Default to the first product if not specified (Standard behavior for Day 10)
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

        // 4. TRIGGER WELCOME EMAIL (Day 0)
        try {
            const { subject, html } = templates.day0(customer.fullname);
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: FROM_EMAIL,
                    to: customer.email,
                    subject: subject,
                    html: html
                })
            });
        } catch (e) { console.error('Email error:', e); }

        return res.status(200).json({ success: true, message: 'Sheet updated & Email sent' });

    } catch (error) {
        console.error('Webhook Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
}
