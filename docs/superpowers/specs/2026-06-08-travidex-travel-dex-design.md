# Travidex — Travel "Dex" Companion — Design Spec

**Date:** 2026-06-08
**Status:** Approved design — ready for implementation planning
**Platform:** iOS only (first iteration)
**Domain:** travidex.com
**Repository:** https://github.com/nay244/Travidex.git

---

## 1. Concept

Travidex is a travel companion app that fuses two loops:

- **Geocaching's "go find it" loop** — navigate to a real-world point of interest and log it.
- **A Pokédex of places** — a browsable, fillable index of sights/experiences, where the goal is to "complete" the world one city and country at a time.

The user travels through a country, discovers individual **sights** (the collectible "dex entries"), logs them, and watches the map and an OSRS-Tileman-style **country chunk-map** fill in as they claim cities.

---

## 2. Goals / Non-Goals

### Goals (v1)
- iOS app where users browse and find curated sights, organized World › Country › City › Sight.
- Honor-system logging of finds with comments and personal photos.
- A map home (all sights as pins) + draggable dex sheet.
- A country **chunk-map** that visualizes city completion (free exploration).
- Community: user-submitted sights (moderated) + a finds feed.
- Gamification: completion %, find count, badges, photo-journal/passport.
- Auth: Sign in with Apple + email/password.

### Non-Goals (deferred)
- Android (revisit after iOS; same RN codebase).
- Leaderboards (depends on accounts; easy to add later).
- In-app compass mode (may fold into Walking navigation later).
- Tileman "challenge mode" / adjacency gating (chosen against — free exploration only).
- Tiles-*within*-a-city subdivision (chunks are cities only for v1).
- Photo/image recognition for verifying finds.
- Proximity-gated or location-verified finds (chosen against — honor system).

---

## 3. Core Concepts & Terminology

| Term | Meaning |
|------|---------|
| **Sight** | The collectible dex entry: a landmark, viewpoint, experience, or food spot. Belongs to a city. |
| **Find** | A user's honor-system log of a sight (comment + optional photos). Drives the feed and completion. |
| **Claim** | A city is "claimed" (green/complete) when the user has found **100%** of its sights. |
| **Chunk** | A major city represented as a tile on the country chunk-map. |
| **Hierarchy** | World › Country › City › Sight. Completion is tracked at city, country, and world levels. |

---

## 4. Navigation — Five Tabs

### 🗺️ Map (home)
- Apple Maps view (`react-native-maps`) scoped to the user's current city (auto-detected if location is on; otherwise manually chosen).
- **Every** sight is a pin. **Bright** = found, **dimmed** = unseen. (No fog of war.)
- Draggable **Dex bottom sheet** over the map: completion header (e.g., "PARIS · 3 of 40"), search, sortable list of sights. Swipe down to minimize and reveal the full map.
- Pin ⇄ row focus sync: tapping a dex row focuses its pin; tapping a pin highlights its row.
- Tapping a sight → **Sight Detail**.

### 🧭 Explore (passport)
- Browse World → Country → City, each showing completion %.
- The **Country view is the chunk-map** (see §6).
- Search any place; open a city's Map+Dex.
- Supports pre-trip planning (browse a city before going — all entries are visible/dimmed).

### ⊕ Find (center capture button)
- Camera capture flow; pick the nearby sight being logged (or it's launched pre-filled from a sight's Log button).
- Produces a **find** + optional **user photo(s)**. Honor system — no location requirement.

### 👥 Community
- **Finds feed**: recent finds, comments/likes.
- **Submit a sight** form (name, photo, location, type tags) → enters the moderation pipeline.
- View your submissions and their status.
- Browse approved community sights.

### 👤 Profile
- Find count + completion at city/country/world.
- **Badges** grid (achievements).
- **Photo journal / passport** — auto-laid-out scrapbook of finds + photos per city/country.
- Settings: auth/account, location toggle (optional), etc.

---

## 5. Key Screens

### Sight Detail (the dex entry)
- **Hero:** curated **reference photo** ("what to look for / photograph") + found/❤️ badges.
- Title · dex number · city · **type tags** (e.g., Historic, Scenic, Icon).
- **Stats strip:** Access · Size · Busyness (the geocaching Difficulty/Terrain/Size analog).
- **Buttons:** Navigate · **Log find** (gold/primary).
- **Find hint** (geocaching-style clue).
- **About** — curated description + facts.
- **Your photos** — gallery of the user's own photos of this sight.
- **Recent finds (community)** — feed of who found it.

### Navigate screen
- Mode tabs:
  - **Walking** — in-app route drawn on the map from the user to the sight (requires location).
  - **Driving** — hand off to the user's external map app (Apple/Google/Waze) via a maps URL (works even with our location off).
- Distance + ETA. (Compass arrow deferred; may fold into Walking later.)

### Log find sheet
- Comment field, or one-tap default **"Found!"**.
- Optional add photo(s).
- Posts to the feed as **"[user] found this on [date]"**, updates completion, may unlock a badge.

### Auth screens
- **Sign in with Apple** (native button via `expo-apple-authentication`).
- **Email + password** register / login (any email host), with email confirmation and password reset.
- First-run: set username + avatar.

---

## 6. Country Chunk-Map (OSRS Tileman twist)

Inspired by Explv's OSRS region-grid map and the Tileman challenge, the **Country view** renders each major city as a **chunk** on a stylized board.

