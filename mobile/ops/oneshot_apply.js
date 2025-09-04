require("dotenv").config();
const { Client } = require("pg");

const sql = `
BEGIN;
create extension if not exists postgis;
create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname='listing_status') then
    create type listing_status as enum ('active','pending','sold','off_market');
  end if;
  if not exists (select 1 from pg_type where typname='listing_intent') then
    create type listing_intent as enum ('sale','rent');
  end if;
  if not exists (select 1 from pg_type where typname='property_type') then
    create type property_type as enum ('house','condo','townhouse','lot','farm','land','commercial_lite');
  end if;
  if not exists (select 1 from pg_type where typname='price_frequency') then
    create type price_frequency as enum ('one_time','monthly');
  end if;
end $$;

create table if not exists address (
  id text primary key,
  country_code char(2) not null check (country_code in ('PH','US')),
  region text not null,
  province text not null,
  city_municipality text not null,
  barangay text not null,
  subdivision text,
  street_address text not null,
  postal_code text not null,
  formatted_address text,
  location geography(point,4326) not null,
  geohash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_address_location_gist on address using gist((location::geometry));

create table if not exists listing (
  id text primary key,
  status listing_status not null,
  intent listing_intent not null,
  property_type property_type not null,
  price_amount numeric(14,2) not null check (price_amount >= 0),
  price_currency char(3) not null default 'PHP',
  price_frequency price_frequency not null default 'one_time',
  beds numeric(3,1),
  baths numeric(3,1),
  floor_area_sqm numeric(10,2),
  lot_area_sqm numeric(10,2),
  year_built int,
  address_id text not null references address(id) on delete restrict,
  location geography(point,4326) not null,
  h3_res9 text,
  agent_id text,
  owner_id text,
  source text not null check (source in ('manual','csv','partner')) default 'manual',
  external_source_id text,
  media_set_id text,
  attrs jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);
create index if not exists idx_listing_location_gist on listing using gist((location::geometry));
create index if not exists idx_listing_status on listing(status);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at := now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_address_updated_at on address;
create trigger trg_address_updated_at before update on address for each row execute function set_updated_at();

drop trigger if exists trg_listing_updated_at on listing;
create trigger trg_listing_updated_at before update on listing for each row execute function set_updated_at();

-- minimal owner + views
create table if not exists owner (
  id text primary key,
  full_name_or_entity text,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view owner_secure as
select id, full_name_or_entity, contact_email, contact_phone from owner;

create or replace view owner_public as
select
  id,
  case when contact_email is null then null else regexp_replace(contact_email,'(^.).+(@.*$)','\\\\***\\\\') end as contact_email,
  case when contact_phone is null then null else regexp_replace(contact_phone,'(.{0,3}).*(.{2})$','\\\\****\\\\') end as contact_phone
from owner;

-- crypto helpers (safe if app.crypto_key is not set)
create or replace function app_crypto_key() returns text
language plpgsql stable as $$
declare v text;
begin
  begin v := current_setting('app.crypto_key', true); exception when others then v := null; end;
  return v;
end $$;

create or replace function enc(p_text text) returns bytea
language sql stable strict as $$
  select case when coalesce(current_setting('app.crypto_key', true),'') <> ''
              then pgp_sym_encrypt(p_text, current_setting('app.crypto_key', true))
              else null::bytea end
$$;

create or replace function dec(p_bytes bytea) returns text
language sql stable strict as $$
  select case when coalesce(current_setting('app.crypto_key', true),'') <> ''
              then pgp_sym_decrypt(p_bytes, current_setting('app.crypto_key', true))
              else null::text end
$$;

-- seed owner
insert into owner(id, full_name_or_entity, contact_email, contact_phone)
values ('OWNER_DEV001','Dev Owner','dev.owner@example.com','+639171234567')
on conflict (id) do nothing;

-- seed 3 addresses + listings
insert into address(id,country_code,region,province,city_municipality,barangay,street_address,postal_code,formatted_address,location)
values
('ASEED0001','PH','NCR','Metro Manila','Taguig','Fort Bonifacio','26th St','1634','26th St, BGC, Taguig', ST_SetSRID(ST_MakePoint(121.0463,14.5491),4326)::geography),
('ASEED0002','PH','NCR','Metro Manila','Makati','Bel-Air','Makati Ave','1227','Makati Ave, Bel-Air, Makati', ST_SetSRID(ST_MakePoint(121.0244,14.5546),4326)::geography),
('ASEED0003','PH','NCR','Metro Manila','Quezon City','Loyola Heights','Katipunan Ave','1108','Katipunan Ave, QC', ST_SetSRID(ST_MakePoint(121.0769,14.6362),4326)::geography)
on conflict (id) do nothing;

insert into listing(
  id,status,intent,property_type,price_amount,price_currency,price_frequency,
  beds,baths,floor_area_sqm,lot_area_sqm,year_built,address_id,location,source,published_at
) values
('LSEED0001','active','sale','condo',12500000,'PHP','one_time',2,2,72,null,2018,'ASEED0001',ST_SetSRID(ST_MakePoint(121.0463,14.5491),4326)::geography,'manual',now()),
('LSEED0002','active','rent','condo',65000,'PHP','monthly',1,1,40,null,2020,'ASEED0002',ST_SetSRID(ST_MakePoint(121.0244,14.5546),4326)::geography,'manual',now()),
('LSEED0003','active','sale','house',18500000,'PHP','one_time',4,3,220,180,2010,'ASEED0003',ST_SetSRID(ST_MakePoint(121.0769,14.6362),4326)::geography,'manual',now())
on conflict (id) do nothing;

COMMIT;
`;

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized:false } });
  await c.connect();
  try {
    await c.query(sql);
    console.log("DB schema + seed applied ✅");
  } catch (e) {
    console.error("DB apply error:", e.message);
    process.exit(1);
  } finally {
    await c.end();
  }
})();

