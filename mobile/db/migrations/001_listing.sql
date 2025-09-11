-- Domana DB Migration: Listing v1 + Address v1
-- Requires: PostgreSQL 16+, PostGIS 3

BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE listing_status AS ENUM ('active','pending','sold','off_market');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_intent') THEN
    CREATE TYPE listing_intent AS ENUM ('sale','rent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    CREATE TYPE property_type AS ENUM ('house','condo','townhouse','lot','farm','land','commercial_lite');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_frequency') THEN
    CREATE TYPE price_frequency AS ENUM ('one_time','monthly');
  END IF;
END $$;

-- ADDRESS
CREATE TABLE IF NOT EXISTS address (
  id                   TEXT PRIMARY KEY,
  country_code         CHAR(2) NOT NULL CHECK (country_code IN ('PH','US')),
  region               TEXT NOT NULL,
  province             TEXT NOT NULL,
  city_municipality    TEXT NOT NULL,
  barangay             TEXT NOT NULL,
  subdivision          TEXT,
  street_address       TEXT NOT NULL,
  postal_code          TEXT NOT NULL,
  formatted_address    TEXT,
  location             GEOGRAPHY(POINT,4326) NOT NULL,
  geohash              TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_address_location_gist ON address USING GIST ((location::geometry));
CREATE INDEX IF NOT EXISTS idx_address_city ON address (city_municipality);
CREATE INDEX IF NOT EXISTS idx_address_postal ON address (postal_code);

-- LISTING
CREATE TABLE IF NOT EXISTS listing (
  id                   TEXT PRIMARY KEY,
  status               listing_status NOT NULL,
  intent               listing_intent NOT NULL,
  property_type        property_type NOT NULL,
  price_amount         NUMERIC(14,2) NOT NULL CHECK (price_amount >= 0),
  price_currency       CHAR(3) NOT NULL DEFAULT 'PHP',
  price_frequency      price_frequency NOT NULL DEFAULT 'one_time',
  beds                 NUMERIC(3,1),
  baths                NUMERIC(3,1),
  floor_area_sqm       NUMERIC(10,2),
  lot_area_sqm         NUMERIC(10,2),
  year_built           INT,
  address_id           TEXT NOT NULL REFERENCES address(id) ON DELETE RESTRICT,
  location             GEOGRAPHY(POINT,4326) NOT NULL,
  h3_res9              TEXT,
  agent_id             TEXT,
  owner_id             TEXT,
  source               TEXT NOT NULL CHECK (source IN ('manual','csv','partner')),
  external_source_id   TEXT,
  media_set_id         TEXT,
  attrs                JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at         TIMESTAMPTZ NOT NULL,
  expires_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  version              INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_listing_status ON listing (status);
CREATE INDEX IF NOT EXISTS idx_listing_intent ON listing (intent);
CREATE INDEX IF NOT EXISTS idx_listing_prop_type ON listing (property_type);
CREATE INDEX IF NOT EXISTS idx_listing_price ON listing (price_amount);
CREATE INDEX IF NOT EXISTS idx_listing_location_gist ON listing USING GIST ((location::geometry));
CREATE INDEX IF NOT EXISTS idx_listing_h3 ON listing (h3_res9);
CREATE INDEX IF NOT EXISTS idx_listing_attrs_gin ON listing USING GIN (attrs);

-- LISTING HISTORY
CREATE TABLE IF NOT EXISTS listing_history (
  id             BIGSERIAL PRIMARY KEY,
  listing_id     TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by     TEXT,
  change_type    TEXT NOT NULL, -- created, updated, merged, status_change, price_change
  diff           JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- TRIGGERS
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_address_updated_at ON address;
CREATE TRIGGER trg_address_updated_at BEFORE UPDATE ON address
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_listing_updated_at ON listing;
CREATE TRIGGER trg_listing_updated_at BEFORE UPDATE ON listing
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
