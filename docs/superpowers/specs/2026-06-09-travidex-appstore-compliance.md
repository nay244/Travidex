# Travidex — App Store Technical Compliance Checklist (2026)

**Date:** 2026-06-09
**Status:** Documented (implement at first EAS Build / TestFlight, before the first App Store Connect upload)
**Scope:** iOS, first release. Verified against Apple + Expo sources June 2026.

This is a release-gate checklist. Items 1–2 are handled by the toolchain; item 3 (privacy manifest) is the one concrete config to add before upload; item 4 (AI) is currently N/A.

---

## 1. Built with iOS 26 SDK — ✅ handled by toolchain (verify at build)

- **Rule:** From **April 28, 2026**, every new submission/update to App Store Connect must be built with the **iOS 26 SDK using Xcode 26+**. The *deployment target* (minimum iOS the app runs on) can stay lower (Expo SDK 56 minimum is iOS 16.4) — existing users on older iOS are unaffected.
- **Our status:** The app is on **Expo SDK 56** (React Native 0.85), which **requires Xcode 26.4+** to compile natively → it builds against the iOS 26 SDK by construction.
- **Action at release:** Ensure **EAS Build** uses an image with **Xcode 26.4+** (default for SDK 56). Add to `eas.json` when EAS is set up, e.g. `"build": { "production": { "ios": { "image": "latest" } } }`, and confirm the resolved Xcode in the build log is ≥ 26.4.
- **⚠️ Design side-effect:** Building with the iOS 26 SDK applies Apple's **"Liquid Glass"** styling to native UI (Tabs bar, navigation headers, `Switch`, `ActivityIndicator`, sheets) by default. Do a visual pass against our design system once the first iOS 26 build runs; opt out per-component only if it clashes.

## 2. 64-bit (arm64) — ✅ automatic, no action

- **Rule:** 64-bit has been mandatory since 2017; the App Store only accepts **arm64**.
- **Our status:** Expo SDK 56 / RN 0.85 produce **arm64-only** binaries. Nothing to configure.

## 3. Privacy manifest (`PrivacyInfo.xcprivacy`) — ⚠️ implement before first upload

- **Rule:** Since **May 1, 2024**, every app must include a privacy manifest declaring required-reason API usage, collected data types, and tracking status. Since **Feb 12, 2025**, privacy-impacting third-party SDKs must each ship their own manifest (most Expo modules already do).
- **Our status:** Not yet declared at the app level. Expo generates `PrivacyInfo.xcprivacy` from an **`ios.privacyManifests`** block in `app.json`. The app-level manifest must cover app code + any dependency without its own manifest.
- **Action at release:** Add the block below to `app.json` (tune to the final dependency/feature set — confirm exact required-reason APIs after the dep list is final; Expo modules like `expo-camera`/`expo-location` ship their own manifests, so the app block primarily covers AsyncStorage + RN core + app data collection):

```jsonc
// app.json → expo.ios
"privacyManifests": {
  "NSPrivacyTracking": false,
  "NSPrivacyTrackingDomains": [],
  "NSPrivacyCollectedDataTypes": [
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeEmailAddress",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeUserID",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypePhotosorVideos",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeOtherUserContent",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
    }
    // Add NSPrivacyCollectedDataTypeCoarseLocation ONLY if/when optional location is shipped (Navigate / distances).
  ],
  "NSPrivacyAccessedAPITypes": [
    { "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",   "NSPrivacyAccessedAPITypeReasons": ["CA92.1"] },
    { "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryFileTimestamp",  "NSPrivacyAccessedAPITypeReasons": ["C617.1"] },
    { "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryDiskSpace",      "NSPrivacyAccessedAPITypeReasons": ["E174.1"] },
    { "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategorySystemBootTime", "NSPrivacyAccessedAPITypeReasons": ["35F9.1"] }
  ]
}
```
  - **Why these:** `UserDefaults` (`CA92.1`) — AsyncStorage session persistence; `FileTimestamp` (`C617.1`), `DiskSpace` (`E174.1`), `SystemBootTime` (`35F9.1`) — common RN core / dependency required-reason APIs. Collected types map to: account email (Sign in with Apple / email), Supabase user id, user photos, and find comments (other user content). `NSPrivacyTracking` is `false` — Travidex does not track across apps/sites.
- **Verify:** After building, the App Store Connect **App Privacy** answers must match these declarations.

## 4. AI disclosure (Guideline 5.1.2(i)) — ✅ N/A (no AI)

- **Rule:** Live **Nov 13, 2025** — apps must **clearly disclose and obtain explicit user consent before sharing personal data with third-party AI** (LLMs like GPT/Claude/Gemini, image/audio/video generation, writing/code assistants). Consent must appear **before the first transmission**, and the specific AI model/service must be named.
- **Our status:** **Travidex uses no AI.** The design deliberately excludes photo-recognition (finds are honor-system) and uses no LLM/generative services. No personal data is sent to any third-party AI.
- **Action at release:** In App Store Connect, declare **no third-party AI data sharing**. No in-app consent mechanism is required.
- **Future trigger:** If any AI feature is later added (e.g., AI itinerary suggestions, sight photo recognition, generated descriptions), it MUST implement a 5.1.2(i) consent flow: disclose the named model/service and obtain explicit opt-in *before* the first data send. Add this to that feature's spec.

---

## Release checklist (pre–App Store Connect upload)

- [ ] EAS Build uses Xcode 26.4+ / iOS 26 SDK (confirm in build log).
- [ ] Visual pass for iOS 26 "Liquid Glass" native-component restyle vs. the Travidex design system.
- [ ] `ios.privacyManifests` added to `app.json`; reconcile required-reason APIs against the final dependency list and collected-data-types against shipped features (add Coarse Location if optional location ships).
- [ ] App Store Connect **App Privacy** answers match the manifest.
- [ ] App Store Connect: declare **no third-party AI data sharing**.
- [ ] Sign in with Apple configured (already in `app.json`: `ios.usesAppleSignIn`, `expo-apple-authentication` plugin); App Store requires it is offered — satisfied (Apple + email/password only; no other social logins → guideline 4.8 fully satisfied).
