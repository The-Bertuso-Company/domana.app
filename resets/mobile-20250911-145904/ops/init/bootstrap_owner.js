require("dotenv").config();
const { Client } = require("pg");

function mkClient() {
  const conn = process.env.DATABASE_URL || "";
  const noVerify = process.env.PGSSL_NO_VERIFY === "1" || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";
  const needSSL  = /sslmode=require/i.test(conn) || noVerify;
  const ssl = needSSL ? (noVerify ? { rejectUnauthorized: false } : true) : undefined;
  return new Client({ connectionString: conn, ssl });
}
(async ()=>{
  const db = mkClient(); await db.connect();
  const r = await db.query("SELECT COUNT(*)::int AS n FROM owner");
  if ((r.rows[0]?.n || 0) === 0) {
    await db.query(`INSERT INTO owner (id, full_name_or_entity, contact_email, contact_phone, created_at, updated_at)
                    VALUES ('OWNER_DEV001','Dev Owner','dev.owner@example.com','+639171234567', now(), now())
                    ON CONFLICT (id) DO NOTHING`);
    console.log("Inserted OWNER_DEV001");
  } else {
    console.log("Owners present:", r.rows[0].n);
  }
  await db.end();
})().catch(e => { console.error("bootstrap error:", e.message); process.exit(1); });

