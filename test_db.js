import { query } from "./api/_lib/db.js";
query("SELECT id, created_at, datetime('now') as now_utc FROM orders ORDER BY id DESC LIMIT 2").then(console.log);
