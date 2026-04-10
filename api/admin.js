import { GOOGLE_SHEET_URL, ADMIN_PASSWORD } from './_constants.js';

export default async function handler(req, res) {
    const { pw } = req.query;
    
    // XỬ LÝ GET (LẤY DỮ LIỆU)
    if (req.method === 'GET') {
        if (pw !== ADMIN_PASSWORD) return res.status(401).json({ success: false });
        try {
            const response = await fetch(GOOGLE_SHEET_URL);
            const data = await response.json();
            const normalizedData = data.map(item => ({
                timestamp: item.timestamp || 'N/A',
                fullname: item.fullname || 'Ẩn danh',
                email: item.email || 'N/A',
                phone: item.phone || 'N/A',
                status: (item.status || 'LEAD').toUpperCase()
            }));
            return res.status(200).json({ success: true, data: normalizedData });
        } catch (error) {
            return res.status(500).json({ success: false });
        }
    }

    // XỬ LÝ POST (SỬA, XÓA, CMS) - ĐÃ FIX LỖI PARSE BODY
    if (req.method === 'POST') {
        try {
            let body = req.body;
            if (typeof body === 'string') {
                try { body = JSON.parse(body); } catch(e) {}
            }
            
            const admin_pw = body.pw || pw; // Lấy pass từ body hoặc query
            if (admin_pw !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Invalid Password' });

            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await response.json();

            // KÍCH HOẠT EMAIL CHÀO MỪNG NẾU ĐƯỢC CHUYỂN SANG PAID
            if (result.success && (body.action === 'update-student' || body.action === 'update-status') && body.status === 'PAID') {
                try {
                    const protocol = req.headers['x-forwarded-proto'] || 'http';
                    const host = req.headers.host;
                    await fetch(`${protocol}://${host}/api/emails`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            action: 'welcome', 
                            fullname: body.fullname, 
                            email: body.email, 
                            phone: body.phone 
                        })
                    });
                } catch (e) { console.error('Email trigger error:', e); }
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Admin POST Error:', error);
            return res.status(500).json({ success: false });
        }
    }
}
