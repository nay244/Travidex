# Travidex — Screen Flow & Component Inventory (for Claude Design)

**Date:** 2026-06-08
**Companion to:** `2026-06-08-travidex-travel-dex-design.md`
**Purpose:** Every screen from launch → in-app, with the components on each, their states, and navigation. Built to hand directly to Claude Design.

---

## Design Foundations (apply to every screen)

- **Theme:** dark UI (near-black `#0d0f14` surfaces, `#12151c` cards, `#1a1d24` insets).
- **Accent semantics (consistent everywhere):**
  - 🟢 **Green** `#2e8b57 / #4ade80` = found / claimed / complete / success
  - 🟠 **Amber/gold** `#c9882b` = in-progress, and the primary **Log find** action
  - 🔵 **Blue** `#8fb6ff` = personal data / info / type tags
  - **Dim/grey** `#3a4150 / #7a8494` = unseen / locked / disabled
- **Type scale:** screen title (H1), section heading (H2), body, label (uppercase small), caption.
- **Core reusable components** (used across many screens — defined once in §C):
  `TabBar` · `NavHeader` · `SightPin` · `SightRow/Card` · `CompletionBar` · `CompletionRing` · `BottomSheet` · `PhotoUploader` · `BadgeChip` · `TypeTag` · `StatTile` · `ChunkTile` · `FindFeedItem` · `PrimaryButton` · `SecondaryButton` · `SearchBar` · `SegmentedControl` · `Avatar` · `EmptyState` · `LoadingSkeleton` · `Toast` · `Modal/Sheet`

---

## Navigation Map (high level)

```
Launch (Splash)
   └─> [auth state?]
        ├─ signed-out ─> Welcome
        │     ├─ Sign in with Apple ─────────────┐
        │     ├─ Continue with Email ─> Sign Up ─> Verify Email ─┐
        │     └─ Log in ─> Login (─> Forgot Password ─> Reset)   │
        │                                                        ▼
        │                                      First-Run Profile Setup (username + avatar)
        │                                                        │
        │                                      Location Priming (optional) ─> (City Picker if denied)
        │                                                        │
        │                                      How-It-Works (3-card intro, skippable)
        │                                                        ▼
        └─ signed-in ───────────────────────────────────> MAIN TAB NAVIGATOR
                                                                 │
   ┌──────────────┬──────────────┬───────────────┬──────────────┬──────────────┐
  Map           Explore        Find (center)   Community       Profile
   │              │              │               │              │
 SightDetail   World           Camera          Feed           Stats Detail
 Navigate      Country(Chunk)  Sight Picker    Submit Sight    Badges
 LogFind       City Preview    Log Composer    Location Picker Photo Journal
 PhotoViewer   Search          Find Success    My Submissions  Settings
                                                Community       Edit Profile
                                                SightDetail
```

---

## A. Onboarding & Auth Flow

### A1 — Splash / Launch
- **Purpose:** brand moment + decide route (auth check).
- **Components:** centered `Logo` wordmark (Travidex), subtle loading indicator.
- **States:** loading → routes to Welcome (signed-out) or Tab Navigator (signed-in).
- **Actions:** none (auto-advance).

### A2 — Welcome
- **Purpose:** value prop + entry to auth.
- **Components:** hero illustration / map-dex visual, app tagline, **3 buttons**: `PrimaryButton "Sign in with Apple"` (native Apple button styling), `SecondaryButton "Continue with Email"`, text link `"Already have an account? Log in"`. Small legal footer (Terms / Privacy links).
- **States:** default; per-button loading; auth error → `Toast`.
- **Actions:** Apple → (new) Profile Setup / (returning) Tab Nav · Email → A3 · Log in → A4.

### A3 — Sign Up (Email)
- **Components:** `NavHeader` (back), `SearchBar`-style inputs: Email field, Password field (show/hide), Confirm Password, password-strength hint, `PrimaryButton "Create account"`, inline validation errors, legal checkbox/consent.
- **States:** empty, validating, field errors, submitting, server error.
- **Actions:** Create → A5 (Verify Email).

### A4 — Log In (Email)
- **Components:** `NavHeader`, Email field, Password field (show/hide), `PrimaryButton "Log in"`, text link `"Forgot password?"`, error banner.
- **States:** default, invalid-credentials error, submitting.
- **Actions:** Log in → Tab Nav · Forgot → A6.

