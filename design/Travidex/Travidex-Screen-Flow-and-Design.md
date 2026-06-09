# Travidex — Screen Flow & App Design (Current Iteration)

**Status:** Built & verified — light/dark themes, interactive iOS prototype.
**Companion to:** the original `2026-06-08-travidex-screen-flow.md` and `2026-06-08-travidex-travel-dex-design.md`. This file supersedes them with the **as-built** design.
**Audience:** Claude Code / engineering. Pair this with `readme.md` (design-system guide) and `SKILL.md`.

---

## 0. What Travidex is

A travel companion that fuses **geocaching's "go find it" loop** with a **Pokédex of places**. You travel a country, discover individual **sights** (collectible "dex entries"), **log** your finds (honor-system), and watch the map + a **chunk-map** of the country fill in as you **claim** cities. **iOS-first.**

**Core nouns**
| Term | Meaning |
|---|---|
| **Sight** | A collectible dex entry — landmark, viewpoint, experience, food spot. Belongs to a city. Has a dex number (`#001`), types, Access/Size/Busyness, hint, reference photo, your photos. |
| **Find** | An honor-system log of a sight (you visited it). Found sights render in full color; unfound are hollow/dim. |
| **Claim** | A city is *claimed* when 100% of its sights are found. |
| **Chunk** | A unit on the country board: a **city** (small/medium countries) or a **state** (large countries). |
| **Hierarchy** | World › Country › [State] › City › Sight. |

**The two emotional peaks:** the **Find Success** stamp (logging a new find) and a **claimed** chunk turning green.

---

## 1. Design language (as built)

> Full detail in `readme.md`. Summary for engineers below.

- **Two themes, CSS-only.** **Light is default** (`:root`); **dark is a premium "Travidex+" unlock** (`[data-theme="dark"]` on `<html>`). Every token name is identical across themes — components read `var(--…)` and never branch on theme.
- **Type:** `Space Grotesk` for all UI/headings/body; `Space Mono` for **all data** (dex numbers, coordinates, distances, stat values, UPPERCASE tracked labels). The mono/sans split is the system's signature.
- **Accents carry fixed meaning** and are the only saturated color in the chrome — **deep on light, bright + glowing on dark**:
  - 🟢 **green** = found / claimed / success
  - 🟠 **amber** = in-progress **and** the primary Log/Find action
  - 🔵 **blue** = personal data / info / type tags
  - **dim/locked** = unseen / disabled
- **Surfaces:** rounded, layered, hairline-bordered; glass (`backdrop-filter`) on anything floating over the live map. Cool-neutral light, cool blue-black dark.
- **Imagery:** travel photography is the hero. Missing images use the striped `.tvx-photo-ph` placeholder. **Found = full-color image; unfound = hollow/dim** (mirrored consistently across sight rows, region-dex rows, achievement medallions).
- **Motion:** snappy spring on rewards (stamp pop, ring/bar fill, claimed-chunk pop); smooth elsewhere; respects `prefers-reduced-motion`.
- **Icons:** Lucide (line by default; filled/glow for state).

**Token files:** `tokens/colors.css` (themed palette + map/wash/placeholder tokens), `typography.css`, `spacing.css`, `elevation.css` (themed shadows/glows), `motion.css`, `base.css`. Consumers link the root **`styles.css`** which imports them.

---

## 2. Navigation model

**Five-tab bottom bar** (glass over the map), with a **raised center action button**:

```
[ Map ]  [ Explore ]  ( ⬗ Find )  [ Community ]  [ Profile ]
```

- The center button is a **stamp** (= "log a find"). It is **disabled until the user selects a sight from the Map list**; once a sight is selected it turns amber/active and tapping it logs that find.
- Tabs Map / Explore / Community / Profile switch the base screen.
- **Overlays** stack above the tab bar with this z-order: tab bar (40) < Region Dex (46) < Sight Detail (47) < Find Success / Achievement Detail (48) < Appearance / Profile-Art / Country picker sheets (30–60 as modal sheets).

**First run:** `Welcome` (auth) → enters the app on the **Map** tab.

---

## 3. Screens (as built)

Each screen below maps to a file in `ui_kits/travidex-ios/`. The kit is a React-in-Babel prototype; the app shell + state live in `app.jsx`.

### 3.1 Welcome — `Welcome.jsx`
First-run / auth. Hero is a **collector's board** motif: a tilted grid of mini chunk tiles (some green/claimed, some amber/in-progress, most waiting) fading into the page — the brand's first impression. Wordmark + headline ("Collect the world, one sight at a time.") + **Sign in with Apple** (adapts black/white by theme), **Continue with email**, and **Log in**. Any auth action → enters app on Map.

