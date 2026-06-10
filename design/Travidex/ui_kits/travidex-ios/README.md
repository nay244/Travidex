# Travidex — iOS UI Kit

A high-fidelity, interactive recreation of the Travidex iOS app. Open **`index.html`** to click through it, or **`overview.html`** to see the hero screens side-by-side on a pan/zoom canvas.

> Full as-built flow, interactions, and data model: **`../../Travidex-Screen-Flow-and-Design.md`**.

## Flow
`Welcome → (auth) → Map Home`. The bottom **TabBar** switches **Map · Explore · ⬗Find · Community · Profile**. The center **stamp** button logs a find but is **disabled until a sight is selected** from the Map list.

```
Map: location pill (flag+city) → Location picker → Change country → pick city (swaps map sights)
     select a row → ⬗ enables → tap ⬗ → Find Success (new) or Already-logged (if found)
     row "see more" chevron → Sight Detail
Explore: country pill (flag+code) → Country picker; city tile → Region Dex;
         US states tile → state's cities → Region Dex
Profile: Badges/Achievements rails → full pages; Customize → Appearance / Profile Art
```

## Screens
| File | Screen | Notes |
|---|---|---|
| `Welcome.jsx` | Onboarding | Collector's-board hero, Sign in with Apple / email auth |
| `MapHome.jsx` | Map Home | Themed map, found/unseen pins, 3-snap **dex bottom sheet**, **dex-order list** (no sort tabs), tap-to-select + see-more chevron, hollow unfound thumbs. **Location pill (flag+city)** opens `LocationPicker`. |
| `LocationPicker.jsx` | Location switcher | Bottom sheet from the Map pill. **Cities view** (country header + Change, city search scoped to country, city list) + **Countries view** (pick another country). Picking a city calls `goToLocation` → **swaps the map's pins/sights** to that city. |
| `SightDetail.jsx` | Sight Detail | Hero photo, #dex + found badges, type tags, Access/Size/Busyness, **inline** Navigate + Log find (no duplicate bottom bar), hint, about, your photos, recent finds |
| `FindSuccess.jsx` | Find Success | New find: stamp + confetti + completion bar + badge. **`already` mode**: "Already in your dex" notice (no bar/badge), Map / View entry |
| `ChunkMap.jsx` | Explore Chunk-Map | Country switcher (**flag + code**) + Country picker; `tier:"cities"` → city tiles; `tier:"states"` → **state tiles → drill into cities**; gradient completion fill |
| `RegionDex.jsx` | Region Dex | Pokédex-style list of a city's sights: search + sort/filter, type chips, **favorite top-right**, **dex # bottom-right**, found = full image / unfound = hollow. **Sparkles button → Region highlights** |
| `RegionHighlights.jsx` | Region highlights | Shareable 4:5 recap card from the user's photos across the region's found sights (Sight Detail → "Your photos"): photo selection grid, flag+city header, Travidex-branded footer, Share to friends / Share elsewhere (Save · Messages · Stories · Copy link) |
| `Community.jsx` | Community | **Friends** (feed + searchable friends list w/ Add a friend) · **Hidden gems** (region-specific user-shared off-dex sights: star favorites, Most favorited/Newest/Nearest sort, Report action) |
| `ShareGem.jsx` | Share a hidden gem | Submission sheet: required photo + name + note + auto location, guidelines card; submit → "Submitted for review" + amber IN REVIEW badge on the new card |
| `Profile.jsx` | Profile | **Profile-art background**, identity, Sights/Cities/Countries, World completion, **Badges & Achievements rails** (4 + `>`), Customize rows |
| `ProfilePages.jsx` | Monthly Badges · Achievements (+ detail) | Per-year month grids; leveled awards grid w/ hollow locked icons → how-to-unlock detail |
| `ProfileArt.jsx` | Profile Art picker | Progress-unlocked background designs (locked show criteria + progress) |
| `Appearance.jsx` | Appearance | Light (free) / Dark (**Travidex+ premium**, unlockable to preview) |

## Architecture
- **`app.jsx`** — app shell: tab + overlay state, `attemptLog()` (found→already / unfound→log), `logFind()`, theme (`data-theme`), `premium`, `mapSelected`, `regionDex`, `profileArtId`.
- **`primitives.jsx`** — kit-local components (`Icon`, `Press`, `Btn`, `Pin`, `Ring`, `CBar`, `Chunk`, `SightRow`, `MapBg`, `Seg`, `StatTile`, `TypeTag`) mirroring the published `components/`.
- **`chrome.jsx`** — `TabBar` (5-tab + stamp FAB w/ `findEnabled`) + `SAFE_TOP`/`TAB_H`.
- **`art.jsx`** — `PROFILE_ART` presets + `ArtLayer` + progress unlock eval.
- **`data.jsx`** — `KYOTO_SIGHTS`, `COUNTRIES` (JP/FR cities, US states), `cityEntries()`, `findCity()`, `mapSights()`, `ACHIEVEMENTS`, `BADGE_YEARS`, `FEED`.
- **Per-city Map sights:** `app.jsx` holds `sightsByCity` (cache keyed `"{code}/{city}"`) + `mapLocation`. `goToLocation(code, city)` seeds the cache via `mapSights(code, city)` on first visit, then activates it; `logFind` mutates the active city's entry so finds persist per city.

## Build notes
- **Self-contained:** real tokens via `../../styles.css`; Lucide via CDN wrapped in a React `Icon` (builds the SVG imperatively).
- **Theme:** light by default; dark via `data-theme="dark"` on `<html>` (set from Appearance / premium unlock). The device frame's `dark` prop follows it.
- **Z-order:** tab bar 40 < Region Dex 46 < Sight Detail 47 < Find Success / Achievement Detail 48 < modal sheets (Appearance / Profile Art / Country picker / island/home-indicator) above.
- **Known caveat:** the stamp FAB's grey→amber swap is instant — a CSS `background` transition was removed because this rendering engine froze it mid-transition; a native build can animate it.
- **Map** is a CSS abstraction (`MapBg`); production uses `react-native-maps`. **Flag emoji** show as the flag on iOS, may fall back to letters elsewhere.
- **Sample data:** US states (6) and non-Kyoto region-dex entries are representative samples to demonstrate the layout/hierarchy.

## Files
`index.html` · `overview.html` · `app.jsx` · `data.jsx` · `primitives.jsx` · `chrome.jsx` · `art.jsx` · `flags.jsx` · `Welcome.jsx` · `MapHome.jsx` · `LocationPicker.jsx` · `SightDetail.jsx` · `FindSuccess.jsx` · `ChunkMap.jsx` · `RegionDex.jsx` · `RegionHighlights.jsx` · `Community.jsx` · `ShareGem.jsx` · `Profile.jsx` · `ProfilePages.jsx` · `ProfileArt.jsx` · `Appearance.jsx` · `ios-frame.jsx` · `design-canvas.jsx`
