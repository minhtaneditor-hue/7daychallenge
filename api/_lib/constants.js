// ALL SECRETS ARE NOW LOADED FROM ENVIRONMENT VARIABLES (.env)
// For local development, create a .env file based on .env.example

export const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || '';
export const LEAD_SPREADSHEET_ID = process.env.LEAD_SPREADSHEET_ID || '';
export const WAITLIST_SCRIPT_URL = process.env.WAITLIST_SCRIPT_URL || '';
export const WAITLIST_SPREADSHEET_ID = process.env.WAITLIST_SPREADSHEET_ID || '';

export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const CHAT_ID = process.env.CHAT_ID || '';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const FROM_EMAIL = process.env.FROM_EMAIL || '';

// BANK & SEPAY CONFIG
export const BANK_ID = process.env.BANK_ID || '';
export const ACCOUNT_NO = process.env.ACCOUNT_NO || '';
export const ACCOUNT_NAME = process.env.ACCOUNT_NAME || '';
export const SEPAY_API_KEY = process.env.SEPAY_API_KEY || ''; 

// TURSO CLOUD DB CONFIG
export const TURSO_URL = process.env.TURSO_URL || ''; 
export const TURSO_TOKEN = process.env.TURSO_TOKEN || '';
