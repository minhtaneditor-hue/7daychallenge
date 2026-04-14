import { GOOGLE_SHEET_URL, ADMIN_PASSWORD } from './_constants.js';

export default async function handler(req, res) {
    const { pw } = req.query;
    const reqBody = req.method === 'POST' ? req.body : {};
    const providedPw = pw || reqBody.pw;

    if (providedPw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // --- GET DATA ---
        if (req.method === 'GET') {
            const sheetRes = await fetch(`${GOOGLE_SHEET_URL}?action=get-data`);
            const data = await sheetRes.json();
            return res.status(200).json({ success: true, data });
        }

        // --- POST ACTIONS (Forward to Google Sheets) ---
        if (req.method === 'POST') {
            const sheetRes = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });
            const result = await sheetRes.json();
            return res.status(200).json(result);
        }

    } catch (err) {
        console.error('Admin Proxy Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