### 3.2 Map Home — `MapHome.jsx`
The everyday home. A stylized (CSS) map with **sight pins** (green=found, dim=unseen, amber+enlarged=selected) under a **three-snap bottom sheet** (peek / half / full, draggable by the handle).
- Top glass overlays: search field, filter button, a **city pill** (e.g. "Kyoto"), and a recenter button.
- Sheet header: city name + `found / total` + completion bar. **No sort tabs** — the list is shown in **dex-number order**.
- **List rows** (`SightRow`): thumbnail (found = full image, unfound = **hollow** box w/ faint icon), dex `#`, name, distance/status, and a **"see more" chevron** on the right that opens **Sight Detail**.
- **Selecting** a row (tapping the row, not the chevron) highlights it, shows a "Selected … TAP TO LOG" banner, and **enables the center stamp FAB**. Tapping the FAB logs that sight (→ Find Success), or shows the already-logged notice if it's already found.
- Pin ⇄ row selection is synced.

### 3.3 Sight Detail — `SightDetail.jsx`
The full dex entry. Hero reference photo (full-color if found, dimmed if unseen), `#dex` + Found badges, type tags, **Access · Size · Busyness** stat strip (the geocaching D/T/Size analog), **Navigate** (green) + **Log find** (amber) actions (inline only — no duplicate sticky bar), a collapsible **find hint**, About, **Your photos**, and **Recent finds**. Tapping **Log find** runs the same `attemptLog` logic as the FAB.

### 3.4 Find Success — `FindSuccess.jsx`
The reward moment, with two modes:
- **New find (default):** green **stamp** pop + confetti, "Added to your dex", sight name + `#`, the city **completion bar** filling, and a **badge-unlock** card when a milestone is hit. Buttons: **Done** / **View entry**.
- **Already logged** (`already` prop): shown when the user stamps a sight that's **already found**. Calm notice — "Already in your dex", sight name + `#`, copy ("You've already logged this find."), **no completion bar, no badge, no confetti**. Buttons: **Map** / **View entry**.

### 3.5 Explore: Country Chunk-Map — `ChunkMap.jsx`
The OSRS-Tileman-style board for the selected country.
- **Country switcher:** a pill at the top showing **flag + country code** (🇯🇵 JP, 🇺🇸 US). Tapping opens a **Country picker** sheet (each country shows a completion ring + claimed count + "search 60+ more countries").
- **Two tiers** (from the data model):
  - `tier: "cities"` (e.g. Japan, France) → board tiles are **cities**. Tapping a city → **Region Dex**.
  - `tier: "states"` (e.g. United States) → board tiles are **states**. Tapping a state **drills in** to that state's **cities** (breadcrumb "‹ {country} · all states" returns). Tapping a city → Region Dex. This is the **Country › State › City** path for large countries.
- Each tile (`Chunk` in `primitives.jsx`) fills from the bottom with completion (gradient, no hard line through the label): **green = claimed/complete, amber = in-progress, dim = untouched**. Header shows a ring + claimed/total + sights; legend + free-exploration hint below.

### 3.6 Region Dex — `RegionDex.jsx`
A **Pokédex-style list of every sight in a region** (opened from a city tile on Explore). Sticky header (back + city name + `found/total`) with a **search field** + sort/filter icon buttons. Each row:
- thumbnail (found = full image, unfound = **hollow** dim box),
- name + **type chips** (icon + label, colored by type),
- **favorite heart** at the **top-right**,
- **dex number** (`#NNN`, mono) at the **bottom-right**,
- subtle type-tinted background for found entries.
Search filters by name; tapping a row → **Sight Detail**. Works at the city level for both country tiers (incl. US state→city→region-dex).

### 3.7 Community — `Community.jsx`
The finds feed. Segmented filter (Friends / Global / Nearby) + a list of `FindFeedItem`-style cards: "{user} found {sight} in {city}", relative time, photo, like + comment counts (like toggles locally).

### 3.8 Profile — `Profile.jsx`
Duolingo-inspired, top to bottom, with the selected **Profile Art as a full-screen background** (veiled for legibility via `--art-veil`):
1. **Identity:** avatar + name + @handle + member-since; a settings gear (→ Appearance).
2. **Stats row:** Sights / Cities / Countries.
3. **World completion** card (ring + counts).
4. **Badges rail:** the 4 most-recent earned monthly badges as medallions; empty slots show a **lock placeholder** until 4 exist; a **`>`** opens the Badges page.
5. **Achievements rail:** 4 earned achievement medallions (+ lock placeholders); a **`>`** opens the Achievements page.
6. **Customize:** **Appearance** row (theme; Travidex+ lock) and **Profile art** row (current art + swatch).

