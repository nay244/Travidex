# Travidex — Explore & Community Modifications (Changelog & Interaction Spec)

**Date:** 2026-06-09 · **Scope:** Explore screen (chunk-map → Region Dex → Region Highlights) and Community screen (Friends + Hidden gems + submission/moderation).
**Companion docs:** `Travidex-Screen-Flow-and-Design.md` (§3.5–3.7.1) and `ui_kits/travidex-ios/README.md` — both already updated to as-built state.

---

## 1. Files changed

| File | Status | What changed |
|---|---|---|
| `ChunkMap.jsx` | modified | Country switcher pill (CSS **flag + country code**, e.g. 🇯🇵 JP) opening a Country picker; two-tier boards (`tier:"cities"` vs `tier:"states"` → state → city drilldown w/ breadcrumb); **threads the country code into `onCity({ ...city, code })`** so downstream screens (Region Dex / Highlights) know the country. |
| `RegionDex.jsx` | modified | Pokédex-style region list (found = full image / unfound = hollow; favorite top-right; dex # bottom-right). **New: amber sparkles button** (aria-label "Region highlights") in the header → opens the Region Highlights overlay. |
| `RegionHighlights.jsx` | **new** | Shareable region recap composed from the user's photos (see §3 below). |
| `Community.jsx` | rewritten | Two tabs: **Friends** (feed + "Your friends" entry → searchable Friends list page w/ "Add a friend") and **Hidden gems** (region-specific user-shared off-dex sights w/ star favorites, sort, report, share flow). |
| `ShareGem.jsx` | **new** | "Share a hidden gem" submission sheet + moderation guardrails (see §4 below). |
| `flags.jsx` | new (this scope) | CSS-drawn country flags (`FLAGS`, `<Flag code size radius>`); used by the Explore pill/picker, Region Highlights card, ShareGem location chip (and Welcome/Map elsewhere). |
| `data.jsx` | modified | `COUNTRIES` (JP/FR `tier:"cities"`, US `tier:"states"`); `cityEntries()`, `findCity()`, `mapSights()`; `FRIENDS`; `KYOTO_GEMS` + **`hiddenGems(code, city)`** (region-specific gems; Kyoto authored, others deterministic). |
| `app.jsx` | modified | Wiring: `<Community feed friends location>`; `<ChunkMap countries onCity={(c) => setRegionDex(c)}>`; Region Dex overlay state. |
| `index.html` / `overview.html` | modified | Script tags for the new modules (`flags`, `RegionHighlights`, `ShareGem`) + updated component props. |
| `Travidex-Screen-Flow-and-Design.md` | modified | §3.5 Explore, §3.6 Region Dex, **§3.6.1 Region Highlights**, §3.7 Community, **§3.7.1 Hidden gems backend pipeline (Supabase)**, §7 manifest. |
| `ui_kits/travidex-ios/README.md` | modified | Flow map, screen table rows, file list. |

---

## 2. Explore — interaction flow

```
Explore tab
 └─ country pill (Flag + CODE) ──▶ Country picker (flag + claimed/sights per country)
      tier "cities"  (Japan, France):  board = city tiles ──▶ tap city ──▶ REGION DEX
      tier "states"  (United States):  board = state tiles ──▶ tap state ──▶ that state's
                                       city tiles (breadcrumb "‹ {country} · all states")
                                       ──▶ tap city ──▶ REGION DEX

REGION DEX (city)
 ├─ search · sort · filter
 ├─ row tap ──▶ Sight Detail        row anatomy: thumb (found=photo / unfound=hollow),
 │                                  type chips, ♥ favorite (top-right), #dex (bottom-right)
 └─ ✨ sparkles (header) ──▶ REGION HIGHLIGHTS
```

- Tile semantics everywhere: green = claimed/complete (glow + check), amber gradient fill = in-progress, dim = untouched. Fill rises bottom-up with completion.
- The pill shows the **code** after a country is chosen; the picker rows show full names.

## 3. Region Highlights (`RegionHighlights.jsx`) — new feature

**Purpose:** capture a shareable recap of a region from the user's own photos — the photos under each found sight's **Sight Detail → "Your photos"** (2 per found sight in the prototype).

**Flow:**
```
Region Dex ─✨─▶ Region Highlights (full-screen overlay, z48)
  ├─ Highlight CARD (4:5, share-ready)
  │    · photo mosaic — 3-col grid, first photo spans 2×2
  │    · header strip: country Flag + city + "MY HIGHLIGHTS"
  │    · footer strip: Travidex mark + wordmark + "{found}/{total} SIGHTS · {MON YYYY}"
  │    · top/bottom scrims for text legibility
  ├─ "Your photos" selection grid (4-col, all selected by default)
  │    · tap toggles include/exclude (green ring + check = in; excluded dims)
  │    · count line "N OF M SELECTED"; card preview updates live
  │    · 0 selected → share buttons disabled, card shows "Select at least one photo"
  ├─ pinned actions:
  │    · "Share to friends" (green) ──▶ posts to in-app friends feed (toast confirm)
  │    · "Share elsewhere" ──▶ reveals: Save image · Messages · Stories · Copy link (toasts)
  └─ empty state (no found sights): "Find a sight in {city} and add photos…"
```

**Implementation notes:** photos come from the user's photo records keyed (sight, user); render the card to a real image (client- or server-side) for the system share sheet. The country code arrives via `ChunkMap.onCity({...city, code})`. Open option: add a 9:16 story variant alongside the 4:5.

## 4. Community — interaction flow

```
Community tab
 ├─ FRIENDS
 │    ├─ "Your friends" row (avatar stack + count + ›) ──▶ Friends list page
 │    │     · search filters · green "Add a friend" row
 │    │     · rows: initials avatar · name @handle · most-recent find · green sights count
 │    └─ finds feed: "{user} found {sight} in {city}" + photo + ♥ like + comments
 └─ HIDDEN GEMS  (region-specific: scoped to the Map's current city; remounts on city change)
      ├─ subtitle: "Hidden gems near {city} — spotted by travelers, not yet in the dex."
      ├─ "Share a hidden gem" (amber) ──▶ ShareGem sheet
      ├─ sort: Most favorited · Newest · Nearest (all reorder live)
      └─ gem cards: photo · name · "BY · X.X KM · DATE" · note
           · ★ favorite chip (toggle, live count, amber when faved)
           · "Report" flag ──▶ "Reported · under review" (card dims)
           · own pending submission: amber "IN REVIEW" badge, pinned top, no star
```

**ShareGem sheet:** photo (**required**, tap box to attach) → name (≥3 chars) → note → auto location chip (Flag + city from the Map — not user-editable) → blue guidelines card ("Reviewed before it appears": no private property / exact home addresses, unsafe or restricted areas, ads, off-topic). **Submit disabled until photo + name.** Submit → "Submitted for review" (amber clock; automated checks → moderator queue → ~24h notice) → Done → gem appears at top with **IN REVIEW** badge.

**Backend pipeline (full spec in flow doc §3.7.1):** `gems` table with `status: pending|approved|rejected|hidden`; client can never set status (RLS); Edge Function automated checks on insert (image safety, text profanity/PII, geo sanity); owner/moderator approval flips to `approved` + `approved_at` → gem enters **Newest** (`ORDER BY approved_at DESC`); **Most favorited** = `favs_count DESC` via `gem_favorites` + trigger; **Nearest** = PostGIS distance from user geolocation, falling back to the Map's city center when location is off; report threshold auto-hides pending re-review; `moderation_log` audit trail.

---

## 5. Data functions added (in `data.jsx`)

| Function | Purpose |
|---|---|
| `cityEntries(city)` | Region-dex entry list for a city (Kyoto authored; others synthesized deterministically). |
| `findCity(code, cityName)` | Looks up a city record in `COUNTRIES`, flattening states for `tier:"states"` countries. |
| `mapSights(code, cityName)` | Map-screen sights for a city: `cityEntries` + deterministic pin x/y + distance. |
| `hiddenGems(code, cityName)` | Region-specific hidden-gem set for the Community tab. |

All synthesized content is **sample data** to demonstrate mechanics; real catalogs/gems come from the backend.
