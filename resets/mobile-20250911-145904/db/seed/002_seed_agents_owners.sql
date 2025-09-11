-- Seeds: 2 brokerages, 3 agents, 2 owners, and link a few sample listings
-- Safe to run multiple times if IDs unchanged

BEGIN;

-- Addresses for brokerages (re-use Step 1 address table)
WITH a AS (
  SELECT * FROM (VALUES
    ('ABROK0001','PH','NCR','Metro Manila','Taguig','Fort Bonifacio','BGC','30th St','1634','30th St, BGC, Taguig 1634',14.5496,121.0472),
    ('ABROK0002','PH','Region VII','Cebu','Cebu City','Lahug',NULL,'Gov M Cuenco Ave','6000','Gov M Cuenco Ave, Lahug, Cebu City 6000',10.3298,123.9040)
  ) AS t(id,country_code,region,province,city_municipality,barangay,subdivision,street_address,postal_code,formatted_address,lat,lng)
)
INSERT INTO address (id,country_code,region,province,city_municipality,barangay,subdivision,street_address,postal_code,formatted_address,location)
SELECT id,country_code,region,province,city_municipality,barangay,subdivision,street_address,postal_code,formatted_address,
       ST_SetSRID(ST_MakePoint(lng,lat),4326)::geography
FROM a
ON CONFLICT (id) DO NOTHING;

-- Brokerages
INSERT INTO brokerage (id,legal_name,dba,tin_or_tax_id,address_id,contact_email,contact_phone)
VALUES
  ('BROK0001','Domana Realty Partners Inc.', 'Domana Realty', 'TIN-123-456','ABROK0001','contact@domanarealty.ph','+63285555555'),
  ('BROK0002','VisMin Homes Brokerage Co.',  'VisMin Homes',  'TIN-987-654','ABROK0002','hello@visminhomes.ph','+63322345678')
ON CONFLICT (id) DO NOTHING;

-- Agents
INSERT INTO agent (id,full_name,license_no,license_expiry,phones,emails,brokerage_id,kyc_status,verified_at)
VALUES
  ('AGNT0001','Maria Santos','PRC-REBL-12345','2027-12-31',ARRAY['+639171234567'],ARRAY['maria.santos@domanarealty.ph'],'BROK0001','verified', now()),
  ('AGNT0002','Juan Dela Cruz','PRC-REBL-54321','2026-06-30',ARRAY['+639089876543'],ARRAY['juan.delacruz@domanarealty.ph'],'BROK0001','pending', NULL),
  ('AGNT0003','Cebuana Real','PRC-REBL-24680','2028-03-15',ARRAY['+639221112222'],ARRAY['cebuana.real@visminhomes.ph'],'BROK0002','verified', now())
ON CONFLICT (id) DO NOTHING;

-- Owners (private sellers/lessors)
INSERT INTO owner (id,full_name_or_entity,contact_email,contact_phone,kyc_status)
VALUES
  ('OWNR0001','Aragon Family','aragon.family@example.com','+639178889999','unverified'),
  ('OWNR0002','CDO Landholdings Inc.','legal@cdolandholdings.ph','+638822233344','pending')
ON CONFLICT (id) DO NOTHING;

-- Link some existing seed listings from Step 1 (if present)
-- LSEED0001 (BGC condo) -> Agent Maria, LSEED0002 (Makati condo rent) -> Agent Juan, LSEED0005 (Cebu house) -> Owner Aragon
UPDATE listing SET agent_id='AGNT0001' WHERE id='LSEED0001';
UPDATE listing SET agent_id='AGNT0002' WHERE id='LSEED0002';
UPDATE listing SET owner_id='OWNR0001' WHERE id='LSEED0005';

COMMIT;
