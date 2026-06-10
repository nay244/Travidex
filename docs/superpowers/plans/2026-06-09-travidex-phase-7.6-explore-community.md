# Travidex Phase 7.6 — Explore & Community Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the Claude Design handoff (design kit `CHANGELOG.md`, flow doc §3.5–§3.7.1): Explore gets a country pill + picker, two-tier boards (cities vs states drilldown), an upgraded Pokédex-style Region Dex (search/sort, type chips, favorites), and the new Region Highlights share card; Community is rebuilt as **Friends** + **Hidden gems** tabs backed by the §3.7.1 gems pipeline (status workflow, favorites, reports, moderators, audit log).

**Architecture:** Backend-first per area. Explore: `countries.tier` column + a `favorites` table; states derive from `cities.region` grouping (no states table — matches design note). Highlights composes the user's existing `user_photos` for a city's found sights; card → image via `react-native-view-shot` + `expo-sharing`. Community: `friendships` (one-way add), gems pipeline tables/triggers/RLS verbatim from §3.7.1, `get_feed` re-scoped to friends+self, all three gem sorts served by one `gems_for_city` RPC (client sorts; per-city volumes are small). Old "Submit a sight" buttons leave the Community tab (screens/routes remain).

**Tech Stack:** TypeScript, Supabase (SQL/RLS/triggers/RPC, Storage `gem-photos` bucket, Deno edge fn), expo-image-picker (installed), react-native-view-shot + expo-sharing (new), Jest/RNTL.

**Design laws:** tokens only (no hex outside `palette.ts`/`Flag.tsx`); found/earned = full color, unfound/locked = HOLLOW (never opacity); mono for data values; tile semantics green=claimed / amber=in-progress / dim=untouched.

**Deviations decided up front (documented, not drift):**
1. Highlights "Share to friends" (in-app feed post) is DEFERRED — the feed has no post entity yet; v1 ships the system-share path ("Share elsewhere": one Share button via view-shot + expo-sharing). Noted in code comment.
2. Feed like/comment counts remain deferred (prototype-local only).
3. Gems "Nearest" sort uses the active city's center (the location-optional fallback the design specifies) — device geolocation wiring can come later.
4. Edge-function automated checks v1 = text profanity wordlist + geo sanity vs city center; image-safety classification deferred (documented in the function).
5. `country/[id].tsx` city-tile screen is superseded by the tiered Explore board; route removed.

---

## Task list

### Task 1: Explore backend — `countries.tier` + `favorites`
Migration `0011_explore_tier_favorites.sql`:
```sql
alter table countries add column tier text not null default 'cities' check (tier in ('cities','states'));

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
```
`lib/types.ts`: add `tier: 'cities' | 'states'` to `Country`. New `lib/data/favorites.ts`: `getFavoriteSightIds(userId): Promise<Set<string>>`, `setFavorite(userId, sightId, on: boolean)` (insert / delete-eq-eq). Mocked tests per repo pattern.

