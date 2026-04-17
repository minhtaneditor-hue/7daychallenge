import { query } from '../lib/db.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Missing order ID' });
    }

    try {
        const orders = await query('SELECT status FROM orders WHERE id = ?', [id]);
        
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ 
            success: true, 
            status: orders[0].status 
        });
    } catch (err) {
        console.error('Order Status API Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
