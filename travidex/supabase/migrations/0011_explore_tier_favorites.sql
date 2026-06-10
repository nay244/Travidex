-- Two-tier explore boards: 'cities' countries show city tiles; 'states' countries
-- drill country -> state (cities.region) -> city.
alter table countries add column tier text not null default 'cities' check (tier in ('cities','states'));

-- Per-user sight favorites (Region Dex heart).
create table favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  sight_id uuid not null references sights(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, sight_id)
);
alter table favorites enable row level security;
create policy "favorites read own" on favorites for select to authenticated using (user_id = auth.uid());
create policy "favorites insert own" on favorites for insert to authenticated with check (user_id = auth.uid());
create policy "favorites delete own" on favorites for delete to authenticated using (user_id = auth.uid());
