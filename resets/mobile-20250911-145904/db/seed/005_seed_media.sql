-- Seed media sets + assets for a few listings
-- Uses placeholder image/video URLs for demo purposes.

BEGIN;

-- Create media sets for three listings
INSERT INTO media_set (id, owner_type, owner_id)
VALUES
  (''MS_LSEED0001'',''listing'',''LSEED0001''),
  (''MS_LSEED0002'',''listing'',''LSEED0002''),
  (''MS_LSEED0005'',''listing'',''LSEED0005'')
ON CONFLICT (id) DO NOTHING;

-- Link sets to listings (in case trigger ran before/after)
UPDATE listing SET media_set_id = ''MS_LSEED0001'' WHERE id = ''LSEED0001'';
UPDATE listing SET media_set_id = ''MS_LSEED0002'' WHERE id = ''LSEED0002'';
UPDATE listing SET media_set_id = ''MS_LSEED0005'' WHERE id = ''LSEED0005'';

-- Assets for LSEED0001 (BGC condo) - 3 images
INSERT INTO media_asset (id, media_set_id, type, original_url, renditions, width, height, phash64, rights, uploaded_by)
VALUES
  (''MA0001'',''MS_LSEED0001'',''image'',''https://picsum.photos/id/1018/1600/1200'',
   jsonb_build_object(''jpg_1600'',''https://picsum.photos/id/1018/1600/1200'',''webp_1200'',''https://picsum.photos/id/1018/1200/900''),1600,1200, 6861624901123456781,
   jsonb_build_object(''source'',''seed'',''license'',''seed-demo''), ''seed_user''),
  (''MA0002'',''MS_LSEED0001'',''image'',''https://picsum.photos/id/1020/1600/1200'',
   jsonb_build_object(''jpg_1600'',''https://picsum.photos/id/1020/1600/1200''),1600,1200, 6861624901123456700,
   jsonb_build_object(''source'',''seed''), ''seed_user''),
  (''MA0003'',''MS_LSEED0001'',''image'',''https://picsum.photos/id/1024/1600/1200'',
   jsonb_build_object(''jpg_1600'',''https://picsum.photos/id/1024/1600/1200''),1600,1200, 6861624901123456711,
   jsonb_build_object(''source'',''seed''), ''seed_user'')
ON CONFLICT (id) DO NOTHING;

-- Assets for LSEED0002 (Makati condo rent) - 2 images
INSERT INTO media_asset (id, media_set_id, type, original_url, renditions, width, height, phash64, rights, uploaded_by)
VALUES
  (''MA0004'',''MS_LSEED0002'',''image'',''https://picsum.photos/id/1032/1600/1200'',
   jsonb_build_object(''jpg_1600'',''httpsum.photos/id/1032/1600/1200''),1600,1200, 6861624901123456790,
   jsonb_build_object(''source'',''seed''), ''seed_user''),
  (''MA0005'',''MS_LSEED0002'',''image'',''https://picsum.photos/id/1035/1600/1200'',
   jsonb_build_object(''jpg_1600'',''https://picsum.photos/id/1035/1600/1200''),1600,1200, 6861624901123456799,
   jsonb_build_object(''source'',''seed''), ''seed_user'')
ON CONFLICT (id) DO NOTHING;

-- Assets for LSEED0005 (Cebu house) - 1 image + 1 video
INSERT INTO media_asset (id, media_set_id, type, original_url, renditions, width, height, phash64, rights, uploaded_by)
VALUES
  (''MA0006'',''MS_LSEED0005'',''image'',''https://picsum.photos/id/1043/1600/1200'',
   jsonb_build_object(''jpg_1600'',''https://picsum.photos/id/1043/1600/1200''),1600,1200, 6861624901123456707,
   jsonb_build_object(''source'',''seed''), ''seed_user'')
ON CONFLICT (id) DO NOTHING;

INSERT INTO media_asset (id, media_set_id, type, original_url, renditions, duration_seconds, rights, uploaded_by)
VALUES
  (''MA0007'',''MS_LSEED0005'',''video'',''https://cdn.example.com/videos/house-tour-source.mp4'',
   jsonb_build_object(
     ''hls_1080p'',''https://cdn.example.com/videos/house-tour/hls/1080p.m3u8'',
     ''mp4_720p'',''https://cdn.example.com/videos/house-tour/720p.mp4''
   ),
   45.0,
   jsonb_build_object(''source'',''seed''), ''seed_user'')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Example duplicate check (manual):
-- SELECT * FROM media_asset_possible_dupes WHERE distance <= 8 ORDER BY distance;
