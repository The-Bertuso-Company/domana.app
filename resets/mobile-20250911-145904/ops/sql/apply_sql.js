require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
(async () => {
  const url = process.env.DATABASE_URL || process.argv[2];
  if (!url) { console.error("No DATABASE_URL found"); process.exit(1); }
  // SNI + no-verify for Supabase over TLS
  const hostname = new URL(url.replace(/^postgres(ql)?:\/\//, "https://")).hostname;
  const ssl = url.includes("supabase.co") ? { rejectUnauthorized: false, servername: hostname } : undefined;

  const sql = fs.readFileSync("ops/sql/phase4.sql","utf8");
  const db = new Client({ connectionString: url, ssl });
  try {
    await db.connect();
    await db.query(sql);
    const r = await db.query("select dec(enc('ok'))='ok' as crypto_ok");
    console.log("Applied. crypto_ok =", r.rows[0]?.crypto_ok);
  } catch (e) {
    console.error("apply_sql error:", e.message);
    process.exit(1);
  } finally {
    await db.end().catch(()=>{});
  }
})();