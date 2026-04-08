export default async function handler(req, res) {
    const { pw } = req.query;
    
    // Check password (Default is 'admin7day', use env for production)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin7day';
    
    if (pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlqXGgzQVl47NiiQ4A4Rmv09dCb1rEcipqK4MbyvrT7_2nLZE3403h49kArxO2bLKRyQ/exec';
        
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
            data: data.map(item => ({
                ...item,
                // Normalize keys to lowercase if needed
                timestamp: item.timestamp || item.ts,
                fullname: item.fullname || item.name,
                status: item.status || 'PENDING'
            }))
        });
    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
}
