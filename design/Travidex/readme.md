# Travidex — Design System

> A travel companion that fuses **geocaching's "go find it" loop** with a **Pokédex of places**: travel a country, discover individual **sights** (collectible "dex entries"), log your finds, and watch the map + an OSRS-Tileman-style **country chunk-map** fill in as you claim cities. **iOS-first (v1).**

This project is the design system: tokens, foundation specimens, reusable components, and a high-fidelity iOS UI kit. Consumers link the root **`styles.css`**.

## Sources
- `Travidex-Screen-Flow-and-Design.md` (root) — **the as-built screen flow & app design** for this iteration. Start here for screens/interactions.
- `uploads/2026-06-08-travidex-travel-dex-design.md` — original approved concept & architecture spec.
- `uploads/2026-06-08-travidex-screen-flow.md` — original screen flow & component inventory.
- Domain: **travidex.com** · Repo: **github.com/nay244/Travidex** (Expo / React Native + TypeScript; Supabase backend).

The **locked** decisions: the five-tab navigation and the accent **semantics**. **Theming** is light-by-default with **dark as a premium (Travidex+) unlock**. Everything else here — type, surfaces, shape, motion, density, iconography, layout building blocks — was designed to fit.

---

## Core Concept & Terminology
| Term | Meaning |
|---|---|
| **Sight** | The collectible dex entry — a landmark, viewpoint, experience, or food spot. Belongs to a city. |
| **Find** | An honor-system log of a sight (comment + optional photos). Powers the feed + completion. |
| **Claim** | A city is *claimed* (green) when you've found **100%** of its sights. |
| **Chunk** | A unit on the country board — a **city** (small/medium countries) or a **state** (large countries, which then drill into their cities). |
| **Hierarchy** | World › Country › [State] › City › Sight. Completion tracked at city, state, country, world. |

---

## CONTENT FUNDAMENTALS — how Travidex talks

**Voice:** an encouraging field guide / trail companion. Knowledgeable but never stuffy; celebratory at the right moments; calm and out-of-the-way the rest of the time.

