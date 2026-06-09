# Travidex Phase 2 — Data Layer & Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the full Supabase schema (catalog + per-user + community tables) with PostGIS and RLS, seed one real city, and expose a typed, unit-tested data-access layer the UI phases build on.

**Architecture:** Schema lives in `supabase/migrations/*.sql` (source of truth, applied via the Supabase CLI). RLS makes the catalog world-readable and per-user rows owner-only. A PostGIS RPC powers "sights near me". Thin TS modules in `lib/data/` wrap `supabase-js` and are unit-tested against a mocked client; migrations/seed are verified by applying them to a local Supabase and asserting row counts.

**Tech Stack:** Supabase CLI, Postgres 15 + PostGIS, SQL, TypeScript, Jest (mocked `supabase`).

**CLAUDE.md compliance:** schema includes only what the spec needs (no speculative columns/tables); per-user write access is owner-scoped; every TS wrapper has a failing-test-first.

---

## Theming (REQUIRED)

This phase is mostly SQL + data-access (no UI color), but any UI it touches follows `2026-06-08-travidex-theming-contract.md`: colors/type/spacing via `useTheme()`, never hardcoded hex.

---

## File Structure

```
travidex/
├─ supabase/
│  ├─ config.toml                 # created by `supabase init`
│  ├─ migrations/
│  │  ├─ 0001_extensions_geo.sql   # postgis + countries + cities
│  │  ├─ 0002_sights.sql
│  │  ├─ 0003_user_tables.sql      # profiles, finds, user_photos, user_badges
│  │  ├─ 0004_community.sql        # community_submissions
│  │  ├─ 0005_rls.sql              # all policies
│  │  └─ 0006_rpc_near.sql         # sights_near() PostGIS function
│  └─ seed.sql                     # one seeded city + sights
├─ lib/
│  ├─ types.ts                     # row types matching schema
│  └─ data/
│     ├─ catalog.ts                # countries/cities/sights reads
│     ├─ finds.ts                  # log + read finds, completion counts
│     └─ __tests__/
```

---

### Task 1: Initialize Supabase locally

**Files:** Create `supabase/` (via CLI)

- [ ] **Step 1: Init**

```bash
cd travidex
npm i -D supabase
npx supabase init
npx supabase start
```
Expected: local stack boots; CLI prints API URL + anon key.

- [ ] **Step 2: Point `.env` at local stack for dev**

Update `.env` with the printed local `API URL` and `anon key` (keep the cloud values in a comment for later).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: init local supabase"
```

---

### Task 2: Geo extension, countries, cities

**Files:** Create `supabase/migrations/0001_extensions_geo.sql`

- [ ] **Step 1: Write the migration**

```sql
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
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: reset runs all migrations with no errors; `countries` and `cities` exist (CLI prints applied migrations).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): postgis, countries, cities"
```

---

### Task 3: Sights

**Files:** Create `supabase/migrations/0002_sights.sql`

- [ ] **Step 1: Write the migration**

```sql
create table sights (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  dex_no int not null,
  name text not null,
  type_tags text[] not null default '{}',
  reference_photo text,
  about text,
  hint text,
  access text,        -- e.g. 'Easy'
  size text,          -- e.g. 'Large'
  busyness text,      -- e.g. 'Busy'
  location geography(point, 4326) not null,
  source text not null default 'curated',  -- 'curated' | 'community'
  created_at timestamptz not null default now(),
  unique (city_id, dex_no)
);
create index sights_city_idx on sights(city_id);
create index sights_location_idx on sights using gist (location);
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: no errors; `sights` table + GiST index created.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): sights table with geo index"
```

---

### Task 4: User tables (profiles, finds, user_photos, user_badges)

**Files:** Create `supabase/migrations/0003_user_tables.sql`

- [ ] **Step 1: Write the migration**

```sql
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
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: tables created, no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): profiles, finds, user_photos, user_badges"
```

---

### Task 5: Community submissions

**Files:** Create `supabase/migrations/0004_community.sql`

- [ ] **Step 1: Write the migration**

```sql
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
  status text not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  reject_reason text,
  moderated_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index community_user_idx on community_submissions(user_id);
create index community_status_idx on community_submissions(status);
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: table created.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): community_submissions"
```

---

### Task 6: Row-Level Security policies

**Files:** Create `supabase/migrations/0005_rls.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Catalog: world-readable to authenticated users, no client writes.
alter table countries enable row level security;
alter table cities enable row level security;
alter table sights enable row level security;
create policy "catalog read countries" on countries for select to authenticated using (true);
create policy "catalog read cities" on cities for select to authenticated using (true);
create policy "catalog read sights" on sights for select to authenticated using (true);

-- Profiles: public read, owner write.
alter table profiles enable row level security;
create policy "profiles read" on profiles for select to authenticated using (true);
create policy "profiles insert own" on profiles for insert to authenticated with check (user_id = auth.uid());
create policy "profiles update own" on profiles for update to authenticated using (user_id = auth.uid());

