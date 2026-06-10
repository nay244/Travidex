-- Friends: one-way "added" relationships (a row = user_id follows friend_id).
create table friendships (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, friend_id),
  check (user_id <> friend_id)
);
alter table friendships enable row level security;
create policy "friends read own" on friendships for select to authenticated using (user_id = auth.uid());
create policy "friends insert own" on friendships for insert to authenticated with check (user_id = auth.uid());
create policy "friends delete own" on friendships for delete to authenticated using (user_id = auth.uid());

-- Hidden gems pipeline (flow doc 3.7.1).
create table gems (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  note text,
  photo_url text not null,
  location geography(point, 4326) not null,
  city_id uuid not null references cities(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected','hidden')),
  favs_count int not null default 0,
  report_count int not null default 0,
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  approved_at timestamptz,
  rejection_reason text
);

create table gem_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  gem_id uuid not null references gems(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, gem_id)
);

create table gem_reports (
  user_id uuid not null references auth.users(id) on delete cascade,
  gem_id uuid not null references gems(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (user_id, gem_id)
);

create table moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','moderator'))
);

create table moderation_log (
  id uuid primary key default gen_random_uuid(),
  gem_id uuid not null references gems(id) on delete cascade,
  actor uuid references auth.users(id),
  action text not null,
  reason text,
  at timestamptz not null default now()
);

-- favs_count denormalization.
create or replace function gem_favs_sync() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update gems set favs_count = favs_count + 1 where id = new.gem_id;
    return new;
  else
    update gems set favs_count = greatest(favs_count - 1, 0) where id = old.gem_id;
    return old;
  end if;
end;
$$;
create trigger gem_favorites_sync after insert or delete on gem_favorites
  for each row execute function gem_favs_sync();

-- Reports: count + auto-hide at threshold (3), with audit row.
create or replace function gem_report_sync() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update gems set report_count = report_count + 1 where id = new.gem_id;
  update gems set status = 'hidden'
    where id = new.gem_id and report_count >= 3 and status = 'approved';
  if found then
    insert into moderation_log (gem_id, actor, action, reason)
    values (new.gem_id, null, 'auto_hide', 'report threshold reached');
  end if;
  return new;
end;
$$;
create trigger gem_reports_sync after insert on gem_reports
  for each row execute function gem_report_sync();

-- RLS.
alter table gems enable row level security;
create policy "gems read approved or own or mod" on gems for select to authenticated
  using (status = 'approved' or author_id = auth.uid()
         or exists (select 1 from moderators m where m.user_id = auth.uid()));
create policy "gems insert own pending" on gems for insert to authenticated
  with check (author_id = auth.uid() and status = 'pending');
-- no client update/delete policies: status transitions are moderator/service-role only.

alter table gem_favorites enable row level security;
create policy "gem favs read" on gem_favorites for select to authenticated using (true);
create policy "gem favs insert own" on gem_favorites for insert to authenticated with check (user_id = auth.uid());
create policy "gem favs delete own" on gem_favorites for delete to authenticated using (user_id = auth.uid());

alter table gem_reports enable row level security;
create policy "gem reports insert own" on gem_reports for insert to authenticated with check (user_id = auth.uid());
create policy "gem reports read own" on gem_reports for select to authenticated using (user_id = auth.uid());

alter table moderators enable row level security;
create policy "moderators read self" on moderators for select to authenticated using (user_id = auth.uid());

alter table moderation_log enable row level security;
-- no client policies: service-role only.

-- Storage bucket for gem photos (public read via CDN; owner-prefix writes).
insert into storage.buckets (id, name, public)
values ('gem-photos', 'gem-photos', true)
on conflict (id) do nothing;
create policy "gem-photos read" on storage.objects for select to authenticated
  using (bucket_id = 'gem-photos');
create policy "gem-photos insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'gem-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- RPC: friends overview (friend rows for the Friends page).
create or replace function friends_overview(p_user uuid)
returns table (friend_id uuid, username text, sights_count bigint, last_find text)
language sql stable
set search_path = public
as $$
  select f.friend_id,
         p.username,
         (select count(*) from finds fi where fi.user_id = f.friend_id) as sights_count,
         (select s.name from finds fi join sights s on s.id = fi.sight_id
            where fi.user_id = f.friend_id order by fi.found_at desc limit 1) as last_find
  from friendships f
  join profiles p on p.user_id = f.friend_id
  where f.user_id = p_user
  order by p.username asc
$$;

-- RPC: gems for a city — approved ones plus the caller's own pending, with fave state + distance from city center.
create or replace function gems_for_city(p_city uuid, p_user uuid)
returns table (
  id uuid, author_id uuid, author_name text, name text, note text, photo_url text,
  lat double precision, lng double precision, status text,
  favs_count int, created_at timestamptz, approved_at timestamptz,
  faved boolean, distance_m double precision
)
language sql stable
set search_path = public, extensions
as $$
  select g.id, g.author_id, p.username as author_name, g.name, g.note, g.photo_url,
         st_y(g.location::geometry) as lat, st_x(g.location::geometry) as lng, g.status,
         g.favs_count, g.created_at, g.approved_at,
         exists (select 1 from gem_favorites gf where gf.gem_id = g.id and gf.user_id = p_user) as faved,
         st_distance(g.location, (select c.center from cities c where c.id = p_city)) as distance_m
  from gems g
  join profiles p on p.user_id = g.author_id
  where g.city_id = p_city
    and (g.status = 'approved' or (g.status = 'pending' and g.author_id = p_user))
  order by (g.status = 'pending' and g.author_id = p_user) desc, g.approved_at desc nulls last
$$;

-- Friends-scoped feed (replaces 0008 definition).
-- 0008 created get_feed(p_limit) before friendships existed; we redefine it here
-- now that friendships is available so the function can reference it at parse time.
drop function if exists get_feed(int);
create or replace function get_feed(p_user uuid, p_limit int default 30)
returns table(id uuid, comment text, found_at timestamptz, sight_name text, username text, city_name text)
language sql stable
set search_path = public
as $$
  select f.id, f.comment, f.found_at, s.name as sight_name, p.username, c.name as city_name
  from finds f
  join sights s on s.id = f.sight_id
  left join profiles p on p.user_id = f.user_id
  left join cities c on c.id = s.city_id
  where f.user_id = p_user
     or f.user_id in (select friend_id from friendships where user_id = p_user)
  order by f.found_at desc
  limit p_limit;
$$;

-- Geo sanity helper for the gems-check function: is the gem within p_max_m of its city center?
create or replace function gem_geo_sane(p_gem uuid, p_max_m double precision)
returns boolean
language sql stable
set search_path = public, extensions
as $$
  select st_dwithin(g.location, c.center, p_max_m)
  from gems g join cities c on c.id = g.city_id
  where g.id = p_gem
$$;
