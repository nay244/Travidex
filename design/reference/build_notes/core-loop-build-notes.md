# Travidex — Onboarding & Core Loop Build Notes (test build vs. design reference)

**Date:** 2026-06-11 · **Scope:** Map Home, Location switcher, Sight Detail, Already logged (+ missing Find Success, + one global tab-bar item).
**Compare against:** `design-reference/screens/` PNGs · behavior spec: `Travidex-Screen-Flow-and-Design.md` (§ refs below) · live source: `ui_kits/travidex-ios/*.jsx`.

Priorities: **P1** = core pattern/semantic wrong, **P2** = anatomy/styling drift, **P3** = copy/polish.

> Build screens reviewed: `maphome_build.jpg`, `locationswitcher_build.jpg`, `sightdetail_build.jpg`, `alreadylogged_build.jpg` (Paris/France data — fine; reference uses Kyoto/Japan).

---

## 0. Missing screen — Find Success · ref `05-find-success-3.4.png` · spec §3.4 · source `FindSuccess.jsx`

| # | Pri | Note |
|---|---|---|
| 0.1 | **P1** | The build has **no Find Success screen** (new-find celebration). Build it as a **sibling of Already logged** — same layout skeleton (centered medallion → mono label → sight name → `#dex · city` → actions) with these deltas: label **"ADDED TO YOUR DEX"**; **confetti specks** scattered in the upper half (green/amber/blue, fall animation, base-visible for reduced-motion); a **completion card** under the meta line (`CompletionBar` — "KYOTO · 4 / 8", amber fill, green at 100%); an optional **badge-unlock chip** (amber dim card: medallion + "BADGE UNLOCKED · {name}"); buttons **Done** (secondary) + **View entry** (green). Already-logged mode deliberately omits the completion card, confetti, and badge — that's the §3.4 distinction. |

## 1. Map Home — ref `02-map-home-3.2.png` · spec §3.2 · source `MapHome.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 1.1 | **P1** | Pins = photo medallions (landmarks) + small hollow circles | **Pin state language**: found = **green dot + check + glow**, unfound = **dim grey dot**, selected = **amber, enlarged**. The real map (production `react-native-maps`) is expected — but the dex state semantics must survive on it. If photo pins are kept as an enhancement, wrap them in the state ring (green/dim/amber) so found/unfound/selected reads at a glance |
| 1.2 | **P1** | Selected row (Eiffel Tower) highlighted **green** with green check | Selection is **amber** (`--surface-3` bg + `--amber-line` inset ring) — green is reserved for *found*. A found+selected row keeps its green check but the row highlight is amber |
| 1.3 | **P2** | No selection banner | Under the sheet header: amber strip **"Selected: {sight} · TAP ⬗ TO LOG"** linking selection → the stamp FAB |
| 1.4 | **P2** | Rows: icon box + name + colored type chips + `#001 ›` right | Row anatomy: **48px thumb** (found = photo, unfound = hollow box + faint landmark glyph) · `#001` mono **before** the name · mono meta line `1.2 km · Found` · **"see more" chevron chip** right. Type chips don't belong in Map rows (they live in Region Dex), and chips are **blue-only** per accent semantics — build's green/amber/blue mix overloads the state colors |
| 1.5 | ✅ | Sheet header "Paris · 1/3 found" + amber completion bar; search bar + filter; flag + city pill | Matches — keep |

## 2. Location switcher — ref `03-location-switcher-3.2.png` · spec §3.2 · source `LocationPicker.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 2.1 | **P1** | Paris **1/3 with a green check** | Green check = **claimed only** (n = N). In-progress cities show a **mono amber fraction** (`1/3`) + chevron, no check. Untouched = dim fraction. Build's check on 1/3 breaks the claimed semantic |
| 2.2 | ✅ | Country card (flag + COUNTRY label + name + "Change ⇅"), city search, "CITIES IN FRANCE" header, region sub-label, current-city highlight | Matches — keep |

## 3. Sight Detail — ref `04-sight-detail-3.3.png` · spec §3.3 · source `SightDetail.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 3.1 | **P1** | Plain grey hero with a white `#002` pill | **Hero photo block** (~300px): reference photo (striped placeholder until real imagery), **dimmed/desaturated when unfound**; gradient scrim into the page; glass chips overlaid — `#002` + (when found) green `✓ FOUND` badge bottom-left, mono "REFERENCE" bottom-right |
| 3.2 | **P2** | Back chevron only | Hero top row: glass back chip left, **heart (favorite) + share** glass chips right |
| 3.3 | **P2** | No location line | "📍 {City}, {Country}" line under the title (text-3, 14px) |
| 3.4 | **P2** | Neutral grey outline type chips | TypeTags are **blue** (blue-dim fill, blue-line ring, blue text) — all of them |
| 3.5 | **P1** | Stat tiles: no icons; "Moderate" **wraps to "Moderat e"** | StatTiles: icon (footprints / maximize / users) + **mono value 19px** + uppercase mono label, equal heights; value must not wrap — smaller mono value + `white-space: nowrap`. Fix the overflow |
| 3.6 | **P2** | Rounded-rect buttons; amber reads darker than token | **Pill** buttons (`--radius-pill`) with glow shadows (`--glow-fab` on amber, green glow on Navigate); amber = `--amber #e0a23c` — don't redarken it |
| 3.7 | **P2** | Find hint collapsed to a single strip | Hint card **expanded by default** with lightbulb icon + hint text (chevron to collapse) |
| 3.8 | **P1** | Page ends after About | Missing sections: **"Your photos"** (unfound state: nudge copy "Log this find to start your photo collection."; found: photo row + dashed ADD tile) and **"Recent finds"** (header + "+N this week" green mono + 3 rows of avatar/name/relative time) |

## 4. Already logged — ref `06-already-logged-3.4.png` · spec §3.4 · source `FindSuccess.jsx` (`already`)

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 4.1 | **P2** | Meta line `#001` only | `#001 · {City}` (mono, dot separator) |
| 4.2 | P3 | Flat grey background; flat medallion ring | Subtle **green radial wash** at top (`--wash-1` → bg) and a soft glow on the check medallion |
| 4.3 | ✅ | Ringed check medallion, green mono "ALREADY IN YOUR DEX", title, body copy, **Map** (secondary pill) + **View entry** (green pill), no completion bar/badge | Matches — keep. This is the correct §3.4 already-logged variant |

## 5. Global — ref any tab-bar screen · spec §3.2/§4 · source `chrome.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 5.1 | **P1** | Center Find = small grey circle with **+**, inline with the bar | **Raised stamp button**: ~62px circle sitting **above** the bar, 3px `--bg` border ring, Lucide **stamp** icon; grey/`--surface-3` when nothing selected, **amber + `--glow-fab`** once a sight is selected on Map. (Same item as `profile-build-notes.md` §5.1 — one fix clears both.) |

---

**Reference triple for each fix:** PNG (visual ground truth) + spec § (behavior) + kit `.jsx` (exact tokens/styling). Use tokens — never hardcode colors; the accent semantics (green=found, amber=selection/action/progress, blue=info) are the core of the system, and items 1.1/1.2/2.1 are all the same root cause: **state colors drifting from their fixed meanings**.
