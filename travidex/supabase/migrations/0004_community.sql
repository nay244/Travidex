create table community_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_id uuid references cities(id) on delete set null,
  name text not null,
  type_tags text[] not null default '{}',
  about text,
  hint text,
  access text,
  size text,
  busyness text,
  reference_photo text,
  location geography(point, 4326) not null,
  status text not null default 'pending',
  reject_reason text,
  moderated_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index community_user_idx on community_submissions(user_id);
create index community_status_idx on community_submissions(status);
