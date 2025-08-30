CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE "Listing"
  ADD COLUMN IF NOT EXISTS geom geography(Point,4326)
  GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(("lng")::double precision, ("lat")::double precision), 4326)::geography
  ) STORED;
CREATE INDEX IF NOT EXISTS listing_geom_gix ON "Listing" USING GIST(geom);
