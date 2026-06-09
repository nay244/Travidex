create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table finds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sight_id uuid not null references sights(id) on delete cascade,
  comment text,
  found_at timestamptz not null default now(),
  unique (user_id, sight_id)
);
create index finds_sight_idx on finds(sight_id);
create index finds_user_idx on finds(user_id);

create table user_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sight_id uuid not null references sights(id) on delete cascade,
  photo_url text not null,
  created_at timestamptz not null default now()
);
create index user_photos_sight_idx on user_photos(sight_id, user_id);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_code text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_code)
);
