import { ADMIN_PASSWORD, RESEND_API_KEY, FROM_EMAIL } from './_constants.js';
import { query, execute } from './_db.js';
import templates from './emails-templates.js';

export default async function handler(req, res) {
    const { pw } = req.query;
    const reqBody = req.method === 'POST' ? req.body : {};
    const providedPw = pw || reqBody.pw;

    if (providedPw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { action, type, payload } = req.method === 'POST' ? reqBody : req.query;

        if (req.method === 'GET' || action === 'get-data' || action === 'get-stats') {
            const products = await query('SELECT * FROM products');
            const customers = await query('SELECT * FROM customers ORDER BY registration_date DESC');
            const orders = await query('SELECT orders.*, customers.fullname as customer_name, products.name as product_name FROM orders JOIN customers ON orders.customer_id = customers.id JOIN products ON orders.product_id = products.id ORDER BY created_at DESC');
            
            // Calculate Stats
            const totalRevenue = orders.filter(o => o.status === 'success').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
            const stats = {
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: customers.length,
                pendingOrders: orders.filter(o => o.status === 'pending').length,
                lowStockProducts: products.filter(p => p.stock < 10).length
            };

            return res.status(200).json({ 
                success: true, 
                data: { products, customers, orders, stats } 
            });
        }

        if (req.method === 'POST') {
            const table = type + 's'; // e.g., product -> products
            
            if (action === 'create') {
                const keys = Object.keys(payload);
                const values = Object.values(payload);
                const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
                await execute(sql, values);
                
                // Special logic: if adding order, decrement stock
                if (type === 'order') {
                    await execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [payload.product_id]);
                }
            } else if (action === 'update') {
                const { id, ...data } = payload;
                const keys = Object.keys(data);
                const values = Object.values(data);
                const sql = `UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
                await execute(sql, [...values, id]);

                // TRIGGER EMAIL IF STATUS UPDATED TO SUCCESS
                if (type === 'order' && data.status === 'success') {
                    try {
                        const orderData = await query('SELECT orders.*, customers.fullname, customers.email, products.name as product_name FROM orders JOIN customers ON orders.customer_id = customers.id JOIN products ON orders.product_id = products.id WHERE orders.id = ?', [id]);
                        const order = orderData[0];
                        
                        if (order && order.email) {
                            const { subject, html } = templates.orderSuccess(order.fullname, order.product_name, order.amount);
                            await fetch('https://api.resend.com/emails', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${RESEND_API_KEY}`
                                },
                                body: JSON.stringify({ from: FROM_EMAIL, to: order.email, subject, html })
                            });
                        }
                    } catch (e) {
                        console.error('Admin Email Error:', e);
                    }
                }
            } else if (action === 'delete') {
                await execute(`DELETE FROM ${table} WHERE id = ?`, [payload.id]);
            }

            return res.status(200).json({ success: true });
        }

    } catch (err) {
        console.error('Admin DB Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
