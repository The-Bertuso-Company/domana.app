-- Seeds: threads, participants, messages, and tours
-- Depends on: LSEED0001, LSEED0005; AGNT0001; OWNR0001 from earlier steps.

BEGIN;

-- Thread between demo user and Agent Maria on LSEED0001 (BGC condo)
INSERT INTO thread (id, listing_id, subject, created_by_user_id, last_message_at)
VALUES ('THRD0001','LSEED0001','Inquiry about BGC condo','user_demo_1', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO thread_participant (thread_id, actor_type, actor_id)
VALUES
  ('THRD0001','user','user_demo_1'),
  ('THRD0001','agent','AGNT0001')
ON CONFLICT DO NOTHING;

-- Messages (simple convo)
INSERT INTO message (id, thread_id, sender_type, sender_id, body, sent_at)
VALUES
  ('MSG0001','THRD0001','user','user_demo_1','Hi! Is the unit still available? Can I tour this Saturday at 10 AM?', now() - interval '2 hour'),
  ('MSG0002','THRD0001','agent','AGNT0001','Hello! Yes, it''s available. Saturday 10 AM works. I''ll send a tour invite.', now() - interval '1 hour 50 minutes'),
  ('MSG0003','THRD0001','user','user_demo_1','Great, thank you!', now() - interval '1 hour 45 minutes')
ON CONFLICT (id) DO NOTHING;

-- Thread between demo user and Owner (Cebu house LSEED0005)
INSERT INTO thread (id, listing_id, subject, created_by_user_id, last_message_at)
VALUES ('THRD0002','LSEED0005','Question about Cebu house','user_demo_1', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO thread_participant (thread_id, actor_type, actor_id)
VALUES
  ('THRD0002','user','user_demo_1'),
  ('THRD0002','owner','OWNR0001')
ON CONFLICT DO NOTHING;

INSERT INTO message (id, thread_id, sender_type, sender_id, body, sent_at)
VALUES
  ('MSG0004','THRD0002','user','user_demo_1','Hi! Does the house allow small pets?', now() - interval '30 minutes'),
  ('MSG0005','THRD0002','owner','OWNR0001','Yes, small pets are fine with a deposit.', now() - interval '25 minutes')
ON CONFLICT (id) DO NOTHING;

-- Tours
-- Tour with Agent Maria for BGC condo (on-site)
INSERT INTO tour (id, listing_id, requester_user_id, agent_id, timezone, start_at, end_at, location_type, status, note)
VALUES
  ('TOUR0001','LSEED0001','user_demo_1','AGNT0001','Asia/Manila',
   (date_trunc('day', now()) + interval '2 day')::timestamptz + time '10:00',
   (date_trunc('day', now()) + interval '2 day')::timestamptz + time '10:30',
   'on_site','confirmed','Bring valid ID for building access')
ON CONFLICT (id) DO NOTHING;

-- Virtual tour example (Cebu house with owner, using a link)
INSERT INTO tour (id, listing_id, requester_user_id, agent_id, timezone, start_at, end_at, location_type, location_url, status, note)
VALUES
  ('TOUR0002','LSEED0005','user_demo_1',NULL,'Asia/Manila',
   (date_trunc('day', now()) + interval '3 day')::timestamptz + time '14:00',
   (date_trunc('day', now()) + interval '3 day')::timestamptz + time '14:45',
   'virtual','https://meet.example.com/demolink','requested','Owner will host the call')
ON CONFLICT (id) DO NOTHING;

COMMIT;
