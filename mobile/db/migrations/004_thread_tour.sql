-- Domana DB Migration: Thread/Tour v1 (messaging + scheduling)
-- Assumes Steps 1–3 applied (listing, agent/owner, saved_*).

BEGIN;

-- ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''actor_type'') THEN
    CREATE TYPE actor_type AS ENUM (''user'',''agent'',''owner'',''system'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''tour_status'') THEN
    CREATE TYPE tour_status AS ENUM (''requested'',''confirmed'',''cancelled'',''completed'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''tour_location_type'') THEN
    CREATE TYPE tour_location_type AS ENUM (''on_site'',''virtual'');
  END IF;
END $$;

-- THREADS
CREATE TABLE IF NOT EXISTS thread (
  id                 TEXT PRIMARY KEY,
  listing_id         TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  subject            TEXT,
  created_by_user_id TEXT NOT NULL,
  last_message_at    TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_thread_listing ON thread (listing_id);
CREATE INDEX IF NOT EXISTS idx_thread_last_msg ON thread (last_message_at);

-- PARTICIPANTS (join table)
CREATE TABLE IF NOT EXISTS thread_participant (
  thread_id          TEXT NOT NULL REFERENCES thread(id) ON DELETE CASCADE,
  actor_type         actor_type NOT NULL,
  actor_id           TEXT NOT NULL,
  mute_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  last_read_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, actor_type, actor_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS message (
  id            TEXT PRIMARY KEY,
  thread_id     TEXT NOT NULL REFERENCES thread(id) ON DELETE CASCADE,
  sender_type   actor_type NOT NULL,
  sender_id     TEXT NOT NULL,
  body          TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  attachments   JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_message_thread_time ON message (thread_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_message_sender_time ON message (sender_id, sent_at);

-- TOURS
CREATE TABLE IF NOT EXISTS tour (
  id                 TEXT PRIMARY KEY,
  listing_id         TEXT NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  requester_user_id  TEXT NOT NULL,
  agent_id           TEXT REFERENCES agent(id) ON DELETE SET NULL,
  timezone           TEXT NOT NULL DEFAULT ''Asia/Manila'',
  start_at           TIMESTAMPTZ NOT NULL,
  end_at             TIMESTAMPTZ NOT NULL,
  location_type      tour_location_type NOT NULL,
  location_url       TEXT,
  note               TEXT,
  status             tour_status NOT NULL DEFAULT ''requested'',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_tour_time CHECK (end_at > start_at)
);

CREATE INDEX IF NOT EXISTS idx_tour_agent_time ON tour (agent_id, start_at);
CREATE INDEX IF NOT EXISTS idx_tour_listing_time ON tour (listing_id, start_at);

-- TRIGGERS: updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_thread_updated_at ON thread;
CREATE TRIGGER trg_thread_updated_at BEFORE UPDATE ON thread
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tp_updated_at ON thread_participant;
CREATE TRIGGER trg_tp_updated_at BEFORE UPDATE ON thread_participant
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_message_updated_at ON message;
CREATE TRIGGER trg_message_updated_at BEFORE UPDATE ON message
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tour_updated_at ON tour;
CREATE TRIGGER trg_tour_updated_at BEFORE UPDATE ON tour
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- On new message: bump thread.last_message_at
CREATE OR REPLACE FUNCTION bump_thread_last_message() RETURNS trigger AS $$
BEGIN
  UPDATE thread SET last_message_at = NEW.sent_at, updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_message_bump_thread ON message;
CREATE TRIGGER trg_message_bump_thread AFTER INSERT ON message
FOR EACH ROW EXECUTE FUNCTION bump_thread_last_message();

-- Basic anti-spam: limit to 30 messages per sender per rolling minute (server-side guard; app should also rate-limit)
CREATE OR REPLACE FUNCTION enforce_message_rate() RETURNS trigger AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM message
  WHERE sender_id = NEW.sender_id
    AND NEW.sent_at >= now() - interval '1 minute';

  IF recent_count >= 30 THEN
    RAISE EXCEPTION 'rate_limit_exceeded: too many messages from this sender in the last minute';
  END IF;

  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_message_rate ON message;
CREATE TRIGGER trg_message_rate BEFORE INSERT ON message
FOR EACH ROW EXECUTE FUNCTION enforce_message_rate();

-- ICS exporter for tours (minimal, UTC-based)
CREATE OR REPLACE FUNCTION tour_ics(tour_id TEXT) RETURNS TEXT AS $$
DECLARE
  t RECORD;
  addr TEXT;
  dtstart_utc TEXT;
  dtend_utc TEXT;
  summary TEXT;
BEGIN
  SELECT tr.id, tr.start_at, tr.end_at, tr.location_type, tr.location_url, tr.listing_id,
         a.formatted_address
  INTO t
  FROM tour tr
  JOIN listing l ON l.id = tr.listing_id
  JOIN address a ON a.id = l.address_id
  WHERE tr.id = tour_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'tour_not_found';
  END IF;

  addr := COALESCE(t.formatted_address, '');
  dtstart_utc := to_char((t.start_at AT TIME ZONE 'UTC'), 'YYYYMMDD"T"HH24MISS"Z"');
  dtend_utc   := to_char((t.end_at   AT TIME ZONE 'UTC'), 'YYYYMMDD"T"HH24MISS"Z"');
  summary := 'Property Tour — ' || t.listing_id;

  RETURN
    'BEGIN:VCALENDAR'||E'\n'||
    'VERSION:2.0'||E'\n'||
    'PRODID:-//Domana//Tour//EN'||E'\n'||
    'BEGIN:VEVENT'||E'\n'||
    'UID:tour-'||tour_id||'@domana.app'||E'\n'||
    'DTSTAMP:'||to_char(now() AT TIME ZONE 'UTC','YYYYMMDD"T"HH24MISS"Z"')||E'\n'||
    'DTSTART:'||dtstart_utc||E'\n'||
    'DTEND:'||dtend_utc||E'\n'||
    'SUMMARY:'||summary||E'\n'||
    'LOCATION:'||replace(addr, E'\n',' ')||E'\n'||
    CASE WHEN t.location_type = ''virtual'' AND t.location_url IS NOT NULL
      THEN 'URL:'||t.location_url||E'\n' ELSE '' END ||
    'END:VEVENT'||E'\n'||
    'END:VCALENDAR';
END; $$ LANGUAGE plpgsql;

COMMIT;
