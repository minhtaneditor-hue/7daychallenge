import { query } from './api/_lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        const products = await query('SELECT id, name, price FROM products WHERE id = 1');
        console.log(products);
    } catch (e) {
        console.error(e);
    }
}
run();
