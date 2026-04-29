const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/var/lib/docker/volumes/goclaw_goclaw-workspace/_data/db.sqlite3', sqlite3.OPEN_READONLY, (err) => { if (err) console.error(err); });
db.all("SELECT agent, tool, args FROM message_tool_calls ORDER BY id DESC LIMIT 5", (err, rows) => { if (err) console.error(err); else console.log(JSON.stringify(rows, null, 2)); db.close(); });
