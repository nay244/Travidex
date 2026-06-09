create table sights (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  dex_no int not null,
  name text not null,
  type_tags text[] not null default '{}',
  reference_photo text,
  about text,
  hint text,
  access text,
  size text,
  busyness text,
  location geography(point, 4326) not null,
  source text not null default 'curated',
  created_at timestamptz not null default now(),
  unique (city_id, dex_no)
);
create index sights_city_idx on sights(city_id);
create index sights_location_idx on sights using gist (location);
