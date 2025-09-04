require("dotenv").config();
const { Client } = require("pg");
(async () => {
  const url = process.env.DATABASE_URL || "";
  const ssl = url.includes("supabase.co") ? { rejectUnauthorized: false } : undefined;
  const c = new Client({ connectionString: url, ssl });
  try {
    await c.connect();
    const r = await c.query("select current_user u, current_database() d");
    console.log("Connected:", r.rows[0]);
  } catch (e) {
    console.error("TOP:", e?.message || String(e));
    if (Array.isArray(e?.errors)) {
      console.error("--- inner ---");
      for (const er of e.errors) console.error("-", er?.message || String(er));
    }
  } finally { c.end().catch(()=>{}); }
})();
