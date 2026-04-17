import { query } from './_db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Fetch all products that have stock > 0
        const products = await query('SELECT id, name, price, stock FROM products WHERE stock > 0 ORDER BY id ASC');
        
        return res.status(200).json({ 
            success: true, 
            products 
        });
    } catch (err) {
        console.error('Products API Error:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
