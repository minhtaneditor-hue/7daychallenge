import { TURSO_URL, TURSO_TOKEN } from './constants.js';

// 🛠️ HELPER: MAP TURSO RESPONSE TO ARRAY OF OBJECTS
function mapTurso(data) {
    if (!data.results?.[0]?.response?.result) return [];
    const { cols, rows } = data.results[0].response.result;
    return rows.map(row => {
        const obj = {};
        cols.forEach((col, i) => {
            // Turso values are wrapped: { value: '...', type: '...' }
            obj[col.name] = row[i].value;
        });
        return obj;
    });
}

export async function query(sql, params = []) {
    // 🔋 CLOUD MODE (TURSO) ONLY
    if (!TURSO_URL || !TURSO_TOKEN) {
        throw new Error('Database configuration missing (TURSO_URL/TOKEN)');
    }
    
    try {
        const url = TURSO_URL.replace('libsql://', 'https://');
        const res = await fetch(`${url}/v2/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TURSO_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    { type: 'execute', stmt: { sql, args: params.map(p => ({ type: typeof p === 'number' ? 'integer' : 'text', value: String(p) })) } },
                    { type: 'close' }
                ]
            })
        });
        if (!res.ok) throw new Error(`Turso HTTP Error: ${res.status}`);
        const data = await res.json();
        
        // Check for errors in results
        if (data.results?.[0]?.type === 'error') {
            throw new Error(data.results[0].error.message);
        }

        return mapTurso(data);
    } catch (err) {
        console.error('Turso Query Error:', err);
        throw err;
    }
}

export async function execute(sql, params = []) {
    // 🔋 CLOUD MODE (TURSO) ONLY
    if (!TURSO_URL || !TURSO_TOKEN) {
        throw new Error('Database configuration missing (TURSO_URL/TOKEN)');
    }

    try {
        const url = TURSO_URL.replace('libsql://', 'https://');
        const res = await fetch(`${url}/v2/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TURSO_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    { type: 'execute', stmt: { sql, args: params.map(p => ({ type: typeof p === 'number' ? 'integer' : 'text', value: String(p) })) } },
                    { type: 'execute', stmt: { sql: 'SELECT last_insert_rowid() as id' } },
                    { type: 'close' }
                ]
            })
        });
        if (!res.ok) throw new Error(`Turso HTTP Error: ${res.status}`);
        const data = await res.json();
        
        // Check for errors in results
        if (data.results?.[0]?.type === 'error') {
            throw new Error(data.results[0].error.message);
        }

        const lastId = data.results?.[1]?.response?.result?.rows?.[0]?.[0]?.value;
        return { success: true, id: lastId };
    } catch (err) {
        console.error('Turso Execute Error:', err);
        throw err;
    }
}
