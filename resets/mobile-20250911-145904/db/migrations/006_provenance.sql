-- 006_provenance.sql — verification badges, KYC fields, documents
BEGIN;

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_badge') THEN
    CREATE TYPE verification_badge AS ENUM ('docs_verified','site_verified','agent_verified');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
    CREATE TYPE document_type AS ENUM ('id_scan','title_deed','tax_declaration','other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('pending','approved','rejected');
  END IF;
END $$;

-- Listing: verification badges
ALTER TABLE listing
  ADD COLUMN IF NOT EXISTS verification_badges verification_badge[] NOT NULL DEFAULT '{}';

-- KYC provider refs on agent/owner
ALTER TABLE agent  ADD COLUMN IF NOT EXISTS kyc_provider TEXT, ADD COLUMN IF NOT EXISTS kyc_reference_id TEXT;
ALTER TABLE owner  ADD COLUMN IF NOT EXISTS kyc_provider TEXT, ADD COLUMN IF NOT EXISTS kyc_reference_id TEXT;

-- Documents
CREATE TABLE IF NOT EXISTS document (
  id               TEXT PRIMARY KEY,
  owner_type       TEXT NOT NULL CHECK (owner_type IN ('agent','owner','listing')),
  owner_id         TEXT NOT NULL,
  type             document_type NOT NULL,
  file_url         TEXT NOT NULL,
  reviewed_by      TEXT,
  reviewed_at      TIMESTAMPTZ,
  status           review_status NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_owner  ON document (owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_document_status ON document (status);

-- Audit trail
CREATE TABLE IF NOT EXISTS verification_audit (
  id            BIGSERIAL PRIMARY KEY,
  entity_type   TEXT NOT NULL CHECK (entity_type IN ('agent','owner','listing')),
  entity_id     TEXT NOT NULL,
  action        TEXT NOT NULL, -- requested, approved, rejected, revoked
  actor_id      TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger helper (idempotent redefine)
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doc_updated ON document;
CREATE TRIGGER trg_doc_updated BEFORE UPDATE ON document FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
