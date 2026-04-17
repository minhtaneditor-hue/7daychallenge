// ALL SECRETS ARE NOW LOADED FROM ENVIRONMENT VARIABLES (.env)
// For local development, create a .env file based on .env.example

export const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || '';
export const LEAD_SPREADSHEET_ID = process.env.LEAD_SPREADSHEET_ID || '';
export const WAITLIST_SCRIPT_URL = process.env.WAITLIST_SCRIPT_URL || '';
export const WAITLIST_SPREADSHEET_ID = process.env.WAITLIST_SPREADSHEET_ID || '';

import fs from 'fs';
import path from 'path';

function getSecret(envKey, fileName) {
    if (process.env[envKey]) return process.env[envKey];
    try {
        const filePath = path.join(process.cwd(), fileName);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8').trim();
        }
    } catch (e) {}
    return '';
}

export const BOT_TOKEN = getSecret('BOT_TOKEN', 'telegram_config.txt');
export const CHAT_ID = getSecret('CHAT_ID', 'chat_id.txt') || '7384174497';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin7day';

export const RESEND_API_KEY = getSecret('RESEND_API_KEY', 'resend_config.txt') || 're_EWSXG3oC_GXTzJez9ihbAkXVYynxv3jp9';
export const FROM_EMAIL = process.env.FROM_EMAIL || 'Minh Tấn Academy <customer@minhtanacademy.com>';

// BANK & SEPAY CONFIG
export const BANK_ID = process.env.BANK_ID || 'ACB';
export const ACCOUNT_NO = process.env.ACCOUNT_NO || '221896279';
export const ACCOUNT_NAME = process.env.ACCOUNT_NAME || 'LE MINH TAN';
export const SEPAY_API_KEY = process.env.SEPAY_API_KEY || ''; 

// TURSO CLOUD DB CONFIG
export const TURSO_URL = process.env.TURSO_URL || 'libsql://database-chestnut-jacket-vercel-icfg-hj6h16ghbwbnbfoibck4ype8.aws-us-east-1.turso.io'; 
export const TURSO_TOKEN = process.env.TURSO_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzYyMzU4NTQsImlkIjoiMDE5ZDhmZTgtMzgwMS03OWYwLWJkZmYtY2I1N2FhMTU1MDlmIiwicmlkIjoiNGVmZDlkMzAtMDMxMi00NTZmLThlNWItOTU1YzNmMmFmNDA4In0.8DWOpoBhvZ279KxJuyozJH0RkigrfJG7g3YmQwJqC_iivTp3cftPuelcJLeXtCKLFmlFkFOzGJpMDn5BOo0QBA';
