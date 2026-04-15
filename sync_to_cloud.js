import { query, execute } from './api/_db.js';

async function sync() {
    console.log('🚀 Starting Cloud Sync to Turso...');
    
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