### 3.9 Monthly Badges page — `ProfilePages.jsx` › `BadgesPage`
Opened from the Profile Badges rail `>`. Badges are awarded for **monthly quotas** (e.g. "10 photos in a month"), **grouped by year**. Each year section is a 3-column grid of 12 months: earned months show a themed collectible **medallion** (icon + tone), future/locked months show a **lock**. (`BADGE_YEARS` in `data.jsx`.)

### 3.10 Achievements page + detail — `ProfilePages.jsx` › `AchievementsPage`, `AchievementDetail`
Opened from the Profile Achievements rail `>`. A grid of **leveled** achievements: earned ones are colored medallions with a value + `LVL n`; **locked ones are hollow dim icons** labeled LOCKED. Tapping any opens a **detail overlay**: large medallion, a `current/target` progress bar, and the unlock explanation ("how to unlock" for locked; "keep going…" for earned). Close (✕) returns. (`ACHIEVEMENTS` in `data.jsx`.)

### 3.11 Profile Art picker — `ProfileArt.jsx`
Opened from the Customize → Profile art row. A grid of **unlockable banner/background designs** (`PROFILE_ART` + `ArtLayer` in `art.jsx`). Each is a token-driven CSS layer (themes automatically). **Unlocks tie to progress** (e.g. "Claim 1 city", "Explore 3 countries", "Find 100 sights"); locked designs show criteria + a progress bar; selecting an unlocked one sets it as the profile background.

### 3.12 Appearance — `Appearance.jsx`
Opened from the gear or the Customize → Appearance row. Light/Dark theme cards. **Light is free; Dark is premium-locked** (shows a Travidex+ lock). An **"Unlock dark mode"** upsell flips the theme so the user can preview it. Setting the theme writes `data-theme` on `<html>`.

---

## 4. Component inventory

Reusable primitives live in `components/` (each with `.jsx` + `.d.ts` + `.prompt.md`; group preview cards as `*.card.html`). The kit re-implements lightweight versions in `ui_kits/travidex-ios/primitives.jsx` so the prototype runs standalone.

| Group | Components |
|---|---|
| **core** | `Button` (amber primary / green positive / secondary / ghost), `Avatar`, `TypeTag` (blue category chip), `Badge` + `CountBadge` |
| **navigation** | `TabBar` (5-tab + raised center action), `NavHeader`, `SegmentedControl`, `SearchBar` |
| **dex** | `SightPin`, `SightRow`, `CompletionBar`, `CompletionRing`, `ChunkTile`, `StatTile`, `BadgeChip`, `FindFeedItem` |
| **feedback** | `BottomSheet` (3 snap points), `Toast`, `EmptyState` |

**Kit-only composites** (in `ui_kits/travidex-ios/`): `Medallion` (collectible badge/achievement, earned/hollow) and `ArtLayer` (profile-art backgrounds) in `ProfilePages.jsx` / `art.jsx`; the stylized `MapBg`, `Chunk`, `Pin`, `Ring`, `CBar`, `Seg`, `StatTile`, `SightRow`, `Btn`, `Press`, `Icon` in `primitives.jsx`.

---

## 5. Interaction / navigation graph

```
Welcome ──auth──▶ App (Map tab)

Bottom tabs: Map ⇄ Explore ⇄ Community ⇄ Profile        Center: ⬗ Find (stamp)

MAP
  pin/row tap ........... select sight (enables ⬗); pin⇄row synced
  row "see more" ▶ ...... Sight Detail
  ⬗ Find (enabled) ...... attemptLog(selected):
                            • unfound → Find Success (new: stamp + bar + maybe badge)
                            • found   → Find Success (already: notice, no bar/badge)
  Sight Detail
    "Log find" .......... attemptLog(sight)   (same branch as ⬗)
    "Navigate" .......... (map directions)
  Find Success
    Done / Map .......... back to Map
    View entry .......... Sight Detail

EXPLORE
  country pill ▶ ........ Country picker → switch country (resets drilldown)
  tier "cities": city tile ▶ ........ Region Dex
  tier "states": state tile ▶ ....... state's city board (breadcrumb back)
                 city tile ▶ ........ Region Dex
  Region Dex
    search .............. filter rows by name
    favorite heart ...... toggle (top-right)
    row tap ▶ .......... Sight Detail

PROFILE
  gear / Appearance row ▶ ...... Appearance (theme; Dark = Travidex+)
  Profile art row ▶ ............ Profile Art picker (progress-locked designs)
  Badges rail ">" ▶ ........... Monthly Badges page (per-year month grids)
  Achievements rail ">" ▶ ..... Achievements page ─tap medallion▶ Achievement Detail
```

