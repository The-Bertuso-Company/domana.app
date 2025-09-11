-- 009_crypto.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION enc(p_text text) RETURNS bytea
LANGUAGE sql STABLE STRICT AS $$
  SELECT CASE WHEN coalesce(current_setting('app.crypto_key', true),'') <> ''
    THEN pgp_sym_encrypt(p_text, current_setting('app.crypto_key', true))
    ELSE NULL::bytea END;
$$;

CREATE OR REPLACE FUNCTION dec(p_bytes bytea) RETURNS text
LANGUAGE sql STABLE STRICT AS $$
  SELECT CASE WHEN coalesce(current_setting('app.crypto_key', true),'') <> ''
    THEN pgp_sym_decrypt(p_bytes, current_setting('app.crypto_key', true))
    ELSE NULL::text END;
$$;
