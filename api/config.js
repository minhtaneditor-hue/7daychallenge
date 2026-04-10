export default async function handler(req, res) {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxbChrkAVLRFvQ128Qde_o123wYGBwHN-zPrd34Cm2k_QpiqtlgZNpM5acf9Yy2YCjCgg/exec';
    
    try {
        const response = await fetch(`${GOOGLE_SHEET_URL}?action=get-config`);
        const data = await response.json();
        
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate'); 
        return res.status(200).json(data);
    } catch (error) {
        console.error('Config Fetch Error:', error);
        return res.status(500).json({ error: 'Failed to fetch config' });
    }
}
