import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { BANK_ID, ACCOUNT_NO, RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import templates from './emails-templates.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;
        console.log('SePay Webhook Received:', body);

        // SePay sends data in the body
        const { amount, content, referenceNum, transferType, gateway } = body;

        if (transferType !== 'In') {
            return res.status(200).json({ success: true, message: 'Not an inbound transaction' });
        }

        // Extract phone number from content (Format: 7Day 09xxxxxxxx)
        const phoneMatch = content.match(/0\d{9,10}/);
        if (!phoneMatch) {
            console.error('No phone number found in transaction content:', content);
            return res.status(200).json({ success: true, message: 'No phone matched' });
        }
        const phone = phoneMatch[0];

        // 1. OPEN DATABASE
        const db = await open({
            filename: './brain.db',
            driver: sqlite3.Database
        });

        // 2. FIND CUSTOMER & PENDING ORDER
        const customer = await db.get('SELECT id, fullname, email FROM customers WHERE phone = ?', [phone]);
        
        if (!customer) {
            console.error('No customer found for phone:', phone);
            await db.close();
            return res.status(200).json({ success: true, message: 'No customer found' });
        }

        // 3. UPDATE ORDER & CUSTOMER STATUS
        // We'll create an order if it doesn't exist, or update a pending one
        await db.run(
            'INSERT INTO orders (customer_id, amount, status, transaction_id) VALUES (?, ?, ?, ?)',
            [customer.id, amount, 'success', referenceNum]
        );

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
        } catch (emailErr) {
            console.error('Email Sending Error:', emailErr);
        }

        await db.close();
        return res.status(200).json({ success: true, message: 'Payment processed and email sent' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