**Shared logic in `app.jsx`:** `attemptLog(sight)` (found→already / unfound→log), `logFind` (mutates the sights array + opens Find Success + computes badge), theme state (`data-theme`), `premium` flag, `mapSelected`, `regionDex`, `profileArtId`, and which overlay/page is open.

---

## 6. Data model (sample data — replace with backend)

In `ui_kits/travidex-ios/data.jsx`:
- `KYOTO_SIGHTS` — full sight objects: `{ id, dexNo, name, found, distance, types[], access, size, busy, about, hint, x, y }`.
- `COUNTRIES` — `{ code, name, flag, tier: "cities"|"states", cities[] | states[] }`.
  - city: `{ city, region, found, total }`
  - state: `{ state, region, cities[] }` (state completion is summed from its cities)
- `cityEntries(city)` — returns the region-dex list for a city (Kyoto uses real sights; others are synthesized from a name/type pool with plausible found states + detail fields).
- `ACHIEVEMENTS` — leveled: `{ id, name, icon, tone, level, maxLevel, current, target, unit, earned, howTo }`.
- `BADGE_YEARS` — monthly: `{ year, months: [{ month, earned, icon?, tone?, task? }] }`.
- `FEED`, `BADGES` (legacy), plus `PROFILE_ART` in `art.jsx` (`{ id, name, free?, criteria, unlock(progress), progress(progress) }`).

**Found/unfound is the spine of the UI** — every list/grid renders found = full image + color, unfound = hollow/dim, and completion drives green/amber/dim everywhere.

---

## 7. File manifest

```
styles.css                      ← link this (imports all tokens + base)
readme.md                       ← design-system guide (voice, color, type, components)
SKILL.md                        ← portable skill manifest
assets/travidex-mark.svg        ← brand mark (chunk tile + found pin)

tokens/      colors.css · typography.css · spacing.css · elevation.css · motion.css · base.css
guidelines/  colors-* · type-* · spacing/radii/elevation · brand-* (DS-tab specimen cards)

components/
  core/        Button · Avatar · TypeTag · Badge            (+ .d.ts, .prompt.md, core.card.html)
  navigation/  TabBar · NavHeader · SegmentedControl · SearchBar
  dex/         SightPin · SightRow · CompletionBar · CompletionRing · ChunkTile · StatTile · BadgeChip · FindFeedItem
  feedback/    BottomSheet · Toast · EmptyState

ui_kits/travidex-ios/
  index.html       ← run the interactive prototype
  overview.html    ← all hero screens side-by-side on a pan/zoom canvas
  app.jsx          ← app shell, navigation + state
  data.jsx         ← sample data + cityEntries()
  primitives.jsx   ← kit-local components (Icon, Press, Btn, Pin, Ring, CBar, Chunk, SightRow, MapBg, …)
  chrome.jsx       ← TabBar (5-tab + stamp FAB) + SAFE_TOP/TAB_H
  art.jsx          ← PROFILE_ART presets + ArtLayer + unlock eval
  Welcome · MapHome · SightDetail · FindSuccess · ChunkMap · RegionDex · Community ·
  Profile · ProfilePages (Badges/Achievements/Detail) · ProfileArt · Appearance .jsx
  ios-frame.jsx · design-canvas.jsx   ← starter scaffolds (device bezel; overview canvas)
```

---

## 8. Notes for implementation

- **iOS-first**; production target is Expo / React Native + TypeScript (Supabase backend per the original brief). The kit is HTML/React-in-Babel for design fidelity — port the layouts/tokens, not the prototype scaffolding.
- **Theming:** keep the "every token name identical across themes" rule; never branch components on theme. Gate dark mode behind the premium flag.
- **Known prototype caveat:** the stamp FAB's grey→amber state swap is instant (a CSS `background` transition was removed because the prototype's rendering engine froze it mid-transition); a native build can animate it normally.
- **Sample content:** US states (6) and non-Kyoto region-dex entries are representative samples to demonstrate the hierarchy/layout; wire real data. Monthly badges & achievements use themed icon-medallions — swap for illustrated artwork if desired.
- **Map** is a CSS abstraction in the kit; production uses a real map SDK (`react-native-maps`) with the same pin/selection/sheet behavior.