- **Person:** Address the user as **you** ("3 of 40 found", "Your photos", "Closest to completing"). The app refers to itself rarely and never in the first person.
- **Casing:** **Sentence case** for everything readable — titles, buttons, body ("Log find", "Open map", "Start exploring"). **UPPERCASE** is reserved for small mono **labels** only (`REFERENCE`, `ACCESS · SIZE · BUSYNESS`, `PARIS · 3 OF 40`).
- **Dex framing, lightly:** sights carry a mono dex number (`#017`). Unfound sights read as **unseen / not yet found**, never "locked" in copy (they're always browsable for trip planning). A completed city is **claimed**.
- **Numbers are the story:** completion is always phrased `found / total` ("3 of 40", "2 of 9 cities claimed · 80/140 sights"). Counts and stats sit in **mono**.
- **Tone by moment:**
  - *Discovery / browse:* factual, inviting. "Reference — what to look for."
  - *Action:* short imperative verbs. "Navigate", "Log find", "Submit for review".
  - *Reward:* warm + brief. "Added to your dex!", "Kyoto claimed.", "First find — nice."
  - *Empty states:* a nudge, not an apology. "No finds yet. Tap a pin to start your dex."
  - *Errors:* plain + recoverable. "Couldn't reach the map. Retry."
- **Geocaching vocabulary:** *find · hint · reference photo · Access / Size / Busyness* (the Difficulty/Terrain/Size analog). Keep these exact.
- **No emoji in product copy.** (Tab icons are drawn glyphs, not emoji.) No exclamation-point spam — celebration copy gets at most one.

---

## VISUAL FOUNDATIONS

### Mood
Travidex ships **two themes**. **Light is the default**; **dark is a premium (Travidex+) feature** the user unlocks. Both are cool-neutral so **photography and the live map stay the color**. The UI is quiet — paper-and-glass by day, metal-and-glass by night — and the rewards (green finds, amber progress) sit on top. In **light** the accents are *deep and confident*; in **dark** they *glow* (the reward reads strongest at night). Think *premium field instrument* — a beautifully made tool you fill with your travels.

### Color & theming
- **Themes are CSS only.** Light lives in `:root` (default). Dark is opt-in via **`[data-theme="dark"]`** on `<html>`. **Every token name is identical across themes** — components read `var(--…)` and never branch on theme. Set/remove the attribute to switch; semantic aliases (`--color-found`, `--action-primary`, `--chunk-claimed`, …) resolve to the active theme automatically.
- **Surfaces — light:** `--bg #eceef3` (cool paper) → `--surface-1 #ffffff` (cards) → `--surface-2 #f2f4f8` (insets) → `--surface-3 #e7eaf1` (raised). **dark:** `--bg #0d0f14` → `#12151c` → `#1a1d24` → `#21252f`. Elevation reads through **surface step + soft shadow**, not heavy borders.
- **Borders are hairlines** — dark-ink 7–20% on light, white 6–16% on dark (`--border-subtle/-default/-strong`). Never a hard 1px solid line.
- **Text is cool, never pure** — light `--text-1 #161a21`, dark `--text-1 #f3f6fb`. Three tiers + disabled. `--text-on-accent` flips (white on light's deep accents, near-black on dark's bright ones).
- **Accents carry fixed meaning in both themes** and are the *only* saturated color in the chrome — **deep on light, bright on dark**:
  - 🟢 **Green** (`#1f9d57` / `#4ade80`) — found / claimed / complete / success.
  - 🟠 **Amber** (`#bd7d12` / `#e0a23c`) — in-progress **and** the primary **Log / Find** action.
  - 🔵 **Blue** (`#2f6fe0` / `#8fb6ff`) — personal data / info / type tags.
  - **Dim** (`--locked`) — unseen / locked / disabled.
- **Tints & glows:** each accent has a `-dim` (subtle bg fill), `-line` (border), and `-glow` (drop shadow). Glow is reserved for *found / claimed / reward* — gentle on light, luminous on dark; never glow neutral chrome.
- **Map & wash tokens** (`--map-land/-water/-road…`, `--wash-1/-2`) and the photo-placeholder (`--ph-base/-stripe`) are themed too, so the map, hero washes, and placeholders adapt automatically.

### Type
- **Space Grotesk** — all UI text, headings, body. Geometric, a little technical, very legible on dark.
- **Space Mono** — every piece of **data**: dex numbers, coordinates, distances, stat values, and UPPERCASE tracked labels. This mono/sans split is the system's signature: prose in Grotesk, *instrument readouts* in Mono.
- Display 34 / H1 27 / H2 21 / H3 17 / body 15 / caption 13; mono labels 11 tracked `0.12em`. Never below 13px for readable UI text.
- Tight negative tracking on large headings (`-0.02em`); generous positive tracking on uppercase mono labels.

### Shape & surface
- **Rounded, layered, hairline-bordered.** Cards `--radius-lg 18px`; sheets/hero `--radius-xl 24px`; bottom-sheet top corners `30px`; chips/pills full-round.
- **Glass over the map:** overlays floating on the live map use `--surface-overlay` + `backdrop-filter: blur(20px)` so the map shows through. Solid surfaces everywhere else.
- **Top sheen** (`--sheen`) on raised surfaces for a subtle machined-edge highlight (themed per mode).

### Imagery
- Travel photography is full-bleed and the hero of every Sight. **Reference photos** are framed as "what to look for"; **your photos** are the personal collection.
- Where a real image isn't available, use the **striped placeholder** (`.tvx-photo-ph` with a `data-label` like `reference photo`) — a subtle diagonal hatch + lowercase mono caption. Never hand-draw a fake photo.
- Found heroes are full-color; **unseen** sights render their hero **dimmed/desaturated** (you haven't "developed" it yet).

### Depth, shadow, blur
- Ambient shadows are soft (cool-ink on light, black on dark) — `--shadow-sm/-md/-lg`; the bottom sheet casts an upward `--shadow-sheet`; the Find FAB carries `--glow-fab`. All themed.
- Backdrop blur 10/20/32px strictly for glass overlays and modal scrims.

### Motion & interactivity
- **Snappy & physical on reward**, smooth & quiet elsewhere. `--ease-spring` (slight overshoot) for find-success stamp, completion-ring fill, claimed-chunk pop; `--ease-sheet` for the iOS bottom-sheet drag/snap; `--ease-out` for screen content.
- **Press states:** rows & buttons squash to `--press-scale 0.97`; small icon buttons to `0.94`; accent fills brighten (`--press-bright`). Always `prefers-reduced-motion` aware (tokens zero out).
- **Pin ⇄ row sync**, sheet snap points (peek / half / full), pull-to-refresh, and the find-success celebration are the signature interactions.
- **Hover** is not a primary target (touch device); states are tap/press + selected.

### Layout building blocks
- **Three snap-point bottom sheet** is the core surface on Map (peek shows the completion header; half shows the list; full covers the map).
- **iOS chrome:** 54px status bar safe area, 52px nav header, 84px tab bar with a **raised center stamp action** (the Log-find button — grey/disabled until a sight is selected, amber/active after), 34px home indicator. Default screen gutter 16px (20px on detail/onboarding).
- **Sight list rows** carry a thumbnail (found = full image, **unfound = hollow** box w/ faint icon), dex #, name, and a **"see more" chevron** that opens the entry; tapping the row itself **selects** the sight (enabling the stamp). Region-dex rows add type chips, a top-right favorite, and a bottom-right dex number.
- Content caps at 440px wide so the kit also reads on larger viewports (centered, letterboxed on `--bg`).

---

## ICONOGRAPHY
- **Lucide** (line icons) is the system — even 1.75px stroke, rounded caps, matches Space Grotesk's geometry. Loaded from CDN in specimens/kits (`lucide@latest`). *Substitution note: Lucide is chosen as the icon system; swap to a licensed set at build time if preferred.*
- **Line by default; state gets fill + glow.** Inactive tab icons are line/`--text-3`; the active tab icon fills with `--text-1`. A *found* check and *claimed* chunk use filled glyphs in `--green`.
- **Tab glyphs:** Map = `map`, Explore = `compass`, **Find = `stamp`** (raised center action — logs a find; enabled only once a sight is selected), Community = `users`, Profile = `user`.
- **No emoji** in the UI. The doc's 🗺️🧭⊕👥👤 are shorthand for *us*, not the rendered app — render Lucide glyphs instead.
- **Brand mark:** `assets/travidex-mark.svg` — a chunk tile filling green with a found pin dot (basic shapes only; no illustrative SVG elsewhere).

---

## INDEX / MANIFEST

**Root**
- `styles.css` — global entry (import-only). Link this.
- `readme.md` — this guide. · `SKILL.md` — portable skill manifest.

**`tokens/`** — `colors.css` · `typography.css` · `spacing.css` · `elevation.css` · `motion.css` · `base.css`

**`assets/`** — `travidex-mark.svg` (brand mark)

**`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand) rendered in the Design System tab.

**`components/`** — reusable primitives (see each `*.prompt.md`):
- `core/` — Button · Avatar · TypeTag · Badge
- `navigation/` — TabBar · NavHeader · SegmentedControl · SearchBar
- `dex/` — SightPin · SightRow · CompletionBar · CompletionRing · ChunkTile · StatTile · BadgeChip · FindFeedItem
- `feedback/` — BottomSheet · Toast · EmptyState

**`ui_kits/travidex-ios/`** — interactive iOS app (open `index.html`; `overview.html` shows hero screens side-by-side). Screens: **Welcome · Map Home · Sight Detail · Find Success** (+ already-logged) **· Explore Chunk-Map** (country switcher + Country›State›City) **· Region Dex · Community · Profile** (art background, stats, world, badge/achievement rails) **· Monthly Badges · Achievements** (+ detail) **· Profile Art · Appearance**. See `Travidex-Screen-Flow-and-Design.md` for the full flow, interactions, and data model.
