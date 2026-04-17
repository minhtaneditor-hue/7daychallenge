import { execSync } from 'child_process';
import path from 'path';
import { TURSO_URL, TURSO_TOKEN } from './constants.js';

const DB_PATH = path.join(process.cwd(), 'brain.db');
const SQLITE_PATH = '/usr/bin/sqlite3';

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
    // 🔋 CLOUD MODE (TURSO)
    if (TURSO_URL && TURSO_TOKEN) {
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

    // 💻 LOCAL MODE
    try {
        let formattedSql = sql;
        for (const param of params) {
            const val = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
            formattedSql = formattedSql.replace('?', val);
        }
        const cmd = `"${SQLITE_PATH}" -json "${DB_PATH}" "${formattedSql.replace(/"/g, '\\"')}"`;
        const output = execSync(cmd).toString();
        return output ? JSON.parse(output) : [];
    } catch (err) {
        console.error('Local Query Error:', err);
        throw err;
    }
}

export async function execute(sql, params = []) {
    // 🔋 CLOUD MODE (TURSO)
    if (TURSO_URL && TURSO_TOKEN) {
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

    // 💻 LOCAL MODE
    try {
        let formattedSql = sql;
        for (const param of params) {
            const val = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
            formattedSql = formattedSql.replace('?', val);
        }
        const cmd = `"${SQLITE_PATH}" "${DB_PATH}" "${formattedSql.replace(/"/g, '\\"')}; SELECT last_insert_rowid() as id;"`;
        const output = execSync(cmd).toString();
        const lastId = output.trim();
        return { success: true, id: lastId };
    } catch (err) {
        console.error('Local Execute Error:', err.message);
        throw err;
    }
}
