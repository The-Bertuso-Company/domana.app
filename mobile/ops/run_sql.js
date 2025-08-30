require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

(async () => {
  try {
    const file = process.argv[2];
    if (!file) { console.error("usage: node ops/run_sql.js <file.sql>"); process.exit(1); }
    const sql = fs.readFileSync(file, "utf8");
    const url = process.env.DATABASE_URL;
    if (!url) { console.error("DATABASE_URL missing in .env"); process.exit(1); }
    const ssl = { rejectUnauthorized: false }; // Supabase: allow
    const db = new Client({ connectionString: url, ssl });
    await db.connect();
    await db.query(sql);
    console.log("Applied:", file);

    const key = process.env.APP_CRYPTO_KEY || "";
    if (key) await db.query("SET app.crypto_key = $1", [key]);
    const r = await db.query("SELECT dec(enc('ok'))='ok' AS ok");
    console.log("Roundtrip ok:", r.rows?.[0]?.ok === true);
    await db.end();
  } catch (e) {
    console.error("apply error:", e.message);
    process.exit(1);
  }
})();
