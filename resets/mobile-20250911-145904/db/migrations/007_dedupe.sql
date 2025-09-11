-- 007_dedupe.sql — listing dedupe helpers + merge log

BEGIN;

-- Merge log
CREATE TABLE IF NOT EXISTS listing_merge_log (
  id            BIGSERIAL PRIMARY KEY,
  canonical_id  TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  duplicate_id  TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  decided_by    TEXT,                     -- actor id
  decided_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  score         INT NOT NULL,
  signals       JSONB NOT NULL
);

-- Score function
CREATE OR REPLACE FUNCTION listing_pair_score(a TEXT, b TEXT)
RETURNS TABLE(score INT, signals JSONB) AS $$
DECLARE
  la RECORD; lb RECORD; s INT := 0; sig JSONB := '{}'::jsonb;
  dist_m DOUBLE PRECISION;
  price_delta NUMERIC;
  hdist INT;
BEGIN
  SELECT * INTO la FROM listing WHERE id = a;
  SELECT * INTO lb FROM listing WHERE id = b;
  IF la IS NULL OR lb IS NULL THEN
    RETURN QUERY SELECT 0, jsonb_build_object('error','missing_listing'); RETURN;
  END IF;

  -- ext id
  IF la.external_source_id IS NOT NULL AND la.external_source_id <> '' AND la.external_source_id = lb.external_source_id THEN
    s := s + 80; sig := sig || jsonb_build_object('external_source_id', true);
  END IF;

  -- distance
  dist_m := ST_Distance(la.location::geometry, lb.location::geometry);
  IF dist_m <= 15 THEN s := s + 40; sig := sig || jsonb_build_object('distance_m', dist_m); END IF;

  -- price delta %
  IF la.price_amount IS NOT NULL AND lb.price_amount IS NOT NULL AND la.price_amount > 0 THEN
    price_delta := abs(la.price_amount - lb.price_amount) / la.price_amount * 100.0;
    IF price_delta <= 1 THEN s := s + 10; sig := sig || jsonb_build_object('price_delta_pct', price_delta); END IF;
  END IF;

  -- phash hamming (min across assets)
  WITH la_ms AS (SELECT media_set_id FROM listing WHERE id = a),
       lb_ms AS (SELECT media_set_id FROM listing WHERE id = b),
       la_img AS (
         SELECT phash64 FROM media_asset WHERE media_set_id = (SELECT media_set_id FROM la_ms) AND type='image' AND phash64 IS NOT NULL
       ),
       lb_img AS (
         SELECT phash64 FROM media_asset WHERE media_set_id = (SELECT media_set_id FROM lb_ms) AND type='image' AND phash64 IS NOT NULL
       )
  SELECT MIN(phash_hamming(x.phash64, y.phash64)) INTO hdist
  FROM la_img x CROSS JOIN lb_img y;

  IF hdist IS NOT NULL AND hdist <= 8 THEN
    s := s + 20; sig := sig || jsonb_build_object('phash_hamming', hdist);
  END IF;

  -- same agent
  IF la.agent_id IS NOT NULL AND la.agent_id = lb.agent_id THEN s := s + 10; sig := sig || jsonb_build_object('agent_match', true); END IF;

  RETURN QUERY SELECT s, sig;
END; $$ LANGUAGE plpgsql;

-- Propose candidates by window search (same city, same prop type)
CREATE OR REPLACE VIEW listing_possible_duplicates AS
SELECT a.id AS a_id, b.id AS b_id, (listing_pair_score(a.id,b.id)).score AS score
FROM listing a
JOIN listing b ON a.id < b.id
WHERE a.city_municipality IS NULL OR b.city_municipality IS NULL OR TRUE; -- kept simple (city lives in address table)

-- Helper: pick canonical (verified badge later) or by updated_at
CREATE OR REPLACE FUNCTION pick_canonical(a TEXT, b TEXT) RETURNS TEXT AS $$
DECLARE
  la RECORD; lb RECORD;
BEGIN
  SELECT * INTO la FROM listing WHERE id = a;
  SELECT * INTO lb FROM listing WHERE id = b;
  IF la.updated_at >= lb.updated_at THEN RETURN a; ELSE RETURN b; END IF;
END; $$ LANGUAGE plpgsql;

-- Merge operation (non-destructive for now)
CREATE OR REPLACE FUNCTION merge_listings(a TEXT, b TEXT, actor TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  sc INT; sig JSONB; canon TEXT; dup TEXT;
BEGIN
  SELECT (listing_pair_score(a,b)).score, (listing_pair_score(a,b)).signals INTO sc, sig;
  IF sc < 90 THEN RAISE EXCEPTION 'merge_rejected: score % below threshold', sc; END IF;

  canon := pick_canonical(a,b); dup := CASE WHEN canon = a THEN b ELSE a END;

  -- Adopt attrs superset
  UPDATE listing AS l
    SET attrs = COALESCE(l.attrs,'{}'::jsonb) || COALESCE(d.attrs,'{}'::jsonb),
        updated_at = now()
  FROM listing d
  WHERE l.id = canon AND d.id = dup;

  -- Retire duplicate
  UPDATE listing SET status='off_market', updated_at = now() WHERE id = dup;

  INSERT INTO listing_merge_log(canonical_id, duplicate_id, decided_by, score, signals)
  VALUES (canon, dup, actor, sc, sig);

  RETURN canon;
END; $$ LANGUAGE plpgsql;

COMMIT;
