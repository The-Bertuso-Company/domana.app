-- Seeds demo saved searches and favorites tied to Step-1 listings.
-- Safe if IDs unchanged.

BEGIN;

-- Demo app user subject (no users table; this is an external auth subject string)
-- Use a stable ID so you can test repeatedly.
-- Example subject could be a Cognito/Clerk/Firebase UID; here we just use a readable token.
WITH params AS (
  SELECT '' AS noop
)

-- Saved Searches
INSERT INTO saved_search (id, user_id, name, filters, area_polygon, last_notified_at, last_evaluated_at, is_active)
VALUES
  (
    'SS0001',
    'user_demo_1',
    'BGC Condos ≤ ₱13M',
    jsonb_build_object(
      'intent','sale',
      'price_min', 0,
      'price_max', 13000000,
      'property_types', jsonb_build_array('condo'),
      'bbox', jsonb_build_array(121.0350,14.5410,121.0565,14.5555)
    ),
    NULL,                       -- polygon not set; using bbox filter
    NULL, NULL, TRUE
  ),
  (
    'SS0002',
    'user_demo_1',
    'Cebu Houses ≤ ₱13M',
    jsonb_build_object(
      'intent','sale',
      'price_min', 0,
      'price_max', 13000000,
      'property_types', jsonb_build_array('house'),
      'keywords', jsonb_build_array('garden','garage')
    ),
    NULL,
    NULL, NULL, TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- Saved Homes (favorites) — link to existing seeds if present
INSERT INTO saved_home (id, user_id, listing_id, note)
VALUES
  ('SH0001','user_demo_1','LSEED0001','Shortlist: good amenities'),
  ('SH0002','user_demo_1','LSEED0005','Family house in Cebu')
ON CONFLICT (id) DO NOTHING;

COMMIT;
