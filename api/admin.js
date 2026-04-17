import { ADMIN_PASSWORD, RESEND_API_KEY, FROM_EMAIL } from './_lib/constants.js';
import { query, execute } from './_lib/db.js';
import templates from './_lib/emails-templates.js';

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
            console.log(`[Admin Action] ${action} on ${table}`, JSON.stringify(payload));

            // Whitelist columns to avoid SQL errors
            const tableColumns = {
                products: ['name', 'price', 'description', 'stock', 'code_prefix'],
                customers: ['fullname', 'phone', 'email', 'zalo'],
                orders: ['customer_id', 'product_id', 'amount', 'status']
            };

            const sanitizePayload = (p, cols) => {
                const cleaned = {};
                cols.forEach(col => {
                    if (p[col] !== undefined) {
                        // Convert to number if it looks like one and isn't a phone number
                        const val = p[col];
                        if (val !== '' && !isNaN(val) && col !== 'phone' && col !== 'zalo') {
                            cleaned[col] = Number(val);
                        } else {
                            cleaned[col] = val;
                        }
                    }
                });
                return cleaned;
            };
            
            if (action === 'create') {
                const data = sanitizePayload(payload, tableColumns[table]);
                const keys = Object.keys(data);
                const values = Object.values(data);
                const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
                console.log('[Executing SQL]', sql, values);
                const result = await execute(sql, values);
                
                if (type === 'order') {
                    await execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [data.product_id]);
                }
                return res.status(200).json({ success: true, id: result.id });
                
            } else if (action === 'update') {
                const { id, ...rest } = payload;
                const data = sanitizePayload(rest, tableColumns[table]);
                const keys = Object.keys(data);
                const values = Object.values(data);
                const sql = `UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
                console.log('[Executing SQL]', sql, [...values, id]);
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
                return res.status(200).json({ success: true });
                
            } else if (action === 'delete') {
                await execute(`DELETE FROM ${table} WHERE id = ?`, [payload.id]);
                return res.status(200).json({ success: true });
            }
        }

    } catch (err) {
        console.error('Admin DB Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
