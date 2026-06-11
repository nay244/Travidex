# Travidex Phase 9 — TestFlight Conformance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Visual tasks MUST Read their reference PNG(s) in `design/reference/screens/` (multimodal ground truth, 402×874 logical px) plus the matching `ui_kits/travidex-ios/*.jsx` source and spec § in `Travidex-Screen-Flow-and-Design.md`.

**Goal:** Make the live TestFlight app match the design references functionally and visually. First TestFlight install surfaced: (1) a data-layer bug — PostGIS aliases in PostgREST selects are invalid → Map "0 of 0", blank Explore board, empty pill; (2) no safe-area handling — content collides with the iOS status bar on every screen; (3) broken layouts (Profile stat row collision); (4) the built screens are visually far from the design system; (5) four designed screens don't exist yet (§3.9–§3.11).

**Architecture:** W1 fixes the data layer with PostgreSQL **generated columns** (`lat`/`lng` stored on `cities` and `sights`, migration 0014) so selects become plain columns — junior-readable, no RPC detours. Safe areas via one shared `components/Screen.tsx` wrapper (copy-paste rule: every screen root is `<Screen>`). W2 restyles each BUILT screen to its PNG using theme tokens only. W3 builds the four missing profile-cluster screens (§3.9 monthly badges, §3.10 achievements + detail, §3.11 profile art) per spec, with flat content catalogs per the extensibility principle.

**Verification:** every W1 task verifies against the LIVE Supabase API (not just mocks); visual tasks self-check by re-reading the PNG against their implementation. Full suite + tsc per task.

---

## W1 — Critical functional fixes

### T1: lat/lng generated columns + plain selects (THE TestFlight data bug)
Migration `0014_latlng_generated.sql`:
```sql
-- PostgREST cannot evaluate st_y()/st_x() in select strings; store the
-- projections as generated columns so clients select plain lat/lng.
alter table cities  add column lat double precision generated always as (st_y(center::geometry))   stored;
alter table cities  add column lng double precision generated always as (st_x(center::geometry))   stored;
alter table sights  add column lat double precision generated always as (st_y(location::geometry)) stored;
alter table sights  add column lng double precision generated always as (st_x(location::geometry)) stored;
```
Update selects to plain `lat, lng` in: `lib/data/catalog.ts` (SIGHT_COLUMNS), `lib/data/citiesByCountry.ts` (both functions). `npx supabase db push`, then LIVE-verify the three exact REST selects return 200 with coordinates. Targeted jest + tsc.

### T2: Safe areas everywhere
New `components/Screen.tsx`: `SafeAreaView` (react-native-safe-area-context, already a dependency via expo-router) with `edges={['top']}`, `flex:1`, `backgroundColor: t.colors.bg`, optional `edges` override. Replace each screen's root `<View style={{flex:1,backgroundColor:t.colors.bg}}>` with `<Screen>` across: all 5 tab screens, profile/* (badges, journal, settings, appearance), city/[id], highlights/[cityId], community/* (friends, share-gem, submit, mine), find/* (pick, success), sight/[id], paywall, (auth)/welcome + login/signup if headerless. Map screen: pill `top` offset becomes inset-aware (useSafeAreaInsets) since the map itself should remain edge-to-edge behind the status bar. Tests must stay green (SafeAreaView renders children in jest).

### T3: Broken-layout hotfixes
Profile stat row (each Stat `flex:1`, centered, label `textAlign:'center'`, smaller caption, no overlap); Community segmented control spacing below safe area; any other collision found while in the files. PNG refs 15/11 for target look (full restyle comes in W2 — this task only stops the bleeding).

## W2 — Visual conformance of built screens (PNG-driven)
One task per group; each task: Read PNG(s) → Read kit .jsx → restyle the RN screen with tokens (type scale, spacing, radii, surfaces, accents, hollow/full law) → preserve all testIDs/behavior → adjust tests only for changed copy → full suite + tsc.
- **T4 Welcome + auth** (ref 01; Welcome.jsx §3.1): collector's-board flags backdrop (reuse `Flag`), wordmark, auth buttons per design.
- **T5 Map Home + LocationPicker** (refs 02, 03; MapHome/LocationPicker §3.2): glass overlays (search field chrome, pill styling), dex bottom-sheet look (grabber, header row, completion bar style, row chrome), selection banner per design, picker sheet polish.
- **T6 Sight Detail + Find flow** (refs 04, 05, 06; SightDetail/FindSuccess §3.3–3.4): hero/type chips/info grid per design; Find Success celebration layout, already-variant.
- **T7 Explore + Region Dex + Highlights** (refs 07, 08, 09, 10; ChunkMap/RegionDex/RegionHighlights §3.5–3.6.1): chunk tile fills (bottom-up completion gradient look via solid fills), board header ring/legend, region-dex rows (thumb/chips/heart/#dex placement), highlights card/selection polish.
- **T8 Community trio** (refs 11, 12, 13, 14; Community/ShareGem §3.7): tabs chrome, feed cards, friends list rows/avatars, gem cards, share sheet.
- **T9 Profile + Settings + Appearance + Paywall** (refs 15, 20; Profile/Appearance §3.8, §3.12): stat row, link rails, settings rows, appearance scheme cards (Travidex+ chip), paywall polish.

## W3 — Missing designed screens (profile cluster)
- **T10 Monthly badges page** (ref 16; ProfilePages.jsx §3.9): year grid of months; earned month = full badge art (colored circle + month), unearned = hollow. Data: derive earned months from the user's `finds` history (a month is earned if ≥1 find that month) — one `getFindMonths(userId)` wrapper; flat MONTH catalog.
- **T11 Achievements + detail** (refs 17, 18; §3.10): flat `ACHIEVEMENTS` catalog (`lib/achievements.ts`: id, label, icon glyph, test(stats), progress(stats) — copy-a-line entries reusing Stats from `lib/stats.ts`); grid screen + detail view (how to unlock + progress bar). Pure client-side over existing stats; no new tables.
- **T12 Profile art picker** (ref 19; §3.11): flat `PROFILE_ART` catalog (id, label, unlock test over stats); picker sheet from Profile; selection persisted in a new `profiles.art_id` text column (tiny migration 0015, default 'trailhead'); Profile header shows the art treatment.

## Done
- Live API serves sights/cities with coordinates; Map shows Paris pins + working pill; Explore board renders city tiles (verified against production).
- No status-bar collisions on any screen (iPhone, notch).
- Each built screen visually matches its PNG within token fidelity; the four §3.9–3.11 screens exist and match theirs.
- Full suite green; tsc clean; new content (months/achievements/art) are flat copy-a-line catalogs.
