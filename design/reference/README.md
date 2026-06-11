# Travidex — Screen Reference (for Claude Code)

PNG captures of every screen in the Travidex iOS prototype, rendered from the live design-system components (light theme, 402×874 logical px). Use them as **visual ground truth** when implementing screens.

Each filename ends with its section ref in `Travidex-Screen-Flow-and-Design.md` — e.g. `09-region-dex-3.6.png` ↔ spec §3.6. Read the spec section for behavior/interactions; use the PNG for layout, spacing, color, and state styling. The live source for each screen is the matching file in `ui_kits/travidex-ios/` (e.g. `RegionDex.jsx`).

| File | Screen | Spec | Source file |
|---|---|---|---|
| `01-welcome-3.1.png` | Welcome (flag collector's board, auth) | §3.1 | `Welcome.jsx` |
| `02-map-home-3.2.png` | Map Home (dex sheet, selected sight, stamp FAB enabled) | §3.2 | `MapHome.jsx` |
| `03-location-switcher-3.2.png` | Location switcher sheet over Map | §3.2 | `LocationPicker.jsx` |
| `04-sight-detail-3.3.png` | Sight Detail (found entry) | §3.3 | `SightDetail.jsx` |
| `05-find-success-3.4.png` | Find Success — new find (stamp, confetti, badge) | §3.4 | `FindSuccess.jsx` |
| `06-already-logged-3.4.png` | Already logged (no progress bar; Map / View entry) | §3.4 | `FindSuccess.jsx` (`already`) |
| `07-country-chunk-map-3.5.png` | Explore — Japan city chunk board | §3.5 | `ChunkMap.jsx` |
| `08-us-states-board-3.5.png` | Explore — US states board (two-tier) | §3.5 | `ChunkMap.jsx` (`tier:"states"`) |
| `09-region-dex-3.6.png` | Region Dex (found=image / unfound=hollow) | §3.6 | `RegionDex.jsx` |
| `10-region-highlights-3.6.1.png` | Region Highlights (share card + photo selection) | §3.6.1 | `RegionHighlights.jsx` |
| `11-community-friends-3.7.png` | Community — Friends tab | §3.7 | `Community.jsx` |
| `12-friends-list-3.7.png` | Friends list page | §3.7 | `Community.jsx` (`FriendsList`) |
| `13-hidden-gems-3.7.png` | Community — Hidden gems tab | §3.7 | `Community.jsx` (`GemsTab`) |
| `14-share-hidden-gem-3.7.png` | Share a hidden gem sheet (moderation) | §3.7 | `ShareGem.jsx` |
| `15-profile-3.8.png` | Profile (art background, rails) | §3.8 | `Profile.jsx` |
| `16-monthly-badges-3.9.png` | Monthly badges page | §3.9 | `ProfilePages.jsx` |
| `17-achievements-3.10.png` | Achievements grid | §3.10 | `ProfilePages.jsx` |
| `18-achievement-detail-3.10.png` | Achievement detail (how to unlock) | §3.10 | `ProfilePages.jsx` |
| `19-profile-art-picker-3.11.png` | Profile art picker sheet | §3.11 | `ProfileArt.jsx` |
| `20-appearance-3.12.png` | Appearance (light/dark, premium) | §3.12 | `Appearance.jsx` |

Notes:
- Striped boxes are **photo placeholders** (`.tvx-photo-ph`) — real photos in production.
- Dark theme is the same layout with `[data-theme="dark"]` tokens; don't branch components on theme.
- `rig/capture.html` regenerates these: open it, call `showScreen(i)`, screenshot, crop to the centered 402:874 region.
