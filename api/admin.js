import { ADMIN_PASSWORD } from './_constants.js';
import { query, execute } from './_db.js';

export default async function handler(req, res) {
    const { pw } = req.query;
    const reqBody = req.method === 'POST' ? req.body : {};
    const providedPw = pw || reqBody.pw;

    if (providedPw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { action, type, payload } = req.method === 'POST' ? reqBody : req.query;

        if (req.method === 'GET' || action === 'get-data') {
            const products = query('SELECT * FROM products');
            const customers = query('SELECT * FROM customers ORDER BY registration_date DESC');
            const orders = query('SELECT orders.*, customers.fullname as customer_name, products.name as product_name FROM orders JOIN customers ON orders.customer_id = customers.id JOIN products ON orders.product_id = products.id ORDER BY created_at DESC');
            
            return res.status(200).json({ 
                success: true, 
                data: { products, customers, orders } 
            });
        }

        if (req.method === 'POST') {
            const table = type + 's'; // e.g., product -> products
            
            if (action === 'create') {
                const keys = Object.keys(payload);
                const values = Object.values(payload);
                const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
                execute(sql, values);
                
                // Special logic: if adding order, decrement stock
                if (type === 'order') {
                    execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [payload.product_id]);
                }
            } else if (action === 'update') {
                const { id, ...data } = payload;
                const keys = Object.keys(data);
                const values = Object.values(data);
                const sql = `UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
                execute(sql, [...values, id]);
            } else if (action === 'delete') {
                execute(`DELETE FROM ${table} WHERE id = ?`, [payload.id]);
            }

            return res.status(200).json({ success: true });
        }

    } catch (err) {
        console.error('Admin DB Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
