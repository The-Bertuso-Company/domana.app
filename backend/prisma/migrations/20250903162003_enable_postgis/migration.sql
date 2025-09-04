-- PostGIS is enabled out-of-band by ops:
--   wsl -e bash -lc "sudo -u postgres psql -d <db> -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
-- This migration exists only to *record* that requirement in history.
SELECT 1;