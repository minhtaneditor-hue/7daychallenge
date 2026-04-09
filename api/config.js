export default async function handler(req, res) {
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwswjN83gB61Hk4nRuOvLBh3I0PahQJlgZ-o6BIKR6Qv4NjerujSL6ZGLSP9J3iafNzZg/exec';
    
    try {
        const response = await fetch(`${GOOGLE_SHEET_URL}?action=get-config`);
        const data = await response.json();
        
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); 
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
}
