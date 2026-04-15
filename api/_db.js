import { execSync } from 'child_process';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'brain.db');
const SQLITE_PATH = '/usr/bin/sqlite3';

export function query(sql, params = []) {
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
        console.error('DB Query Error:', err);
        throw err;
    }
}

export function execute(sql, params = []) {
    try {
        let formattedSql = sql;
        for (const param of params) {
            const val = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
            formattedSql = formattedSql.replace('?', val);
        }

        const cmd = `"${SQLITE_PATH}" "${DB_PATH}" "${formattedSql.replace(/"/g, '\\"')}"`;
        execSync(cmd);
        return { success: true };
    } catch (err) {
        console.error('DB Execute Error:', err.message);
        throw err;
    }
}
