-- Domana DB Migration: SavedSearch v1 + SavedHome v1
-- Assumes Step 1 (listing/address) and Step 2 (agent/owner) are applied.

BEGIN;

-- SAVED SEARCH
CREATE TABLE IF NOT EXISTS saved_search (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL,                 -- external auth subject; no FK here by design
  name              TEXT,
  filters           JSONB NOT NULL,                -- validated at API; see schema
  area_polygon      GEOGRAPHY(POLYGON,4326),       -- optional polygon AOI
  last_notified_at  TIMESTAMPTZ,
  last_evaluated_at TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_saved_search_user ON saved_search (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_search_active ON saved_search (is_active);
CREATE INDEX IF NOT EXISTS idx_saved_search_filters_gin ON saved_search USING GIN (filters);
CREATE INDEX IF NOT EXISTS idx_saved_search_polygon_gist ON saved_search USING GIST ((area_polygon::geometry));

-- SAVED HOME (favorites)
CREATE TABLE IF NOT EXISTS saved_home (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL,
  listing_id   TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent duplicates per (user, listing)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_saved_home_user_listing ON saved_home (user_id, listing_id);

-- Reuse / ensure set_updated_at() exists
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_saved_search_updated_at ON saved_search;
CREATE TRIGGER trg_saved_search_updated_at BEFORE UPDATE ON saved_search
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
