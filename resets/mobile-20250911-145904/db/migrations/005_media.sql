-- Domana DB Migration: Media v1 (sets, assets, pHash helpers)
-- Assumes Steps 1–4 applied (listing exists).

BEGIN;

-- ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''media_type'') THEN
    CREATE TYPE media_type AS ENUM (''image'',''video'',''doc'',''tour3d'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''media_owner_type'') THEN
    CREATE TYPE media_owner_type AS ENUM (''listing'',''thread'',''message'');
  END IF;
END $$;

-- MEDIA SET (one per owner)
CREATE TABLE IF NOT EXISTS media_set (
  id              TEXT PRIMARY KEY,
  owner_type      media_owner_type NOT NULL,
  owner_id        TEXT NOT NULL,
  cover_media_id  TEXT,
  order_ids       TEXT[] NOT NULL DEFAULT ''{}'',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uniq_media_set_per_owner UNIQUE (owner_type, owner_id)
);

-- MEDIA ASSET (photo/video/doc/3D)
CREATE TABLE IF NOT EXISTS media_asset (
  id                TEXT PRIMARY KEY,
  media_set_id      TEXT NOT NULL REFERENCES media_set(id) ON DELETE CASCADE,
  type              media_type NOT NULL,
  original_url      TEXT NOT NULL,
  renditions        JSONB NOT NULL DEFAULT ''{}''::jsonb,
  width             INT,
  height            INT,
  duration_seconds  NUMERIC(10,2),
  phash64           BIGINT,                 -- 64-bit perceptual hash for images
  exif_json         JSONB NOT NULL DEFAULT ''{}''::jsonb,
  rights            JSONB NOT NULL DEFAULT ''{}''::jsonb, -- {copyright, source, license, credit}
  uploaded_by       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_img_dims CHECK (
    (type <> ''image'') OR (width IS NOT NULL AND height IS NOT NULL AND width > 0 AND height > 0)
  ),
  CONSTRAINT chk_video_duration CHECK (
    (type <> ''video'') OR (duration_seconds IS NOT NULL AND duration_seconds >= 0)
  )
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_media_asset_set ON media_asset (media_set_id);
CREATE INDEX IF NOT EXISTS idx_media_asset_type ON media_asset (type);
CREATE INDEX IF NOT EXISTS idx_media_asset_phash ON media_asset (phash64);
CREATE INDEX IF NOT EXISTS idx_media_asset_rights_gin ON media_asset USING GIN (rights);
CREATE INDEX IF NOT EXISTS idx_media_asset_renditions_gin ON media_asset USING GIN (renditions);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ms_updated_at ON media_set;
CREATE TRIGGER trg_ms_updated_at BEFORE UPDATE ON media_set
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_ma_updated_at ON media_asset;
CREATE TRIGGER trg_ma_updated_at BEFORE UPDATE ON media_asset
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- When first asset inserted into a media_set, set it as cover and append to order_ids
CREATE OR REPLACE FUNCTION after_media_asset_insert() RETURNS trigger AS $$
DECLARE
  is_first BOOLEAN;
BEGIN
  SELECT (cover_media_id IS NULL) INTO is_first FROM media_set WHERE id = NEW.media_set_id;

  -- ensure NEW.id is in order_ids (append if missing)
  UPDATE media_set
     SET order_ids = CASE
                       WHEN NOT (NEW.id = ANY(order_ids)) THEN array_append(order_ids, NEW.id)
                       ELSE order_ids
                     END,
         updated_at = now()
   WHERE id = NEW.media_set_id;

  IF is_first THEN
    UPDATE media_set SET cover_media_id = NEW.id, updated_at = now() WHERE id = NEW.media_set_id;
  END IF;

  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ma_after_insert ON media_asset;
CREATE TRIGGER trg_ma_after_insert AFTER INSERT ON media_asset
FOR EACH ROW EXECUTE FUNCTION after_media_asset_insert();

-- Convenience: keep listing.media_set_id in sync when a set is created for a listing
CREATE OR REPLACE FUNCTION after_media_set_insert() RETURNS trigger AS $$
BEGIN
  IF NEW.owner_type = ''listing'' THEN
    UPDATE listing SET media_set_id = NEW.id, updated_at = now() WHERE id = NEW.owner_id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ms_after_insert ON media_set;
CREATE TRIGGER trg_ms_after_insert AFTER INSERT ON media_set
FOR EACH ROW EXECUTE FUNCTION after_media_set_insert();

-- ============== pHash helpers (64-bit) ==============
-- Bitcount for BIGINT
CREATE OR REPLACE FUNCTION bitcount_bigint(x BIGINT) RETURNS INT AS $$
DECLARE
  c INT := 0;
  v BIGINT := x;
BEGIN
  WHILE v <> 0 LOOP
    c := c + (v & 1);
    v := v >> 1;
  END LOOP;
  RETURN c;
END; $$ LANGUAGE plpgsql IMMUTABLE;

-- Hamming distance for two 64-bit pHashes
CREATE OR REPLACE FUNCTION phash_hamming(a BIGINT, b BIGINT) RETURNS INT AS $$
BEGIN
  IF a IS NULL OR b IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN bitcount_bigint(a # b);
END; $$ LANGUAGE plpgsql IMMUTABLE;

-- Quick helper view for potential duplicates (tune threshold in WHERE)
CREATE OR REPLACE VIEW media_asset_possible_dupes AS
SELECT a.id AS id_a, b.id AS id_b, phash_hamming(a.phash64,b.phash64) AS distance
FROM media_asset a
JOIN media_asset b ON a.id < b.id
WHERE a.type = ''image'' AND b.type = ''image'' AND a.phash64 IS NOT NULL AND b.phash64 IS NOT NULL;

-- Add FK from listing.media_set_id -> media_set
ALTER TABLE listing
  ADD CONSTRAINT fk_listing_media_set
  FOREIGN KEY (media_set_id) REFERENCES media_set(id) ON DELETE SET NULL;

COMMIT;
