export default async function handler(req, res) {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzY6Y0FzxnoyZUzeqmnWbM2MFqlCJEEVnlFVAW_ewZTYbiwA7EXVicOvms8k_MZ0DO9EA/exec';
    
    try {
        const response = await fetch(`${GOOGLE_SHEET_URL}?action=get-config`);
        const data = await response.json();
        
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); 
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
}
