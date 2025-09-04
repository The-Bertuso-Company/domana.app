-- Domana DB Migration: Agent/Owner/Brokerage v1 + FKs on listing
-- Requires: Step 1 migration applied.

BEGIN;

-- ENUM for KYC state machine
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_status') THEN
    CREATE TYPE kyc_status AS ENUM ('unverified','pending','verified','rejected');
  END IF;
END $$;

-- BROKERAGE
CREATE TABLE IF NOT EXISTS brokerage (
  id              TEXT PRIMARY KEY,
  legal_name      TEXT NOT NULL,
  dba             TEXT,
  tin_or_tax_id   TEXT,                    -- Restricted (consider pgcrypto later)
  address_id      TEXT REFERENCES address(id) ON DELETE SET NULL,
  contact_email   TEXT,
  contact_phone   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT brokerage_email_valid CHECK (
    contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT brokerage_phone_e164 CHECK (
    contact_phone IS NULL OR contact_phone ~ '^\\+[1-9]\\d{1,14}$'
  )
);

-- AGENT
CREATE TABLE IF NOT EXISTS agent (
  id              TEXT PRIMARY KEY,
  full_name       TEXT NOT NULL,
  license_no      TEXT,                    -- Some assistants may lack license; keep nullable, enforce uniqueness when present
  license_expiry  DATE NOT NULL,
  phones          TEXT[] NOT NULL DEFAULT '{}',
  emails          TEXT[] NOT NULL DEFAULT '{}',
  brokerage_id    TEXT REFERENCES brokerage(id) ON DELETE SET NULL,
  address_id      TEXT REFERENCES address(id) ON DELETE SET NULL,
  kyc_status      kyc_status NOT NULL DEFAULT 'unverified',
  verified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT agent_license_unique UNIQUE NULLS NOT DISTINCT (license_no),
  CONSTRAINT agent_phones_e164 CHECK (
    NOT EXISTS (SELECT 1 FROM unnest(phones) p WHERE p !~ '^\\+[1-9]\\d{1,14}$')
  ),
  CONSTRAINT agent_emails_valid CHECK (
    NOT EXISTS (SELECT 1 FROM unnest(emails) e WHERE e !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
  )
);

-- OWNER
CREATE TABLE IF NOT EXISTS owner (
  id                    TEXT PRIMARY KEY,
  full_name_or_entity   TEXT NOT NULL,
  contact_email         TEXT,
  contact_phone         TEXT,
  address_id            TEXT REFERENCES address(id) ON DELETE SET NULL,
  kyc_status            kyc_status NOT NULL DEFAULT 'unverified',
  verified_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT owner_email_valid CHECK (
    contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT owner_phone_e164 CHECK (
    contact_phone IS NULL OR contact_phone ~ '^\\+[1-9]\\d{1,14}$'
  )
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_agent_brokerage ON agent (brokerage_id);
CREATE INDEX IF NOT EXISTS idx_agent_license ON agent (license_no);
CREATE INDEX IF NOT EXISTS idx_owner_name ON owner (full_name_or_entity);

-- Triggers to keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_brokerage_updated_at ON brokerage;
CREATE TRIGGER trg_brokerage_updated_at BEFORE UPDATE ON brokerage
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_agent_updated_at ON agent;
CREATE TRIGGER trg_agent_updated_at BEFORE UPDATE ON agent
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_owner_updated_at ON owner;
CREATE TRIGGER trg_owner_updated_at BEFORE UPDATE ON owner
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add FKs + safety constraint to existing listing table
ALTER TABLE listing
  ADD CONSTRAINT fk_listing_agent
    FOREIGN KEY (agent_id) REFERENCES agent(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED,
  ADD CONSTRAINT fk_listing_owner
    FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

-- Prevent both agent and owner from being set simultaneously (but allow both NULL)
ALTER TABLE listing
  ADD CONSTRAINT chk_listing_exclusive_party CHECK (
    NOT (agent_id IS NOT NULL AND owner_id IS NOT NULL)
  );

COMMIT;
