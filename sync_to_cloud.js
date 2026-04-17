import { query, execute } from './api/_db.js';

async function sync() {
    console.log('🚀 Starting Cloud Sync to Turso...');
    
    // 0. CREATE TABLES ON CLOUD (If not exists)
    console.log('🏗️ Initializing Schema on Turso...');
    const schema = [
        `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INTEGER, description TEXT, image TEXT)`,
        `CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, fullname TEXT, phone TEXT, email TEXT, zalo TEXT, registration_date DATETIME DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, product_id INTEGER, amount REAL, status TEXT DEFAULT 'pending', transaction_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS brand_voice (id INTEGER PRIMARY KEY AUTOINCREMENT, tone TEXT, common_phrases TEXT, avoid_words TEXT, target_audience TEXT)`,
        `CREATE TABLE IF NOT EXISTS business (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, contact TEXT, bank_info TEXT)`,
        `CREATE TABLE IF NOT EXISTS knowledge (id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT, content TEXT, tags TEXT)`
    ];
    
    for (const sql of schema) {
        await execute(sql);
    }
    
    const tables = ['products', 'customers', 'orders', 'brand_voice', 'business', 'knowledge'];
    
    for (const table of tables) {
        console.log(`📦 Syncing table: ${table}...`);
        
        // 1. Get local data
        // We force local mode by ensuring TURSO_URL is empty for this call if needed, 
        // but since we are running locally without ENV vars, it will default to local.
        const localData = await query(`SELECT * FROM ${table}`);
        
        if (localData.length === 0) {
            console.log(`  - No data in ${table}, skipping.`);
            continue;
        }

        // 2. Clear remote table first (Optional, but safer for sync)
        // await execute(`DELETE FROM ${table}`);

        // 3. Push to Turso
        // IMPORTANT: The execute function will use Turso if TURSO_URL/TOKEN are set.
        for (const row of localData) {
            const keys = Object.keys(row);
            const values = Object.values(row);
            const sql = `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
            await execute(sql, values);
        }
        
        console.log(`  - Successfully synced ${localData.length} rows.`);
    }
    
    console.log('✅ ALL DATA SYNCED TO TURSO!');
}

sync().catch(console.error);