### A5 — Verify Email
- **Components:** illustration, headline "Check your inbox", body w/ user's email, `SecondaryButton "Resend email"`, `"Open mail app"` helper, change-email link.
- **States:** waiting, resent (cooldown timer), verified → auto-advance.
- **Actions:** on verification → A7 (Profile Setup).

### A6 — Forgot / Reset Password
- **Components:** Email field, `PrimaryButton "Send reset link"`, confirmation state; (deep-link target) New Password + Confirm + Save.
- **States:** request, sent, reset-form, success.

### A7 — First-Run Profile Setup
- **Purpose:** create `profiles` record.
- **Components:** `Avatar` picker (upload via `PhotoUploader` or pick default), Username field (with availability check), optional display name, `PrimaryButton "Continue"`.
- **States:** username checking / taken / available, uploading avatar, submitting.
- **Actions:** Continue → A8.

### A8 — Location Priming (optional)
- **Purpose:** explain why location helps before the OS prompt.
- **Components:** illustration, bullet list ("center your map", "walking directions", "distances"), `PrimaryButton "Enable location"` (triggers OS prompt), `SecondaryButton "Not now"` (location stays off — app fully usable).
- **States:** default; if denied/skip → route to A9.
- **Actions:** Enable → OS prompt → A10 · Not now → A9.

### A9 — City Picker (fallback when no location)
- **Components:** `SearchBar`, list/grid of cities (with country labels), recent/popular cities, `SightRow`-style items.
- **States:** search, empty, selecting.
- **Actions:** pick a city → sets active city → A10.

### A10 — How-It-Works (skippable intro)
- **Components:** 3-card horizontal `Carousel` (Find → Log → Fill your dex / claim cities), page dots, `"Skip"`, `PrimaryButton "Start exploring"`.
- **Actions:** → Tab Navigator (Map).

---

## B. Main App — Tab Navigator

Global chrome: **`TabBar`** with 5 items — Map · Explore · **Find (center, raised FAB)** · Community · Profile.

### TAB 1 — MAP

