# Travidex — TestFlight Deploy Checklist

Ordered end-to-end: backend → Apple → RevenueCat → build → TestFlight. Items marked **[done]** are already in the repo. Companion doc: `docs/superpowers/specs/2026-06-09-travidex-appstore-compliance.md`.

---

## Part A — Supabase (the live backend)

1. **Account & project:** https://supabase.com → sign in (GitHub login is fine) → New project. Org: personal. Name `travidex`, region nearest you, generate a strong DB password (save it — needed for `db push`). Free tier is fine for TestFlight.
2. **CLI link (from `travidex/`):**
   ```
   npx supabase login
   npx supabase link --project-ref <PROJECT_REF>   # ref is in the project URL
   ```
3. **Apply all migrations (creates every table, RLS policy, trigger, RPC, and BOTH storage buckets):**
   ```
   npx supabase db push
   ```
   Verify in Dashboard → Database → Tables (expect: countries, cities, sights, profiles, finds, user_photos, user_badges, community_submissions, favorites, friendships, gems, gem_favorites, gem_reports, moderators, moderation_log) and Storage (buckets `user-photos`, `gem-photos`).
4. **Seed content:** Dashboard → SQL Editor → paste the contents of `travidex/supabase/seed.sql` → Run. (Seed files don't ship with `db push`.) This loads France/Paris + the Paris sights.
5. **Auth providers:** Dashboard → Authentication → Providers:
   - **Email**: on (default). For TestFlight convenience consider turning OFF "Confirm email" initially.
   - **Apple**: toggle on; in **Client IDs** enter the app's bundle id `com.nay244.travidex` (native Sign in with Apple validates the identity token against this).
6. **Edge functions:**
   ```
   npx supabase functions deploy delete-account
   npx supabase functions deploy moderate --no-verify-jwt
   npx supabase functions deploy gems-check --no-verify-jwt
   ```
   (`moderate`/`gems-check` enforce the service-role bearer internally; `delete-account` keeps gateway JWT verification.)
7. **gems-check webhook:** Dashboard → Database → Webhooks → Create: table `gems`, events `INSERT`, type HTTP request → URL = the gems-check function URL (Functions page), method POST, add header `Authorization: Bearer <SERVICE_ROLE_KEY>` (Project Settings → API → service_role).
8. **Seed yourself as moderator (after your first sign-up in the app):** SQL Editor:
   ```sql
   insert into moderators (user_id, role)
   values ((select user_id from profiles where username = 'YOUR_USERNAME'), 'owner');
   ```
9. **App env:** copy `travidex/.env.example` → `.env`; fill `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API.

## Part B — Apple Developer

1. **Enroll:** https://developer.apple.com/programs/enroll — personal Apple ID, $99/yr, identity verification can take 24–48h.
2. Nothing else manual here — EAS creates the App ID, certificates, and provisioning profiles for `com.nay244.travidex` automatically (Sign in with Apple capability comes from `usesAppleSignIn` in app.json).

## Part C — App Store Connect

1. https://appstoreconnect.apple.com → My Apps → **＋ New App**: platform iOS, name **Travidex** (must be globally unique — have alternates ready, e.g. "Travidex — Travel Dex"), primary language, Bundle ID `com.nay244.travidex` (appears after EAS registers it — or register it first at developer.apple.com → Identifiers), SKU `travidex-ios`.
2. **Subscription product:** Monetization → Subscriptions → create Subscription Group `Travidex+` → add auto-renewing subscription, e.g. Product ID `travidex_plus_monthly`, set price + localization ("Travidex+ — dark theme and premium highlight frames"). Status must reach "Ready to Submit" (needs the Paid Apps agreement signed under Business → Agreements, plus banking/tax forms).
3. **App Privacy** (required before TestFlight external testing / review): answer to match the privacy manifest — collects Email, User ID, Photos, Other User Content, Purchase History; all "app functionality", none used for tracking. **No third-party AI data sharing.**
4. **Privacy policy URL** (required for account-based apps): host a simple policy page (GitHub Pages is fine) and set it under App Privacy.

## Part D — RevenueCat

1. https://app.revenuecat.com → sign up (free) → New project `Travidex`.
2. **Connect the App Store app:** Project Settings → Apps → ＋ App Store → bundle id `com.nay244.travidex`; upload an **App Store Connect API key** (ASC → Users and Access → Integrations → App Store Connect API → Team key with App Manager role) so RevenueCat can read products.
3. **Entitlement:** Entitlements → ＋ → identifier exactly **`premium`** (the code's `PREMIUM_ENTITLEMENT`).
4. **Product + offering:** Products → import/add `travidex_plus_monthly` → attach to `premium` entitlement. Offerings → `default` offering → add a Monthly package pointing at the product (the paywall reads `offerings.current.availablePackages`).
5. **SDK key:** Project Settings → API keys → copy the **Apple App Store public SDK key** (`appl_…`) → put in `.env` as `EXPO_PUBLIC_RC_IOS_KEY`.

## Part E — Build with EAS

1. **Account + CLI:** https://expo.dev sign up → `npm i -g eas-cli` → `eas login`.
2. **[done]** `eas.json` (production profile, latest Xcode image, auto-increment build numbers).
3. **[done]** `app.json`: `ios.privacyManifests`, camera/location/photos permission strings, bundle id, `usesAppleSignIn`.
4. **Init the project:** from `travidex/`: `eas init` (links the repo to your Expo account; writes `extra.eas.projectId` into app.json — commit it).
5. **Env vars for the build** (EXPO_PUBLIC_* must exist at build time):
   ```
   eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value <url> --visibility plaintext
   eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <anon> --visibility plaintext
   eas env:create --environment production --name EXPO_PUBLIC_RC_IOS_KEY --value <appl_...> --visibility plaintext
   ```
6. **Build:** `eas build --platform ios --profile production`
   - First run: log in with your Apple ID when prompted; answer **Yes** to letting EAS manage credentials (creates distribution cert + profile) and to registering the bundle id.
   - Confirm in the build log: **Xcode ≥ 26.4** (iOS 26 SDK — required for submissions since Apr 28, 2026).
7. **Submit to TestFlight:** `eas submit --platform ios --latest` (uses the same Apple login or an ASC API key). Processing in ASC takes ~5–15 min, then the build appears under TestFlight.

## Part F — TestFlight

1. ASC → TestFlight → the build → complete **export compliance** (uses standard HTTPS encryption only → "standard algorithms" exemption).
2. **Internal testing:** create an Internal group, add your Apple ID → install via the TestFlight app on your phone. No review needed; available immediately.
3. **External testing** (optional, up to 10k testers): create a group + public link; first external build goes through a lightweight Beta App Review (~1 day) — App Privacy + privacy policy must be done.
4. **Subscription sandbox:** TestFlight builds bill against the sandbox automatically — purchases are free and auto-renew on a compressed schedule. Verify: paywall shows the price from ASC → purchase → dark theme + gold/forest frames unlock → Restore purchases works on a reinstall.

## Smoke test on TestFlight build

- [ ] Sign in with Apple and with email; sign out; log back in.
- [ ] Map: Paris pins load, select → log a find → Find Success; pin fills in.
- [ ] Explore: country pill, Paris Region Dex, favorite a sight, ✨ Highlights → share card to Photos.
- [ ] Sight detail: add a photo (Storage upload), journal shows it.
- [ ] Community: feed entry for your find; share a hidden gem → IN REVIEW; approve it (moderate function or SQL) → appears.
- [ ] Profile: stats + badges awarded; Settings → location toggle, Restore purchases, Appearance gate → paywall → sandbox purchase → dark theme.
- [ ] Delete account → confirm → signed out; account gone (try logging in).

## iOS 26 "Liquid Glass" visual pass

The iOS 26 SDK restyles native components (tab bar, switches, sheets). On the first TestFlight install, sweep every screen against the design kit and note any native component that clashes — opt out per-component only where it breaks the design.
