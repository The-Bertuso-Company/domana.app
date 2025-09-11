require("dotenv").config();
const { Client } = require("pg");

(async () => {
  const url = process.env.DATABASE_URL || "";
  const ssl = url.includes("supabase.co") ? { rejectUnauthorized: false } : undefined;
  const db = new Client({ connectionString: url, ssl });
  await db.connect();

  const sql = `
  BEGIN;
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -- session-key helpers
  CREATE OR REPLACE FUNCTION enc(p_text text) RETURNS bytea AS $$
    SELECT CASE WHEN coalesce(current_setting('app.crypto_key', true),'') <> ''
           THEN pgp_sym_encrypt(p_text, current_setting('app.crypto_key', true))
           ELSE NULL::bytea END;
  $$ LANGUAGE sql STABLE;

  CREATE OR REPLACE FUNCTION dec(p_bytes bytea) RETURNS text AS $$
    SELECT CASE WHEN coalesce(current_setting('app.crypto_key', true),'') <> ''
           THEN pgp_sym_decrypt(p_bytes, current_setting('app.crypto_key', true))
           ELSE NULL::text END;
  $$ LANGUAGE sql STABLE;

  -- explicit-key helpers
  CREATE OR REPLACE FUNCTION enc_key(p_text text, p_key text) RETURNS bytea AS $$
    SELECT CASE WHEN coalesce(length(p_key),0) > 0 THEN pgp_sym_encrypt(p_text, p_key) ELSE NULL::bytea END;
  $$ LANGUAGE sql STABLE;

  CREATE OR REPLACE FUNCTION dec_key(p_bytes bytea, p_key text) RETURNS text AS $$
    SELECT CASE WHEN coalesce(length(p_key),0) > 0 THEN pgp_sym_decrypt(p_bytes, p_key) ELSE NULL::text END;
  $$ LANGUAGE sql STABLE;
  COMMIT;`;

  await db.query(sql);
  await db.query("SET app.crypto_key = $1", [process.env.APP_CRYPTO_KEY || ""]);
  const r = await db.query("SELECT dec(enc('ok')) AS a, dec_key(enc_key('ok',$1),$1) AS b", [process.env.APP_CRYPTO_KEY || ""]);
  console.log("crypto_ok:", r.rows[0]);
  await db.end();
})().catch(e => { console.error("apply_crypto error:", e.message); process.exit(1); });
