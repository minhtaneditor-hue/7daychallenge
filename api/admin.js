import { GOOGLE_SHEET_URL, ADMIN_PASSWORD } from './_constants.js';

export default async function handler(req, res) {
    const { pw } = req.query;
    const reqBody = req.method === 'POST' ? req.body : {};
    const providedPw = pw || reqBody.pw;

    if (providedPw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // --- DATA ACTIONS (Forward to Google Sheets via GET) ---
        const url = `${GOOGLE_SHEET_URL}?action=${action || 'get-data'}&type=${type || ''}&payload=${encodeURIComponent(JSON.stringify(payload || {}))}`;
        const sheetRes = await fetch(url);
        const result = await sheetRes.json();
        return res.status(200).json(result);

    } catch (err) {
        console.error('Admin Proxy Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