-- Finds: public read (feed/completion), owner write.
alter table finds enable row level security;
create policy "finds read" on finds for select to authenticated using (true);
create policy "finds insert own" on finds for insert to authenticated with check (user_id = auth.uid());
create policy "finds delete own" on finds for delete to authenticated using (user_id = auth.uid());

-- User photos: public read, owner write.
alter table user_photos enable row level security;
create policy "photos read" on user_photos for select to authenticated using (true);
create policy "photos insert own" on user_photos for insert to authenticated with check (user_id = auth.uid());
create policy "photos delete own" on user_photos for delete to authenticated using (user_id = auth.uid());

-- Badges: public read, owner insert.
alter table user_badges enable row level security;
create policy "badges read" on user_badges for select to authenticated using (true);
create policy "badges insert own" on user_badges for insert to authenticated with check (user_id = auth.uid());

-- Community submissions: owner + approved are readable; owner inserts (forced pending); owner edits only while pending.
alter table community_submissions enable row level security;
create policy "subs read own or approved" on community_submissions for select to authenticated
  using (user_id = auth.uid() or status = 'approved');
create policy "subs insert own pending" on community_submissions for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
create policy "subs update own pending" on community_submissions for update to authenticated
  using (user_id = auth.uid() and status = 'pending');
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: policies created without error.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): row-level security policies"
```

---

### Task 7: PostGIS "sights near me" RPC

**Files:** Create `supabase/migrations/0006_rpc_near.sql`

- [ ] **Step 1: Write the migration**

```sql
create or replace function sights_near(lat double precision, lng double precision, radius_m double precision)
returns setof sights
language sql stable
as $$
  select *
  from sights
  where st_dwithin(location, st_point(lng, lat)::geography, radius_m)
  order by location <-> st_point(lng, lat)::geography;
$$;
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Expected: function created.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): sights_near PostGIS rpc"
```

---

### Task 8: Seed one city

**Files:** Create `supabase/seed.sql`

- [ ] **Step 1: Write the seed**

```sql
insert into countries (id, name, code) values
  ('11111111-1111-1111-1111-111111111111', 'France', 'FR');

insert into cities (id, country_id, name, region, center) values
  ('22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111', 'Paris', 'Île-de-France',
   st_point(2.3522, 48.8566)::geography);

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location, reference_photo) values
  ('22222222-2222-2222-2222-222222222222', 1, 'Eiffel Tower', '{Historic,Scenic,Icon}',
   'Wrought-iron tower built 1889 for the World''s Fair.', 'Best photo from the Champ de Mars lawn, south side.',
   'Easy', 'Large', 'Busy', st_point(2.2945, 48.8584)::geography, null),
  ('22222222-2222-2222-2222-222222222222', 2, 'Louvre Museum', '{Historic,Culture,Icon}',
   'The world''s most-visited museum, home of the Mona Lisa.', 'Enter via the Carrousel for shorter lines.',
   'Moderate', 'Large', 'Busy', st_point(2.3376, 48.8606)::geography, null),
  ('22222222-2222-2222-2222-222222222222', 3, 'Sainte-Chapelle', '{Historic,Culture}',
   '13th-century royal chapel famed for its stained glass.', 'Go on a sunny morning for the best light.',
   'Easy', 'Medium', 'Moderate', st_point(2.3450, 48.8554)::geography, null);
```

- [ ] **Step 2: Apply and verify counts**

Run: `npx supabase db reset` (re-applies migrations + seed)
Run: `npx supabase db query "select count(*) from sights;"`
Expected: `3`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): seed Paris with 3 sights"
```

---

### Task 9: Row types

**Files:** Create `lib/types.ts`; Test: `lib/data/__tests__/types.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import type { Sight, City, Country, Find } from '../../types';

it('Sight shape compiles with required fields', () => {
  const s: Sight = {
    id: '1', city_id: 'c', dex_no: 1, name: 'X', type_tags: [], reference_photo: null,
    about: null, hint: null, access: null, size: null, busyness: null,
    lat: 0, lng: 0, source: 'curated', created_at: 'now',
  };
  expect(s.name).toBe('X');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- types`
Expected: FAIL — cannot find module `../../types`.

- [ ] **Step 3: Implement**

