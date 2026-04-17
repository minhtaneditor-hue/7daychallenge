import { query, execute } from './_lib/db.js';

export default async function handler(req, res) {
    try {
        console.log("Starting Migration...");
        
        // 1. Add column if not exists
        const columns = await query("PRAGMA table_info(products);");
        if (!columns.some(c => c.name === 'code_prefix')) {
            await execute("ALTER TABLE products ADD COLUMN code_prefix TEXT DEFAULT '7DAY';");
        }

        // 2. Set prefixes
        await execute("UPDATE products SET code_prefix = '7NGAY' WHERE id = 5;"); // 7daychallenge
        await execute("UPDATE products SET code_prefix = 'EB' WHERE id = 6;");    // Ebook
        await execute("UPDATE products SET code_prefix = 'SOP' WHERE id = 4;");   // Test SOP
        
        const products = await query("SELECT id, name, code_prefix FROM products;");
        
        return res.status(200).json({ 
            success: true, 
            message: "Migration completed", 
            products 
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
