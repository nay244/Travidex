# Travidex — Running Deviations Log

Living record of every place the build intentionally deviates from the design reference
(`design/reference/screens/` + `Travidex-Screen-Flow-and-Design.md` + `ui_kits/travidex-ios/`).
Updated every build round. Each entry: what differs, why, and what would close it.

**Status legend:** `STANDING` = accepted trade-off, revisit only if priorities change ·
`PENDING-DEP` = closable, but needs a new native dependency (= a new EAS build, not OTA) ·
`DEFERRED-FEATURE` = needs product/backend work beyond styling.

---

## Visual / component

| Area (§) | Deviation | Why | Closes with | Status |
|---|---|---|---|---|
| Profile §3.8 world card | Completion ring is a bordered circle + mono fraction, not a true progress arc | Arc needs `react-native-svg` (native module → breaks OTA fingerprint) | Add react-native-svg in the next planned native build | PENDING-DEP |
| Explore §3.5 chunk tile fill | Gradient fill approximated with 3 stacked translucent `amberDim` Views (opacities 1 / 0.66 / 0.33, heights pct / pct×1.15 / pct×1.3) rather than a true `linear-gradient` | `expo-linear-gradient` is a native module; OTA constraint prohibits new native deps | Add expo-linear-gradient in the next planned native build | PENDING-DEP |
| Profile art §3.11 | Picker is a pushed page, not a bottom sheet over dimmed Profile | Build notes 4.3 explicitly allow page on small screens | Sheet variant if requested | STANDING |
| Tab bar §4 | Stamp icon is MaterialCommunityIcons `stamper`, not Lucide `stamp` | No Lucide pack; closest glyph in the bundled icon set | Custom SVG asset in a native build | STANDING |
| Monthly badges §3.9 | Some month icons are Ionicons stand-ins for the kit's Lucide icons (e.g. footprints → `trail-sign-outline`) | Glyph availability | Custom icon set | STANDING |
| Flags (Welcome/A pickers) | USA flag renders without star dots at small sizes; unknown country codes render a neutral box | Sub-pixel stars; graceful fallback for unseeded countries | More flag specs in `Flag.tsx` FLAGS (copy-a-line) | STANDING |
| Highlights §3.6.1 | Card capture is client-side PNG via view-shot (no server-side render) | Sufficient for system share sheet | Server render if share quality demands it | STANDING |
| Map rows §3.2 | Meta line shows found status without the "1.2 km" distance | Device geolocation not wired (location remains optional/off by default) | Read position when the user's location toggle is on | DEFERRED-FEATURE |
| Sight photos | Hero/thumb "photos" are striped/hollow placeholder treatments | No reference imagery in the catalog yet (`reference_photo` is null for seeds) | Populate `reference_photo` URLs; components already branch on found | DEFERRED-FEATURE |

## Behavior / feature

| Area (§) | Deviation | Why | Closes with | Status |
|---|---|---|---|---|
| Highlights §3.6.1 | "Share to friends" (in-app feed post) disabled; only system-share ships | The feed has no post entity (finds only) | Feed `posts` table + card type | DEFERRED-FEATURE |
| Highlights §3.6.1 | Save image / Messages / Stories all route via the system share sheet (`expo-sharing`); no direct Photos/Messages/Stories API integrations | Direct integrations require native modules (MediaLibrary, MessageUI, etc.) beyond OTA constraint | Add native integrations in a planned native build | PENDING-DEP |
| Highlights §3.6.1 | "Copy link" chip disabled; no deep-link URL generated | Requires `expo-clipboard` (native module) and a deep-link resolver service | Add expo-clipboard + link service | PENDING-DEP |
| Community §3.7 | Like count toggles in-session only (not persisted); comment count is static 0 | No `find_likes`/`find_comments` backend tables yet; local `useState` per FeedCard satisfies kit "toggles locally" behavior | `find_likes`/`find_comments` pipeline for persistence | DEFERRED-FEATURE |
| Hidden gems §3.7.1 | "Nearby" sorts by distance from the active city's center, not device GPS | Spec's own location-off fallback; geolocation unwired | Use position when location toggle on | DEFERRED-FEATURE |
| gems-check §3.7.1 | Automated checks = profanity wordlist + 50 km geo sanity; no image-safety classification | Needs an external classifier service | Vision-moderation API in the edge function | DEFERRED-FEATURE |
| Monthly badges §3.9 | A month is "earned" by ≥1 find that month (local time) — the kit's per-month *challenges* are not modeled | No challenge system in the data model | Challenge definitions + tracking | DEFERRED-FEATURE |
| Sight Detail unlog §3.4 | Unlogging a find does not revoke previously-awarded badges or stats | Lazy award model; acceptable for accidental-log fixes (badges are commemorative, not a live reflection of current finds) | Badge-revocation pipeline if product demands it | STANDING |
| Profile §3.8 header | `@handle · SINCE {current year}` — join year is not the real account creation date | `profiles` has created_at but isn't fetched here yet | Read created_at with the profile | STANDING (small) |
| Region Dex §3.6 | Full-width green "Open map" button replaced by a compact glass chip (`open-map-chip`, Ionicons `map-outline`) in the header row | Spec has no map link; full-width button removed per build notes 2.3; chip preserves the capability without dominating the layout | Remove if product decides map access belongs elsewhere | STANDING |

## Resolved (was a deviation, now closed)

| Area | Was | Closed in |
|---|---|---|
| Find Success §3.4 | No confetti specks | round 6 (core loop) |
| Glass aesthetic | Solid surfaces instead of blur | round 4 (`expo-blur` build) |
| Blue medallion glow | `blueDim` fallback | round 5 (`blueGlow` token) |

---

*Maintenance rule: every build round that accepts a gap adds a row here in the same commit; closing one moves it to Resolved.*