Create `lib/types.ts`:
```ts
export type Country = { id: string; name: string; code: string; created_at: string };
export type City = { id: string; country_id: string; name: string; region: string | null; lat: number; lng: number };
export type Sight = {
  id: string; city_id: string; dex_no: number; name: string; type_tags: string[];
  reference_photo: string | null; about: string | null; hint: string | null;
  access: string | null; size: string | null; busyness: string | null;
  lat: number; lng: number; source: 'curated' | 'community'; created_at: string;
};
export type Find = { id: string; user_id: string; sight_id: string; comment: string | null; found_at: string };
export type SightWithFind = Sight & { found: boolean };
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- types`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add data row types"
```

---

### Task 10: Catalog data-access

**Files:** Create `lib/data/catalog.ts`; Test: `lib/data/__tests__/catalog.test.ts`

> Note: the DB stores `location`/`center` as geography. Reads use a view-free approach: select `dex_no, ... , st_y(location::geometry) as lat, st_x(location::geometry) as lng`. We assert the wrapper forwards the right table/columns; geo conversion is exercised by the live DB in the seed verification.

- [ ] **Step 1: Write the failing test**

```ts
const order = jest.fn();
const eq = jest.fn(() => ({ order }));
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ select }));
jest.mock('../../supabase', () => ({ supabase: { from } }));

import { getSightsForCity } from '../catalog';

beforeEach(() => jest.clearAllMocks());

it('queries sights for a city ordered by dex_no', async () => {
  order.mockResolvedValue({ data: [{ id: 's1', dex_no: 1, name: 'Eiffel Tower' }], error: null });
  const rows = await getSightsForCity('22222222-2222-2222-2222-222222222222');
  expect(from).toHaveBeenCalledWith('sights');
  expect(eq).toHaveBeenCalledWith('city_id', '22222222-2222-2222-2222-222222222222');
  expect(order).toHaveBeenCalledWith('dex_no', { ascending: true });
  expect(rows[0].name).toBe('Eiffel Tower');
});

it('throws on error', async () => {
  order.mockResolvedValue({ data: null, error: { message: 'boom' } });
  await expect(getSightsForCity('x')).rejects.toThrow('boom');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- catalog`
Expected: FAIL — cannot find module `../catalog`.

- [ ] **Step 3: Implement**

Create `lib/data/catalog.ts`:
```ts
import { supabase } from '../supabase';
import type { Sight } from '../types';

const SIGHT_COLUMNS =
  'id, city_id, dex_no, name, type_tags, reference_photo, about, hint, access, size, busyness, source, created_at, lat:st_y(location::geometry), lng:st_x(location::geometry)';

export async function getSightsForCity(cityId: string): Promise<Sight[]> {
  const { data, error } = await supabase
    .from('sights')
    .select(SIGHT_COLUMNS)
    .eq('city_id', cityId)
    .order('dex_no', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Sight[];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- catalog`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add catalog data-access"
```

---

### Task 11: Finds data-access (log + completion)

**Files:** Create `lib/data/finds.ts`; Test: `lib/data/__tests__/finds.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const insert = jest.fn();
const inFn = jest.fn();
const eqUser = jest.fn(() => ({ in: inFn }));
const selectFinds = jest.fn(() => ({ eq: eqUser }));
const from = jest.fn((table: string) =>
  table === 'finds' ? { insert, select: selectFinds } : {}
);
jest.mock('../../supabase', () => ({ supabase: { from } }));

import { logFind, getFoundSightIds } from '../finds';

beforeEach(() => jest.clearAllMocks());

it('logFind inserts a find row', async () => {
  insert.mockResolvedValue({ error: null });
  await logFind('u1', 's1', 'Found!');
  expect(from).toHaveBeenCalledWith('finds');
  expect(insert).toHaveBeenCalledWith({ user_id: 'u1', sight_id: 's1', comment: 'Found!' });
});

it('getFoundSightIds returns a set of sight ids the user found in a city', async () => {
  inFn.mockResolvedValue({ data: [{ sight_id: 's1' }, { sight_id: 's3' }], error: null });
  const ids = await getFoundSightIds('u1', ['s1', 's2', 's3']);
  expect(eqUser).toHaveBeenCalledWith('user_id', 'u1');
  expect(inFn).toHaveBeenCalledWith('sight_id', ['s1', 's2', 's3']);
  expect(ids).toEqual(new Set(['s1', 's3']));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- finds`
Expected: FAIL — cannot find module `../finds`.

- [ ] **Step 3: Implement**

Create `lib/data/finds.ts`:
```ts
import { supabase } from '../supabase';

export async function logFind(userId: string, sightId: string, comment: string) {
  const { error } = await supabase
    .from('finds')
    .insert({ user_id: userId, sight_id: sightId, comment });
  if (error) throw new Error(error.message);
}

export async function getFoundSightIds(userId: string, sightIds: string[]): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('finds')
    .select('sight_id')
    .eq('user_id', userId)
    .in('sight_id', sightIds);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r: { sight_id: string }) => r.sight_id));
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- finds`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add finds data-access"
```

---

## Phase 2 Done — Definition of Done

- `npx supabase db reset` applies all migrations + seed cleanly; `select count(*) from sights` = 3.
- RLS enabled on every table; catalog world-readable, per-user rows owner-scoped, submissions pending-on-insert.
- `npm test` green; `getSightsForCity`, `logFind`, `getFoundSightIds` unit-tested.
- Types in `lib/types.ts` are the shared contract for Phases 3–7.