#### B1 — Map Home
- **Purpose:** canonical map + dex sheet for the active city.
- **Components:**
  - Full-bleed `MapView` (Apple Maps) with `SightPin`s (bright=found, dim=unseen) + clustering at zoom-out.
  - Top overlay: `SearchBar` (search sights in city), **City switcher** chip (tap → A9-style picker), filter icon (by type/found state).
  - `RecenterButton` (needs location; disabled state if off).
  - **`BottomSheet` (Dex)** — 3 snap points (peek / half / full):
    - Header: city name + `CompletionBar` ("PARIS · 3 of 40"), drag handle.
    - `SegmentedControl` or sort menu (Distance / Dex # / Found).
    - `SearchBar` (filter list).
    - Scroll list of `SightRow` (thumbnail/ref photo, name, #, found check or dim, distance/status).
  - Pin⇄row focus sync (tap row → camera animates to pin; tap pin → highlights row).
- **States:** loading skeleton, empty (no sights / unsupported city), location-off variant (no distances, no recenter), offline.
- **Actions:** tap pin/row → B2 · City switcher → city change · Find FAB → Tab 3.

#### B2 — Sight Detail
- **Purpose:** the "dex entry."
- **Components (top→bottom):**
  - `Hero` reference photo + overlay badges (`#dex`, found ✓, ❤️ favorites). Caption "Reference — what to look for".
  - Title block: name, city/country, `TypeTag`s.
  - **Stats strip**: `StatTile` ×3 — Access · Size · Busyness (with icon + value).
  - **Action row**: `PrimaryButton "Navigate"` + `LogButton "Log find"` (amber).
  - `HintCard` (collapsible find hint).
  - **About** section (curated description + facts).
  - **Your photos** gallery (horizontal `PhotoThumb` list + add tile) → B5.
  - **Recent finds** (`FindFeedItem` list, "+N this week").
  - Sticky bottom bar on scroll (Navigate / Log) optional.
- **States:** found vs unseen (hero dim + no "your photos"), loading, favorite toggled.
- **Actions:** Navigate → B3 · Log → B4 · photo → B5 · feed item → user/find.

#### B3 — Navigate
- **Components:** `MapView` with route polyline + user marker + destination pin; `SegmentedControl` top tabs **Walking | Driving**; distance + ETA banner; `PrimaryButton`:
  - Walking → in-app route (needs location; if off → inline enable prompt).
  - Driving → `ActionSheet` to choose Apple Maps / Google Maps / Waze (hand-off).
- **States:** location-on/off, route loading, route error, arrived.
- **Actions:** back → B2 · open external app (Driving).

#### B4 — Log Find (sheet/modal)
- **Components:** sight mini-header (thumb + name), `TextArea` comment (placeholder), quick chip **"Found!"** default, `PhotoUploader` (optional, add photos → user_photos), `PrimaryButton "Log find"`.
- **States:** empty (default "Found!"), typing, uploading, submitting, success.
- **Actions:** submit → updates dex (brighten), posts to feed, may trigger B-Find-Success/badge → returns to B2.

#### B5 — Photo Viewer
- **Components:** full-screen swipeable gallery, caption/date, delete (own photos), share.
- **States:** single/multi, own vs others' photos (delete only own).

---

### TAB 2 — EXPLORE (Passport)

#### B6 — World
- **Components:** `NavHeader "Explore"`, `SearchBar` (any place), world completion summary (`StatTile`: countries explored, sights found), list/grid of **Country cards** (flag, name, `CompletionRing` %, sights x/y). Sort/filter.
- **States:** loading, empty (none started), searching.
- **Actions:** tap country → B7 · search result → B7/B8.

#### B7 — Country (Chunk-Map)
- **Purpose:** OSRS-Tileman city board.
- **Components:** country header (name, "2 of 9 cities claimed · 80/140 sights", `CompletionBar`), **chunk board** of `ChunkTile`s (each: city name, region label, fill %/ring, state = claimed green / in-progress amber / untouched dim) with adjacency lines (visual only), legend, map/list toggle.
- **States:** loading, partial, fully claimed (celebration), list fallback.
- **Actions:** tap a chunk → B8.

#### B8 — City Preview
- **Components:** city header (name, country, `CompletionBar`), highlight `SightCard`s, type breakdown, `PrimaryButton "Open map"` (→ sets active city → B1 scoped to it), "browse all sights" list.
- **States:** not-yet-visited (all dim, planning mode), in-progress, claimed.
- **Actions:** Open map → B1 · sight → B2.

#### B9 — Search Results
- **Components:** `SearchBar`, segmented results (Cities / Sights / Countries), result rows, recent searches, empty state.

---

### TAB 3 — FIND (center capture)

#### B10 — Camera Capture
- **Components:** full-screen `Camera` (expo-camera), shutter, flip, flash, gallery-import; framing hint overlay; close.
- **States:** permission prompt/denied (with settings link), capturing, preview.
- **Actions:** capture → B11.

#### B11 — Nearby Sight Picker
- **Purpose:** attach the capture/log to a sight.
- **Components:** list of nearby/likely sights (`SightRow` + distance if location on), `SearchBar` to find any sight, "not listed? Submit a new sight" → B14.
- **States:** location-on (sorted by distance) / off (search-first), empty.
- **Actions:** pick → B12.

#### B12 — Log Composer
- **Components:** same as B4 (comment, "Found!", `PhotoUploader` pre-filled with the capture), `PrimaryButton "Log find"`.
- **Actions:** submit → B13.

#### B13 — Find Success
- **Components:** celebratory animation, "Added to your dex!", entry card, updated completion `CompletionBar`, **badge unlock** card (if any), `PrimaryButton "View entry"` / `SecondaryButton "Done"`.
- **Actions:** View → B2 · Done → previous tab.

---

### TAB 4 — COMMUNITY

#### B14 — Community Home
- **Components:** `NavHeader`, `SegmentedControl`: **Feed · Submit · My Submissions** (and a "Discover" for approved community sights).
- Hosts the sub-screens below.

#### B14a — Finds Feed
- **Components:** scrollable `FindFeedItem` list (avatar, "[user] found [sight] · date", thumbnail, like/comment counts), pull-to-refresh, filters (Friends / Global / Nearby).
- **States:** loading, empty, end-of-feed.
- **Actions:** item → B2 / find detail · avatar → user profile.

#### B14b — Submit a Sight (form)
- **Components:** `PhotoUploader` (reference photo), Name, `TypeTag` multi-select, Description, Hint, **Location picker** entry → B15, Access/Size/Busyness selectors, `PrimaryButton "Submit for review"`, guidelines note.
- **States:** draft, validating, submitting, success ("pending review").
- **Actions:** location → B15 · submit → B14c.

#### B15 — Location Picker (map)
- **Components:** `MapView` w/ draggable center pin, `SearchBar` (address/place), "use my location", confirm button.
- **States:** searching, pin set.

#### B14c — My Submissions
- **Components:** list with `StatusBadge` (Pending / Approved / Rejected + reason), tap → submission detail (editable if pending/rejected).
- **States:** empty, mixed statuses.

#### B16 — Community Sight Detail
- **Components:** like B2 but flagged "Community" with submitter credit; findable once approved.

---

### TAB 5 — PROFILE

#### B17 — Profile Home
- **Components:** header (`Avatar`, username, "member since"), **stats row** `StatTile`s (sights found, cities claimed, countries, badges), `CompletionBar` (world), **Badges** preview strip → B19, **Photo Journal** preview → B20, list links (Settings → B21, Edit → B22).
- **States:** new user (mostly empty + prompts), active.

#### B18 — Stats / Completion Detail
- **Components:** breakdown by World → Country → City with `CompletionRing`/bars, sortable, "closest to completing" highlights.

#### B19 — Badges
- **Components:** grid of `BadgeChip` (earned = color, locked = dim + criteria), categories, progress toward next.
- **States:** earned/locked, detail sheet on tap.

#### B20 — Photo Journal / Passport
- **Components:** per city/country "page" layout — `Avatar`/stamp, grid/collage of user photos + finds, date ranges, `PrimaryButton "Share"` (export image). Tab/segmented by place.
- **States:** empty (no finds yet), populated, sharing.

#### B21 — Settings
- **Components:** sections — **Account** (email, connected Apple, change password, sign out, delete account), **Location** (toggle + status), **Notifications**, **Privacy** (profile visibility, photo defaults), **About** (version, Terms, Privacy). `ListRow` + toggles.
- **States:** toggles on/off, destructive confirm (delete account) modal.

#### B22 — Edit Profile
- **Components:** `Avatar` picker (`PhotoUploader`), username (availability check), display name, save.

---

## C. Global / Shared Components (catalog for Claude Design)

| Component | Key props / states |
|-----------|--------------------|
| **TabBar** | 5 items, raised center Find FAB, active/inactive, badge counts |
| **NavHeader** | title, back/close, optional right action |
| **SightPin** | found (bright) / unseen (dim) / selected; cluster variant |
| **SightRow / SightCard** | thumb (ref photo), name, #dex, found-check/dim, distance/status, `TypeTag`s |
| **CompletionBar / CompletionRing** | value %, label, color by progress |
| **BottomSheet** | snap points (peek/half/full), drag handle, scrollable content |
| **ChunkTile** | city name, region, fill%, state (claimed/progress/dim), adjacency line anchors |
| **StatTile** | icon, value, label |
| **TypeTag** | label, category color |
| **BadgeChip** | icon, name, earned/locked, progress |
| **FindFeedItem** | avatar, user, sight, date, thumb, like/comment |
| **PhotoUploader** | pick/capture, compress→Storage, multi, progress, error |
| **PrimaryButton / SecondaryButton / LogButton(amber)** | default/loading/disabled |
| **SearchBar / SegmentedControl / Avatar** | standard states |
| **EmptyState / LoadingSkeleton / Toast / Modal** | per-context copy |

---

## Screen Count Summary

- **Onboarding/Auth:** 10 (A1–A10)
- **Map:** 5 (B1–B5)
- **Explore:** 4 (B6–B9)
- **Find:** 4 (B10–B13)
- **Community:** ~6 (B14, B14a–c, B15, B16)
- **Profile:** 6 (B17–B22)
- **Total:** ~35 distinct screens, built from ~25 shared components.

> Note: many screens reuse the same primitives (SightRow, BottomSheet, PhotoUploader, CompletionBar) — the real design surface is the **shared component catalog (§C)** plus a handful of unique layouts (Map Home, Sight Detail, Country Chunk-Map, Photo Journal).
