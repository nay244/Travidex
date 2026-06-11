# Travidex — Community Build Notes (test build vs. design reference)

**Date:** 2026-06-11 · **Scope:** Community (Friends tab), Friends list, Hidden gems tab, Share-a-hidden-gem flow.
**Compare against:** `design-reference/screens/` PNGs · behavior spec: `Travidex-Screen-Flow-and-Design.md` §3.7–3.7.1 · live source: `ui_kits/travidex-ios/Community.jsx`, `ShareGem.jsx`.

Priorities: **P1** = core pattern/semantic wrong, **P2** = anatomy/styling drift, **P3** = copy/polish.

> Build screens reviewed: `community_build.jpg`, `friendslist_build.jpg`, `hiddengems_build.jpg`, `sharegem_build.jpg` (Paris data + empty states from a fresh account — fine; reference shows Kyoto + sample content).

---

## 1. Community — Friends tab — ref `11-community-friends-3.7.png` · spec §3.7 · source `Community.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 1.1 | **P2** | Feed cards: text + date + the log comment ("Found!") only | Card anatomy: avatar · "{user} found **{sight}** in {city}" (sight in green) · mono date · **photo block** (placeholder when no photo) · **♥ like count + 💬 comment count row** (heart toggles, green when liked). The user's log comment is fine to show, but the photo + social row are the card's body |
| 1.2 | **P2** | Segmented control: active segment filled **amber** with amber border | Segmented control is **neutral**: `--surface-2` track with a **sliding `--surface-4` thumb** (spring), active label `--text-1` 600 — amber is not a selection color for segs (applies to Friends/Hidden gems here and the sort seg in §3) |
| 1.3 | ✅ | "Your friends" row with count + `>` above the feed; newest-first ordering; sight names in green | Matches — keep. (Stacked avatar initials appear in the row once friends exist) |

## 2. Friends list — ref `12-friends-list-3.7.png` · spec §3.7 · source `Community.jsx` (`FriendsList`)

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 2.1 | **P1** | No "Add a friend" action — empty copy says "search to add one" | A dedicated **"Add a friend" row** (green user-plus chip + label + chevron, green-line ring) sits directly under the search field — it's the discovery/invite entry point. **Search filters your existing friends**; it does not find new users. Keep them separate |
| 2.2 | **P2** | No count label | Mono caps **"N FRIENDS"** section label above the rows (once any exist) |
| 2.3 | P3 | Empty copy "No friends yet — search to add one." | With 2.1 in place: "No friends yet — add one to compare dexes." (nudge toward the Add row, not search). Friend rows when populated: initials avatar · name + @handle · mono "most-recent find · time" · green mono sights count |

## 3. Hidden gems tab — ref `13-hidden-gems-3.7.png` · spec §3.7 · source `Community.jsx` (`GemsTab`)

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 3.1 | **P2** | Sort labels: **Favorites / Newest / Nearby** | **"Most favorited / Newest / Nearest"** — matches the backend contract (§3.7.1: favs_count / approved_at / distance) and the spec'd copy |
| 3.2 | **P2** | Active sort segment tinted amber | Neutral sliding-thumb seg (same fix as §1.2) |
| 3.3 | ✅ | Region-scoped subtitle ("Hidden gems near **Paris** — spotted by travelers, not yet in the dex."), amber "Share a hidden gem" button with camera icon, empty state "No gems near Paris yet — share the first one." | Matches — keep. Empty-state copy is exactly the right voice |
| 3.4 | — | *(not visible in an empty region)* | When populated, gem cards need: photo block · name · mono "BY · X.X KM · DATE" · note · **★ favorite chip** (count, amber when faved) · small **"Report"** flag action ("Reported · under review" + card dim) · the user's own pending gem pinned top with an amber **"IN REVIEW"** badge instead of the star |

## 4. Share a hidden gem — ref `14-share-hidden-gem-3.7.png` · spec §3.7 · source `ShareGem.jsx`

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 4.1 | **P2** | Pushed as a **full page** with back chevron | **Bottom sheet over the dimmed Community** (drag handle + X, scrim). Same presentation note as the profile-art picker — page is workable, sheet is the spec |
| 4.2 | — | *(post-submit not shown)* | Verify the full pipeline states: Submit → **"Submitted for review"** success state (amber clock medallion, "automated checks passed… usually within 24 hours" copy, Done) → the new gem appears at the **top of the list** with the amber **IN REVIEW** badge (no star), visible only to its author until approved (§3.7.1 RLS) |
| 4.3 | P3 | Placeholders "Name this gem" / "Why is it special?" | Spec copy: **"Name the spot"** / **"Why is it special? What should travelers look for?"** |
| 4.4 | ✅ | Dashed photo box (camera + "Add a photo of the spot" + amber REQUIRED), name + note fields, auto location chip (flag + Paris + "AUTO · FROM MAP"), blue "REVIEWED BEFORE IT APPEARS" guidelines card with exact spec copy, disabled "Submit for review" until valid | Matches — keep. This screen is the closest in the whole build |

## 5. Global

| # | Pri | Build shows | Design requires |
|---|---|---|---|
| 5.1 | **P1** | Center Find tab = small grey circle with **+** | Raised **stamp** button (62px, above the bar, `--bg` ring; grey disabled → amber + `--glow-fab` when a sight is selected). Same item in all build-notes files — one fix clears all |
| 5.2 | **P2** | Segmented controls styled with amber active fills (two places here) | One shared SegmentedControl component: neutral track + sliding thumb. Fix once, reuse everywhere (Community tabs, gem sort, any future segs) |
