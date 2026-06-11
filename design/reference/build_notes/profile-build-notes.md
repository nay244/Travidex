# Travidex — Profile Build Notes (test build vs. design reference)

**Date:** 2026-06-11 · **Scope:** Profile, Monthly badges, Achievements, Profile art picker (+ one global tab-bar item).
**Compare against:** `design-reference/screens/` PNGs · behavior spec: `Travidex-Screen-Flow-and-Design.md` (§ refs below) · live source: `ui_kits/travidex-ios/*.jsx`.

Each item is a concrete visual difference between the test build and the design. Fix priority: **P1** = core pattern wrong, **P2** = anatomy/styling drift, **P3** = copy/polish.

---

## 1. Profile — ref `15-profile-3.8.png` · spec §3.8 · source `Profile.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 1.1 | **P1** | Profile art as a **banner card** behind the avatar | Selected art fills the **entire screen** as a background layer (`ArtLayer` behind everything) with a `--art-veil` overlay for legibility; all content cards float above it |
| 1.2 | **P1** | Badges / Achievements as **nav list rows** with chevrons | Each is a **horizontal rail of exactly 4 medallions** (most-recent earned; **lock placeholders** fill empty slots until 4 earned) + a small round `>` button in the section header opening the full page |
| 1.3 | **P2** | One white stats card with dividers (Sights · Cities · Countries) | **Three separate StatTiles** (`--surface` tiles, hairline inset) with icons map-pin / flag / globe, mono values, uppercase mono labels |
| 1.4 | **P2** | No world progress | **World completion card** between stats and rails: `CompletionRing` (62/400) + "World completion" + mono "62 / 400 sights · 3 countries started" |
| 1.5 | **P2** | Username only | **Display name** (sans 700) + mono meta line `@handle · SINCE 2026`; avatar 80px with bg ring |
| 1.6 | **P2** | Settings as a list row | **Gear chip top-right** (glass circle); "Customize" section contains only **Appearance** (theme + `TRAVIDEX+` tag when not premium) and **Profile art** (live art thumbnail swatch, not a glyph) |
| 1.7 | P3 | Photo journal row | Not in current Profile spec — remove or propose as an addition |

## 2. Monthly badges — ref `16-monthly-badges-3.9.png` · spec §3.9 · source `ProfilePages.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 2.1 | **P1** | Earned months = generic **green check** medallion | Earned months show their **month-specific badge design**: themed icon medallion (e.g. June = mountain) with tone-tinted radial fill + tone ring + soft glow (`Medallion icon tone earned`) |
| 2.2 | **P2** | Month labels in mono caps (JAN, FEB) | **Full month names** ("January") in sans 600; build's mono-caps voice is reserved for data labels |
| 2.3 | ✅ | Year sections, green `N/12` counter, 3-col grid, lock placeholders for future months | Matches — keep |

## 3. Achievements — ref `17-achievements-3.10.png` · spec §3.10 · source `ProfilePages.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 3.1 | **P1** | 2-up **white cards** each with name + progress bar | **3-column grid of bare medallions** (84px) — count badge ON the medallion (bottom-right), name below, mono caption `LVL n · n/max`. The **progress bar lives only in the tap-detail overlay** (§3.10 detail: big medallion + current/target bar + how-to-unlock copy) |
| 3.2 | **P1** | Locked entries styled like earned ones (0 progress) | Locked = **hollow dim icon** (the achievement's own glyph, `--locked` color, no fill/ring glow) + mono caption `LOCKED`; tapping opens the how-to-unlock detail |
| 3.3 | **P2** | All medallion icons neutral grey | Each achievement has a fixed **tone** (green/amber/blue) tinting its earned medallion (fill + ring + icon) |
| 3.4 | **P2** | No page header line | Header row: **"Awards"** (sans 700) + green mono `4/8 unlocked` right-aligned |

## 4. Profile art picker — ref `19-profile-art-picker-3.11.png` · spec §3.11 · source `ProfileArt.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 4.1 | **P1** | Tiles are **flat gradient blocks** | Each of the six arts (Trailhead, Tileman, Aurora, Passport, Topographic, Summit) renders its **distinct preview artwork** (`ArtLayer` in the tile); **locked tiles show the art dimmed** behind the lock |
| 4.2 | **P2** | Locked tiles: criteria text only | Criteria **plus a progress bar** toward the unlock (e.g. "Claim 3 cities · 2/3") |
| 4.3 | **P2** | Pushed as a full page | **Bottom sheet over the dimmed Profile** (drag handle, 2-col grid, scrim) — acceptable as a page on small screens, but sheet is the spec |
| 4.4 | ✅ | Selected ring + check, `N/M UNLOCKED` counter | Matches — keep |

## 5. Global — ref any tab-bar screen (e.g. `15-profile-3.8.png`) · spec §3.2/§4 · source `chrome.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 5.1 | **P1** | Center tab button = small grey circle with **+**, inline with the bar | **Raised stamp button**: ~62px circle sitting **above** the bar with a 3px `--bg` border ring; **stamp icon** (Lucide `stamp`), grey/`--surface` when disabled, **amber + glow** (`--glow-fab`) when a sight is selected on Map |

## 6. Stale copy in OUR docs (design-side fix, not build)

| # | Where | Issue |
|---|---|---|
| 6.1 | Profile art picker subtitle (prototype + spec §3.11 + ref PNG 19) | Says "Unlock new **banners**…" — pre-background-art language. Should read: "Unlock new **backgrounds** as you find sights, claim cities, and explore countries." Regenerate `19-profile-art-picker-3.11.png` after fixing. |

---

**Reference triple for each fix:** PNG (visual ground truth) + spec § (behavior) + kit `.jsx` (exact styling/tokens). Match tokens — never hardcode colors; light/dark both come from the same component via `[data-theme]`.
