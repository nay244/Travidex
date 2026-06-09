# Travidex — Implementation Plan Roadmap

**Date:** 2026-06-08
**Specs:** `../specs/2026-06-08-travidex-travel-dex-design.md`, `../specs/2026-06-08-travidex-screen-flow.md`

The app is decomposed into **8 phase plans**. Each produces working, testable software on its own and builds on the previous. Each gets its own plan file under `docs/superpowers/plans/`.

**Cross-cutting:** every phase follows `2026-06-08-travidex-theming-contract.md` — all color/type/spacing/elevation/motion comes from the RN theme (`design/Travidex/react-native/theme/`) via `useTheme()`; **no hardcoded hex**, and **found = full color / unfound = hollow**.

| Phase | Plan file | Delivers | Depends on |
|-------|-----------|----------|------------|
| **1. Foundation & Auth** | `2026-06-08-travidex-phase-1-foundation-auth.md` | Runnable Expo (iOS) app, test infra, Supabase client, Sign in with Apple + email/password, profile setup, 5-tab skeleton | — |
| **2. Data Layer & Catalog** | `…-phase-2-data-catalog.md` | Supabase schema (countries/cities/sights/finds/user_photos/badges/community_submissions) + PostGIS + RLS, seed data, typed data-access hooks | 1 |
| **3. Map Home & Dex Sheet** | `…-phase-3-map-dex.md` | Map with bright/dim pins, draggable dex bottom sheet, completion header, search/sort, pin⇄row sync, city scoping | 1, 2 |
| **4. Sight Detail & Find Loop** | `…-phase-4-sight-find.md` | Sight detail screen, Navigate (Walking/Driving), honor-system Log find → finds + user_photos, Find tab camera capture, Find success + completion update | 2, 3 |
| **5. Explore & Country Chunk-Map** | `…-phase-5-explore-chunkmap.md` | World/Country/City browse, OSRS-style chunk-map, claim-at-100% logic, completion aggregation | 2, 3 |
| **6. Community & Moderation** | `…-phase-6-community.md` | Submit-a-sight form + location picker, my submissions, moderation pipeline (RLS + Edge Function), finds feed | 2, 4 |
| **7. Profile & Gamification** | `…-phase-7-profile-gamification.md` | Profile home, stats detail, badges, photo-journal/passport, settings (account, location toggle, delete) | 2, 4 |
| **8. Travidex+ Premium** | `…-phase-8-premium.md` | In-app subscription (RevenueCat/StoreKit) + entitlement layer; gates premium aspects (first: dark theme) before App Store release | 1–7 |

**Build order:** 1 → 2 → 3 → 4 → (5 and 6 in parallel) → 7 → **8 (last, pre-release)**.

> Phase 8 is deliberately last: per product direction, the app is built and fine-tuned in full first, then select aspects are locked behind the **Travidex+** subscription before App Store submission. Dark theme is the first entitlement; the complete premium set is confirmed in Phase 8, Task 7.

Each phase plan is written task-by-task in TDD style with exact files, code, commands, and commits.
