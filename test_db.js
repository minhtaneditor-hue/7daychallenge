import { query } from './api/_db.js';

async function test() {
    try {
        const result = await query('SELECT * FROM products');
        console.log('Database Connection Success:', result);
    } catch (err) {
        console.error('Database Connection Failed:', err);
    }
}

test();
