---
name: travidex-design
description: Use this skill to generate well-branded interfaces and assets for Travidex (a travel "dex" — geocaching meets a Pokédex of places), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

Travidex is a travel app where users find real-world sights, log them, and fill in a travel dex city-by-city. It ships **two themes — light is the default, dark is a premium (Travidex+) unlock** — both cool-neutral. The system's signatures: **Space Grotesk** for UI + **Space Mono** for all data (dex numbers, coords, stat values, labels); accents with fixed meaning that are **deep on light and glow on dark** (🟢 green = found/claimed, 🟠 amber = in-progress + the Log/Find action, 🔵 blue = personal/info); rounded layered surfaces with hairline borders and glass over the map; snappy spring motion on reward moments. The collector's-board (OSRS-Tileman chunk-map) is the soul of the brand. **Found vs. unfound is the spine of the UI** — found entries show full-color imagery, unfound are hollow/dim — everywhere (sight rows, region-dex, achievements).

Key files:
- `Travidex-Screen-Flow-and-Design.md` — **the as-built screen flow, interactions & data model** (Welcome, Map, Sight Detail, Find Success + already-logged, Explore chunk-map w/ country switcher + Country›State›City, Region Dex, Community, Profile, Monthly Badges, Achievements, Profile Art, Appearance). Read this for how screens connect.
- `styles.css` — link this; it imports the fonts + all tokens (`tokens/`).
- `readme.md` — full design guide (content voice, visual foundations, iconography, manifest).
- `components/` — React primitives (`core/`, `navigation/`, `dex/`, `feedback/`) with `.d.ts` + `.prompt.md`.
- `ui_kits/travidex-ios/` — the interactive iOS prototype (`index.html`) + a side-by-side `overview.html`.
- `assets/travidex-mark.svg` — brand mark.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand. Use Lucide for icons (line by default; fill + glow for state). Use the striped `.tvx-photo-ph` placeholder wherever real imagery is missing — never hand-draw illustrations.

If the user invokes this skill without other guidance, ask them what they want to build or design, ask a few questions, and act as an expert Travidex designer who outputs HTML artifacts _or_ production code, depending on the need.
