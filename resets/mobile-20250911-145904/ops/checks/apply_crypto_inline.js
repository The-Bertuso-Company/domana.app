require("dotenv").config();
const { Client } = require("pg");

const SQL = `
-- Supabase: ensure pgcrypto exists in the "extensions" schema
create extension if not exists pgcrypto with schema extensions;

-- Crypto helpers using session GUC app.crypto_key (idempotent)
create or replace function app_enc(p_text text) returns bytea
language sql stable strict as $fn$
  select case when coalesce(current_setting('app.crypto_key', true),'') <> ''
       then pgp_sym_encrypt(p_text, current_setting('app.crypto_key', true))
       else null::bytea end;
$fn$;

create or replace function app_dec(p_bytes bytea) returns text
language sql stable strict as $fn$
  select case when coalesce(current_setting('app.crypto_key', true),'') <> ''
       then pgp_sym_decrypt(p_bytes, current_setting('app.crypto_key', true))
       else null::text end;
$fn$;

-- Back-compat names used by the API / health route
create or replace function enc(p_text text) returns bytea
language sql stable strict as $x$ select app_enc(p_text); $x$;

create or replace function dec(p_bytes bytea) returns text
language sql stable strict as $x$ select app_dec(p_bytes); $x$;
`;

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("no DATABASE_URL"); process.exit(1); }
  const db = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, application_name: "crypto-apply" });
  await db.connect();
  await db.query(SQL.replace(/^\uFEFF/, "")); // strip BOM if any
  if (process.env.APP_CRYPTO_KEY) {
    await db.query("set app.crypto_key = $1", [process.env.APP_CRYPTO_KEY]);
  }
  const r = await db.query("select dec(enc('ok')) = 'ok' as ok;");
  console.log("roundtrip:", r.rows?.[0]?.ok === true);
  await db.end();
})().catch(e => { console.error("apply_inline error:", e.message); process.exit(1); });
