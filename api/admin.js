export default async function handler(req, res) {
    const { pw } = req.query;
    
    // Check password (Default is 'admin7day', use env for production)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin7day';
    
    if (pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwswjN83gB61Hk4nRuOvLBh3I0PahQJlgZ-o6BIKR6Qv4NjerujSL6ZGLSP9J3iafNzZg/exec';
        
        // Fetch data from Google Sheet (doGet)
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Apps Script Fetch Failed:', errorText);
            throw new Error(`Google Apps Script returned ${response.status}`);
        }
        const data = await response.json();
        
        return res.status(200).json({ 
            success: true, 
            data: data.map(item => {
                const normalized = { ...item };
                
                // Intelligent Mapping Logic
                for (const key in item) {
                    const lowerKey = key.toLowerCase();
                    const val = String(item[key] || "").trim();
                    if (!val) continue;

                    // 1. Map by Header Keyword
                    if (lowerKey.includes('dấu thời gian') || lowerKey.includes('timestamp')) {
                        normalized.timestamp = val;
                    }
                    if (lowerKey.includes('họ và tên') || lowerKey.includes('name')) {
                        normalized.fullname = val;
                    }
                    if (lowerKey.includes('số điện thoại') || lowerKey.includes('phone') || lowerKey.includes('sđt')) {
                        normalized.phone = val;
                    }
                    if (lowerKey.includes('email') || lowerKey.includes('địa chỉ email')) {
                        normalized.email = val;
                    }
                    if (lowerKey.includes('status') || lowerKey.includes('trạng thái')) {
                        normalized.status = val;
                    }

                    // 2. Heuristic Overrides (If data is in the wrong column)
                    // If 'fullname' looks like a phone number, move it to phone
                    if (normalized.fullname && /^\d+$/.test(normalized.fullname.replace(/[\s\.\-\+]/g, '')) && normalized.fullname.length >= 8) {
                        if (!normalized.phone || normalized.phone.length < 5) {
                            normalized.phone = normalized.fullname;
                            normalized.fullname = item['địa chỉ email'] || item['name'] || 'Khách hàng';
                        }
                    }
                    
                    // If 'status' is missing but we discover 'PAID' or 'CANCELLED' in any field
                    if (val.toUpperCase() === 'PAID' || val.toUpperCase() === 'CANCELLED' || val.toUpperCase() === 'REMINDED') {
                        normalized.status = val.toUpperCase();
                    }
                }

                // Final Cleanups
                normalized.timestamp = normalized.timestamp || item.timestamp || item.ts;
                normalized.fullname = normalized.fullname || 'Ẩn danh';
                normalized.status = (normalized.status || 'PENDING').toUpperCase();

                return normalized;
            })
        });
    } catch (error) {
        // ... (existing code for default GET)
    }

    // XỬ LÝ CÁC HÀNH ĐỘNG POST (SỬA, XÓA, CONFIG)
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            const { action, pw: bodyPw } = body;
            
            if (bodyPw !== ADMIN_PASSWORD) {
                return res.status(401).json({ success: false });
            }

            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwDgqqxjsvFPLWfmJT4P0WmKXJC5ALwycTPgE5YoaKAayXi_zoCJ3vO3dgEdokNP5ZcdQ/exec';
            
            // Chuyển tiếp yêu cầu tới Google Apps Script
            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            return res.status(200).json(result);
            
        } catch (error) {
            console.error('Admin POST Error:', error);
            return res.status(500).json({ success: false });
        }
    }
}
