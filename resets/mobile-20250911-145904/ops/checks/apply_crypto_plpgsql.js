require("dotenv").config();
const { Client } = require("pg");

const SQL_STMTS = [
  // make sure pgcrypto exists
  "create extension if not exists pgcrypto",

  // helper that safely fetches app.crypto_key (returns null if not set)
  `
  create or replace function app_crypto_key() returns text
  language plpgsql stable as $$
  declare v text;
  begin
    begin
      v := current_setting('app.crypto_key');
    exception when others then
      v := null;
    end;
    return v;
  end $$;`,

  // encrypt
  `
  create or replace function app_enc(p_text text) returns bytea
  language plpgsql stable strict as $$
  declare k text;
  begin
    k := app_crypto_key();
    if k is null or k = '' then
      return null::bytea;
    end if;
    return pgp_sym_encrypt(p_text, k);
  end $$;`,

  // decrypt
  `
  create or replace function app_dec(p_bytes bytea) returns text
  language plpgsql stable strict as $$
  declare k text;
  begin
    k := app_crypto_key();
    if k is null or k = '' then
      return null::text;
    end if;
    return pgp_sym_decrypt(p_bytes, k);
  end $$;`,

  // back-compat names your API calls
  "create or replace function enc(p_text text) returns bytea language sql stable strict as $$ select app_enc(p_text) $$",
  "create or replace function dec(p_bytes bytea) returns text  language sql stable strict as $$ select app_dec(p_bytes) $$",
];

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("no DATABASE_URL"); process.exit(1); }

  const db = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    application_name: "crypto-apply-plpgsql",
  });
  await db.connect();

  for (const stmt of SQL_STMTS) {
    await db.query(stmt.trim());
  }

  if (process.env.APP_CRYPTO_KEY) {
    await db.query("set app.crypto_key = $1", [process.env.APP_CRYPTO_KEY]);
  }
  const r = await db.query("select dec(enc('ok')) = 'ok' as ok");
  console.log("roundtrip:", r.rows?.[0]?.ok === true);
  await db.end();
})().catch(e => { console.error("apply_plpgsql error:", e.message); process.exit(1); });
