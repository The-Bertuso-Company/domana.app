require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function mkClient() {
  const conn = process.env.DATABASE_URL || "";
  const noVerify = process.env.PGSSL_NO_VERIFY === "1" || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";
  const needSSL  = /sslmode=require/i.test(conn) || noVerify;
  const ssl = needSSL ? (noVerify ? { rejectUnauthorized: false } : true) : undefined;
  return new Client({ connectionString: conn, ssl });
}

(async () => {
  const dir = path.join(process.cwd(),"db","migrations");
  const files = fs.readdirSync(dir).filter(f => /^\d+_.*\.sql$/i.test(f)).sort((a,b)=>a.localeCompare(b,"en"));
  const db = mkClient(); await db.connect();
  await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const applied = new Set((await db.query("SELECT version FROM schema_migrations")).rows.map(r=>r.version));
  for (const f of files) {
    if (applied.has(f)) { console.log("SKIP", f); continue; }
    const sql = fs.readFileSync(path.join(dir,f),"utf8");
    console.log("APPLY", f);
    const wrap = /^\s*begin\b/i.test(sql) ? sql : `BEGIN;\n${sql}\nCOMMIT;`;
    await db.query(wrap);
    await db.query("INSERT INTO schema_migrations(version) VALUES($1) ON CONFLICT DO NOTHING",[f]);
    console.log("OK   ", f);
  }
  try { await db.query("SELECT dec(enc('ok'))"); } catch {}
  await db.end();
})().catch(e => { console.error("migrate error:", e.message); process.exit(1); });

