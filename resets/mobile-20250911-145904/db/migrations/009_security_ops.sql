-- 009_security_ops.sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION enc_key(p_text text, p_key text) RETURNS bytea AS $$
  SELECT CASE WHEN coalesce(length(p_key),0) > 0 THEN pgp_sym_encrypt(p_text, p_key) ELSE NULL::bytea END;
$$ LANGUAGE sql STABLE STRICT;

CREATE OR REPLACE FUNCTION dec_key(p_bytes bytea, p_key text) RETURNS text AS $$
  SELECT CASE WHEN coalesce(length(p_key),0) > 0 THEN pgp_sym_decrypt(p_bytes, p_key) ELSE NULL::text END;
$$ LANGUAGE sql STABLE STRICT;

-- Create owner views only if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='owner') THEN
    EXECUTE $v$
      CREATE OR REPLACE VIEW owner_secure AS
      SELECT id, full_name_or_entity, contact_email, contact_phone FROM owner;
    $v$;

    EXECUTE $v$
      CREATE OR REPLACE VIEW owner_public AS
      SELECT
        id,
        CASE WHEN contact_email IS NULL THEN NULL ELSE regexp_replace(contact_email,'(^.).+(@.*$)','\1***\2') END AS contact_email,
        CASE WHEN contact_phone IS NULL THEN NULL ELSE regexp_replace(contact_phone,'(.{0,3}).*(.{2})$','\1****\2') END AS contact_phone
      FROM owner;
    $v$;
  END IF;
END $$;
COMMIT;
