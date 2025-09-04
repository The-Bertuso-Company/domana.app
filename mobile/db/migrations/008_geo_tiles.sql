BEGIN;
CREATE OR REPLACE FUNCTION tile_listings(z INT, x INT, y INT)
RETURNS bytea AS $$
DECLARE bbox geometry := ST_TileEnvelope(z,x,y);
BEGIN
  RETURN (
    SELECT ST_AsMVT(q, 'listings', 4096, 'geom')
    FROM (
      SELECT l.id, l.price_amount::int AS price,
             l.property_type::text AS property_type,
             l.status::text AS status,
             ST_AsMVTGeom(l.location::geometry, bbox, 4096, 64, true) AS geom
      FROM listing l
      WHERE l.status = 'active' AND ST_Intersects(l.location::geometry, bbox)
    ) AS q
  );
END; $$ LANGUAGE plpgsql STABLE PARALLEL SAFE;
COMMIT;
