# Travidex — Explore Build Notes (test build vs. design reference)

**Date:** 2026-06-11 · **Scope:** Country Chunk-Map, Region Dex (+ missing US states board, + Region Highlights build-out spec).
**Compare against:** `design-reference/screens/` PNGs · behavior spec: `Travidex-Screen-Flow-and-Design.md` (§ refs below) · live source: `ui_kits/travidex-ios/*.jsx`.

Priorities: **P1** = core pattern/semantic wrong, **P2** = anatomy/styling drift, **P3** = copy/polish.

> Build screens reviewed: `countrychunkmap_build.jpg`, `regiondex_build.jpg` (France/Paris data — fine; reference uses Japan/Kyoto).

---

## 1. Country Chunk-Map — ref `07-country-chunk-map-3.5.png` · spec §3.5 · source `ChunkMap.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 1.1 | **P1** | Chunk tile: tall rectangle, hard amber border-line across the middle, count (`2/3`) at top under the region, city name at the bottom of the fill | **Square tile** (aspect 1:1) in a **3-column grid**. Anatomy: region label top-left (mono caps, ellipsized) · **state marker top-right** (green check disc = claimed / amber dot = in progress / hollow ring = untouched) · **city name + mono count together at the bottom**. Completion fill rises from the bottom as a **gradient** (`linear-gradient(to top, amber-dim, transparent)`) — **no hard border line** through the tile (claimed tiles get the solid green-dim fill + 2px green top edge + glow) |
| 1.2 | **P2** | No overall completion bar | A full-width `CompletionBar` (amber, green at 100%) sits between the country header and the legend |
| 1.3 | **P2** | Top-right shows a `0/1` ring | Design's top-right is a **list-view toggle** (glass icon chip). The claimed-count ring belongs **in the header** next to the country name (ring with the flag inside), not floating in the chrome |
| 1.4 | ✅ | Flag + `FR` pill (top-left), country header with green claimed count, legend (claimed / in progress / untouched), footer copy "Find every sight in a city to claim it." | Matches — keep |
| 1.5 | **P1** | *(not built)* | **US two-tier states board** (§3.5, ref `08-us-states-board-3.5.png`): countries with `tier:"states"` render **state tiles** first (same chunk-tile anatomy, aggregated counts); tapping a state swaps the grid to that state's **city tiles** with a breadcrumb "‹ United States · all states"; tapping a city opens Region Dex. Reuse the existing board — only the data level changes |

## 2. Region Dex — ref `09-region-dex-3.6.png` · spec §3.6 · source `RegionDex.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 2.1 | **P1** | Found rows: **entire card tinted green** with green border + a green check-square as the thumb | Found state lives in the **thumbnail**: found = **full-color photo** (striped placeholder until real imagery), unfound = hollow box + faint landmark glyph. Cards stay neutral (`--surface-1`, hairline) for both states — the image-vs-hollow contrast IS the found signal (same rule as Achievements). No row tinting, no check-square |
| 2.2 | **P2** | `#001` sits directly under the heart (top-right cluster) | **Heart top-right, dex `#001` bottom-right** — two separate corners (mono, small). This was an explicit design revision |
| 2.3 | **P2** | Full-width green **"Open map"** button above the list | Not in the spec — Region Dex links back via the header chevron; Map is a tab. Remove (or propose as an addition if there's a UX case — don't ship silently) |
| 2.4 | ✅ | Header (city + `RÉGION · 2/3 FOUND`), search "Search Paris", sort + filter chips, **amber sparkles button**, tone-mapped type chips (Historic=amber, Scenic=green, Icon=blue…), unfound hollow-glyph thumb | Matches — keep. (Sparkles currently leads nowhere — see §3) |

## 3. Region Highlights — NOT BUILT · ref `10-region-highlights-3.6.1.png` · spec §3.6.1 · source `RegionHighlights.jsx`

Build-out spec — the amber sparkles button in the Region Dex header opens this as a **full-screen overlay** (X to close):

1. **Highlight card** (top, share-ready **4:5**, `--radius-xl`, shadow + hairline):
   - **Photo mosaic** — 3-column grid of the selected photos, 3px gaps; the **first photo spans 2×2**; up to 9 tiles shown.
   - **Header strip** (overlaid, top): country `<Flag>` chip + city name (sans 700, white) + mono caps "MY HIGHLIGHTS" right-aligned.
   - **Footer strip** (overlaid, bottom): Travidex mark + wordmark ("Travi**dex**", dex in green) + mono caps "{found}/{total} SIGHTS · {MON YYYY}".
   - Top + bottom **gradient scrims** keep both strips legible over any photos.
2. **Photo source:** every photo under the region's **found** sights' "Your photos" (Sight Detail §3.3) — 2 per found sight in sample data; real photo records keyed (sight, user) in production.
3. **"Your photos" selection grid** — 4 columns, ALL selected by default; header row "Your photos" + mono "N OF M SELECTED". Selected tile = green 2px ring + green check dot (top-right) + mono dex-# label (bottom-left); tap toggles → excluded tiles dim to 45% with hairline only. The card mosaic updates live. **0 selected** → card shows "Select at least one photo" and both actions disable.
4. **Pinned bottom actions** (gradient fade over content): **"Share to friends"** (green pill → posts to the in-app friends feed, toast "Shared to your friends feed") and **"Share elsewhere"** (secondary pill → expands a 4-up destination row: **Save image · Messages · Stories · Copy link**; each confirms via toast). Off-app destinations route through the **system share sheet** with the card **rendered to a real image**.
5. **Empty state** (no found sights in region): centered sparkles chip + "No highlights yet" + "Find a sight in {city} and add photos — they'll come together here."
6. Both themes via tokens; overlay z-index above Region Dex (z48-equivalent).

## 4. Global

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 4.1 | **P1** | Center Find tab = small grey circle with **+** | Raised **stamp** button (62px, above the bar, `--bg` ring; grey disabled → amber + glow when a sight is selected). Same item as the other build-notes files — one fix clears all |
| 4.2 | P3 | Amber reads dark gold in places | Likely correct: light theme `--amber` = **#bd7d12**, dark = **#e0a23c** (`tokens/colors.css`). Just confirm values come from the tokens, not hardcoded — and ignore the amber note in `core-loop-build-notes.md` §3.6 if the build already uses the light token |
