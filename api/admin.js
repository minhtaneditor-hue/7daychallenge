import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    const { action, pw } = req.query;
    
    // We expect the password in query or body
    const reqBody = req.method === 'POST' ? req.body : {};
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin7day';
    const providedPw = pw || reqBody.pw;

    if (providedPw !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const db = await open({
        filename: './brain.db',
        driver: sqlite3.Database
    });

    try {
        // --- GET DATA ---
        if (req.method === 'GET') {
            const products = await db.all('SELECT * FROM products ORDER BY id DESC');
            const customers = await db.all('SELECT * FROM customers ORDER BY id DESC');
            const orders = await db.all(`
                SELECT o.*, c.fullname as customer_name, p.name as product_name 
                FROM orders o
                LEFT JOIN customers c ON o.customer_id = c.id
                LEFT JOIN products p ON o.product_id = p.id
                ORDER BY o.id DESC
            `);

            return res.status(200).json({
                success: true,
                data: { products, customers, orders }
            });
        }

        // --- POST ACTIONS (CRUD) ---
        if (req.method === 'POST') {
            const { action, type, payload } = reqBody;

            // 1. PRODUCTS CRUD
            if (type === 'product') {
                if (action === 'create') {
                    await db.run('INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)', 
                        [payload.name, payload.price, payload.description, payload.stock]);
                } else if (action === 'update') {
                    await db.run('UPDATE products SET name=?, price=?, description=?, stock=? WHERE id=?', 
                        [payload.name, payload.price, payload.description, payload.stock, payload.id]);
                } else if (action === 'delete') {
                    await db.run('DELETE FROM products WHERE id=?', [payload.id]);
                }
            }

            // 2. CUSTOMERS CRUD
            else if (type === 'customer') {
                if (action === 'create') {
                    await db.run('INSERT INTO customers (fullname, phone, email, zalo) VALUES (?, ?, ?, ?)', 
                        [payload.fullname, payload.phone, payload.email, payload.zalo]);
                } else if (action === 'update') {
                    await db.run('UPDATE customers SET fullname=?, phone=?, email=?, zalo=? WHERE id=?', 
                        [payload.fullname, payload.phone, payload.email, payload.zalo, payload.id]);
                } else if (action === 'delete') {
                    await db.run('DELETE FROM customers WHERE id=?', [payload.id]);
                    await db.run('DELETE FROM orders WHERE customer_id=?', [payload.id]);
                }
            }

            // 3. ORDERS CRUD
            else if (type === 'order') {
                if (action === 'create') {
                    // Logic from SOP: Auto-decrement stock
                    await db.run('BEGIN TRANSACTION');
                    try {
                        await db.run('INSERT INTO orders (customer_id, product_id, amount, status) VALUES (?, ?, ?, ?)', 
                            [payload.customer_id, payload.product_id, payload.amount, payload.status || 'pending']);
                        
                        if (payload.status === 'success') {
                            await db.run('UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0', [payload.product_id]);
                        }
                        await db.run('COMMIT');
                    } catch (e) {
                        await db.run('ROLLBACK');
                        throw e;
                    }
                } else if (action === 'update') {
                    // Handle transition to 'success' to trigger stock reduction if not already done
                    const oldOrder = await db.get('SELECT status, product_id FROM orders WHERE id = ?', [payload.id]);
                    await db.run('UPDATE orders SET status=?, amount=? WHERE id=?', [payload.status, payload.amount, payload.id]);
                    
                    if (oldOrder.status !== 'success' && payload.status === 'success') {
                        await db.run('UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0', [oldOrder.product_id]);
                    }
                } else if (action === 'delete') {
                    await db.run('DELETE FROM orders WHERE id=?', [payload.id]);
                }
            }

            return res.status(200).json({ success: true });
        }

    } catch (err) {
        console.error('Admin API Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        await db.close();
    }
}