- **Free exploration only** — every chunk is always visible and openable; visit cities in any order. No adjacency gating, no challenge mode.
- Each chunk shows a **live fill %** based on sights found in that city.
- A chunk turns fully **claimed (green)** at **100%** of its sights.
- States: claimed (green), in-progress (amber, partial fill), untouched (dim).
- Country header shows aggregate progress (e.g., "JAPAN · 2 of 9 cities claimed · 80/140 sights").
- **Implementation:** colored territory polygons per city via `react-native-maps` overlays, or a stylized board view. Each country defines its set of major-city chunks (e.g., Japan → Tokyo, Yokohama, Kawasaki, Nagoya, Kyoto, Osaka, Kobe, Sapporo, Fukuoka).

---

## 7. Progression & Gamification (v1)

- **Completion %** at city/country/world — derived from `finds` vs `sights`.
- **Find count** — total sights found.
- **Badges / achievements** — milestone-based (e.g., first find, 10 sights, first city claimed, N countries explored).
- **Photo journal / passport** — generated from the user's finds + photos.
- All derived from `finds` and `sights`; no redundant counters to keep in sync.

---

## 8. Data Model (Supabase / Postgres + PostGIS)

Legend: 🟢 curated content · 🔵 per-user data · 🟠 community pipeline

| Table | Key fields | Notes |
|-------|-----------|-------|
| 🟢 `countries` | id, name, code | Completion derived |
| 🟢 `cities` | id, country_id, name, center (geography) | A city = a chunk; completion derived |
| 🟢 `sights` | id, city_id, dex_no, name, type_tags[], reference_photo, about, hint, access, size, busyness, location (geography point), source | The curated catalog (canonical dex). `source` distinguishes curated vs approved-community. |
| 🔵 `profiles` | user_id (→ auth.users), username, avatar | |
| 🔵 `finds` | id, user_id, sight_id, comment, found_at | Honor log. Powers feed + completion. |
| 🔵 `user_photos` | id, user_id, sight_id, photo_url, created_at | The "Your photos" gallery. |
| 🔵 `user_badges` | user_id, badge_code, earned_at | |
| 🟠 `community_submissions` | id, user_id, proposed sight fields, location, status (pending/approved/rejected), moderated_by | On approval, becomes a `sight`. |

- **Geo-queries** (sights near me / within a city) use PostGIS.
- **Completion, find count, badges** are computed from `finds` vs `sights`.
- **Row-Level Security** governs per-user data and the moderation pipeline.

---

## 9. Architecture

### Client — iOS app (Expo / React Native + TypeScript)
- `react-native-maps` (Apple Maps) — map, pins, territory polygons.
- `expo-camera` — capture for finds.
- `expo-location` — **optional**; used only for map centering, Walking navigation, and distances.
- `expo-apple-authentication` — native Sign in with Apple button.
- `supabase-js` — data, auth, storage.

### Backend — Supabase
- **Auth:** Sign in with Apple + email/password (confirmation + reset).
- **Postgres + PostGIS:** relational catalog + per-user data + geo-queries.
- **Storage:** photo buckets (curated reference photos; user photos).
- **Row-Level Security:** access control + moderation.
- **Edge Function:** moderation actions / notifications.

### Reusable components
SightPin · SightCard/Row · CompletionBar · BottomSheet · PhotoUploader (compress → Storage) · BadgeChip · TypeTag · FindFeedItem.

---

## 10. Location & Navigation Behavior

- **Location is optional, never mandatory.** The app is fully usable without it (browse, log finds, driving directions).
- Location, when granted, enables: map auto-centering, distances, and Walking navigation.
- **Logging is honor-system** — no proximity check, no verification badge.
- **Navigation:** Walking (in-app route, needs location) + Driving (external handoff, no location needed).

---

## 11. Community & Moderation

- Users submit new sights via the Community tab; submissions enter `community_submissions` as `pending`.
- A moderation step (Edge Function / admin review) approves or rejects.
- Approved submissions become `sights` (flagged by `source`) and join the findable catalog.
- The curated official catalog remains the canonical dex; community content is additive.

---

## 12. Key User Flows

1. **Discover & log:** Open Map → see dimmed pins for the current city → tap a sight → read reference photo + hint → Navigate (Walking/Driving) → on arrival tap **Log find** → comment or "Found!" + optional photo → entry brightens, completion ticks up, feed updates, badge may unlock.
2. **Plan a trip:** Explore → pick Country → chunk-map → open a city → browse its dimmed dex before traveling.
3. **Claim a city:** Find all sights in a city → its chunk turns green on the country chunk-map.
4. **Contribute:** Community → Submit a sight (name, photo, location, tags) → pending → approved → becomes findable.
5. **Sign up:** Sign in with Apple or email/password → set username + avatar.

---

## 13. Constraints & Non-Functional Notes

- **Supabase free tier:** 50k MAU (ample), 500 MB Postgres (ample), **1 GB Storage / 50 MB per file** (the binding limit), 5 GB egress, projects pause after 1 week idle.
- **Photo strategy:** compress images client-side before upload; Pro plan ($25/mo: 8 GB DB, 100 GB storage) is the upgrade path.
- **App Store:** email/password does not trigger guideline 4.8; Sign in with Apple is included regardless, keeping the app compliant.

---

## 14. Open Questions / Future

- Seeding the initial curated catalog (which countries/cities ship first, and how content is authored).
- Badge catalog definition (exact achievements + criteria).
- Passport/journal layout and sharing format.
- Moderation tooling (admin UI vs. lightweight dashboard).
- Future: Android, leaderboards, in-app compass, intra-city tiles, image-recognition finds.
