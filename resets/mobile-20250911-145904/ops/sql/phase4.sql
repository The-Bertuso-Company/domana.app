create extension if not exists pgcrypto;

do $$
begin
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
    create type price_frequency as enum ('total','monthly');
  end if;
end
$$;

create table if not exists owner (
  id text primary key,
  full_name_or_entity text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists listing (
  id text primary key,
  status listing_status not null default 'active',
  intent listing_intent not null default 'sale',
  property_type property_type not null default 'house',
  price_amount numeric,
  price_currency text default 'PHP',
  price_frequency price_frequency default 'total',
  beds int,
  baths int,
  floor_area_sqm numeric,
  lot_area_sqm numeric,
  published_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

create or replace function enc_key(p_text text, p_key text) returns bytea
language sql stable strict as $$ select pgp_sym_encrypt(p_text, p_key) $$;

create or replace function dec_key(p_bytes bytea, p_key text) returns text
language sql stable strict as $$ select pgp_sym_decrypt(p_bytes, p_key) $$;

create or replace view owner_secure as
  select id, full_name_or_entity, contact_email, contact_phone from owner;

create or replace view owner_public as
  select
    id,
    case when contact_email is null then null
         else regexp_replace(contact_email, '(^.).+(@.*$)', '\1***\2') end as contact_email,
    case when contact_phone is null then null
         else regexp_replace(contact_phone, '(.{0,3}).*(.{2})$', '\1****\2') end as contact_phone
  from owner;

insert into owner (id, full_name_or_entity, contact_email, contact_phone)
values ('OWNER_DEV001','Dev Owner','dev.owner@example.com','+639171234567')
on conflict (id) do nothing;

select dec(enc('ok'))='ok' as crypto_ok;