export default async function handler(req, res) {
    const { pw } = req.query;
    
    // Check password (Default is 'admin7day', use env for production)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin7day';
    
    if (pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';
        
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
                    const val = item[key];

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
                }

                // Defaults if mapping fails
                normalized.timestamp = normalized.timestamp || item.timestamp || item.ts;
                normalized.fullname = normalized.fullname || item.fullname || item.name || 'Ẩn danh';
                normalized.status = normalized.status || item.status || 'PENDING';

                return normalized;
            })
        });
    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
}