### Task 2: Explore board rework — pill, CountryPicker, tiered tiles, state drilldown
`app/(tabs)/explore.tsx` becomes the board (§3.5): top pill (Flag + country **code**) → new `components/CountryPicker.tsx` (modal sheet modeled on LocationPicker's countries view: flag + name + `found/total sights` from `getCountryProgress`, active ring). Selected country state local to Explore (default = first country). Board: tier `cities` → city `ChunkTile`s → `/city/<id>`; tier `states` → state tiles (group `getCitiesForCountry` rows by `region`, aggregate progress) → in-screen drilldown to that state's city tiles with breadcrumb `‹ {country} · all states`. Tile semantics via existing chunk tokens. Remove `app/country/[id].tsx` + its test (superseded; explore no longer routes there).

### Task 3: Region Dex upgrade — `app/city/[id].tsx` + `SightRow`
§3.6: header (city name + `found/total` mono), search field (reuse `filterSights`), dex-order list (`sortSights`). `SightRow` upgraded (backward-compatible optional props): type chips from `type_tags` (small bordered chips, type-tinted text), favorite heart top-right (`onToggleFavorite?`, `favorited?` — ♥ filled `t.colors.danger`-ish? NO: per design language favorites use amber accent → `t.colors.amber` filled / hollow `t.colors.text3` outline glyph `♡/♥`), `#NNN` mono bottom-right, found thumb = `foundBg` block vs hollow box. City screen wires favorites via `lib/data/favorites.ts`. Sparkles `✨` header button → `/highlights/<cityId>`.

### Task 4: Region Highlights — `app/highlights/[cityId].tsx`
§3.6.1: data = found sights of the city (`useCityCatalog`) + `getUserPhotos` filtered to those sight ids. Card (4:5, captured via `react-native-view-shot`): photo mosaic (first photo 2×2 in a 3-col grid), header strip (Flag + city + MY HIGHLIGHTS), footer (wordmark TRAVIDEX + `{found}/{total} SIGHTS · {MON YYYY}`), scrim overlays (semi-transparent Views). Selection grid (4-col, all selected by default, toggle = green ring/check vs dim EXCEPTION: excluded selection-state may dim — it is a selection control, not found-state), `N OF M SELECTED`, 0 selected disables share + shows message. Share button → `captureRef` → `expo-sharing.shareAsync`. Empty state when no found sights. Install: `npx expo install react-native-view-shot expo-sharing`.

### Task 5: Community backend — friendships + gems pipeline (§3.7.1)
Migration `0012_friends_gems.sql` (verbatim core):
```sql
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
-- favs_count trigger (insert/delete on gem_favorites); report trigger increments report_count
-- and at >= 3 sets status='hidden' + inserts a moderation_log row ('auto_hide').
-- RLS: gems select (status='approved') or (author_id=auth.uid()) or moderator; insert own
-- with check (author_id=auth.uid() and status='pending'); no client update/delete policies.
-- gem_favorites/gem_reports: insert/delete own, select to authenticated (favorites counts are public via favs_count).
-- moderators: select own row only. moderation_log: no client policies (service-role only).
-- Storage: public bucket 'gem-photos' + owner-prefix write policies (mirror 0009).
```
Plus RPCs (security/search_path hardened like prior RPCs): `friends_overview(p_user uuid)` → friend_id, username, sights_count (finds count), last_find (latest sight name); `gems_for_city(p_city uuid, p_user uuid)` → approved gems for the city UNION the user's own pending ones, with `faved boolean` (exists in gem_favorites for p_user), `distance_m` from city center, ordered approved_at desc nulls first. EDIT `0008_feed_rpc.sql` in place: `get_feed(p_user uuid)` now filters finds to `user_id = p_user or user_id in (select friend_id from friendships where user_id = p_user)`.

### Task 6: Data wrappers — friends, gems, feed
`lib/data/friends.ts`: `getFriendsOverview(userId)` (rpc), `searchProfiles(q)` (profiles ilike username, limit 10, exclude self), `addFriend(userId, friendId)`, `removeFriend(userId, friendId)`. `lib/data/gems.ts`: `Gem` type; `getGemsForCity(cityId, userId)` (rpc), `setGemFavorite(userId, gemId, on)`, `reportGem(userId, gemId, reason?)`, `submitGem(userId, { name, note, cityId, lat, lng, blob, fileName })` (upload to `gem-photos` owner path → insert pending). `lib/data/feed.ts`: `getFeed(userId)` passes p_user. Mocked tests for each.

### Task 7: Community rework — tabs + Friends
`app/(tabs)/community.tsx`: segmented control `Friends | Hidden gems` (amber active, §3.7). Friends tab = "Your friends" row (count + ›) → `/community/friends` page (search field filters local list AND `searchProfiles` for adds; green "Add a friend" action per result; rows: name @handle, last find, green mono sights count; remove support optional v1: skip) + the finds feed below (now friends-scoped via `getFeed(userId)`). Old Submit-a-sight / My-submissions buttons removed from this screen (routes/files stay).

### Task 8: Hidden gems tab + ShareGem
Gems tab (in `community.tsx` or extracted `components/GemsTab.tsx`): subtitle `Hidden gems near {city} — spotted by travelers, not yet in the dex.` (city via `useCity` + `useActiveCity`), amber "Share a hidden gem" button → `/community/share-gem` screen; sort segmented (Most favorited / Newest / Nearest — client-side over RPC rows: favs_count desc / approved_at desc / distance_m asc); cards: photo (Image), name, `BY {author} · X.X KM · {date}` mono meta, note, star chip `★ N` (toggle via `setGemFavorite`, amber when faved), Report → confirm → `reportGem` → card shows `Reported · under review` (local state); own pending gems pinned top with amber `IN REVIEW` badge, no star. `app/community/share-gem.tsx` (§3.7 ShareGem): photo required (expo-image-picker, tap box), name (≥3 chars), note, auto location chip (Flag + city, not editable), blue guidelines card (`info`/`infoBg` tokens, the 4 bullet rules), Submit disabled until photo+name → `submitGem` → submitted-state ("Submitted for review", amber, ~24h copy) → Done → back.

### Task 9: gems-check edge function + final verification
`supabase/functions/gems-check/index.ts` (Deno; service-role; designed to be wired as a database webhook on gems insert — document in header comment): fetch the gem row, run v1 checks — name+note against a small profanity wordlist; geo sanity = gem point within 50 km of its city center (PostGIS query via service client). Hard fail → `status='rejected'` + `rejection_reason` + moderation_log row; pass → leave pending + log 'auto_checked'. Then: FULL `npx jest --runInBand --silent` + `npx tsc --noEmit`; fix any cross-task fallout.

---

## Definition of Done
- Full suite green (`--runInBand`), tsc clean (supabase/ stays excluded).
- Explore: pill + picker switch countries; France (cities tier) shows city tiles → Region Dex; a states-tier country drills country→state→city; tiles use claim semantics.
- Region Dex: search, dex-order rows with chips/heart/#, favorites persist; ✨ opens Highlights; Highlights selects photos and shares a captured card; empty state correct.
- Community: Friends tab (friends page: search/add; feed friends-scoped) + Hidden gems tab (sorts, star, report, IN REVIEW pin) + ShareGem flow per spec; gems pipeline SQL + edge function statically reviewed.
- Deploy-blockers tracked: migrations 0011/0012 + edited 0008 in the pending `supabase db push`; `gem-photos` bucket; `gems-check` webhook wiring; moderator seeding.
