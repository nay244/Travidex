create extension if not exists postgis;

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  region text,
  center geography(point, 4326),
  created_at timestamptz not null default now()
);
create index cities_country_idx on cities(country_id);
