# Travidex Theming Contract (applies to ALL phase plans)

**Date:** 2026-06-08
**Source of truth:** `design/Travidex/react-native/theme/` (generated from `design/Travidex/tokens/*.css`).

Every phase plan references this file. **No literal hex anywhere in app code** — colors, spacing, type, radii, shadow, and motion all come from `useTheme()`. Where an earlier plan snippet shows a literal hex, implement it as the mapped token below.

---

## Setup (done once, in Phase 1 — see Phase 1 "Task 1b")

1. Install fonts + (later) blur:
   ```bash
   npx expo install @expo-google-fonts/space-grotesk @expo-google-fonts/space-mono expo-font expo-splash-screen
   ```
2. Copy the generated theme into the app:
   ```bash
   cp -r ../design/Travidex/react-native/theme travidex/theme
   ```
3. Add the `@/` path alias in `tsconfig.json` (`"paths": { "@/*": ["./*"] }`) and `babel.config.js` (`babel-plugin-module-resolver`, root `./`), so `import { useTheme } from '@/theme'` works. Relative imports are also fine.
4. Load fonts and wrap the app in `ThemeProvider` (light default) at `app/_layout.tsx` — block render until fonts are ready.
5. Jest: `theme/` is plain TS/Context and needs no extra mocks; `useTheme()` works inside `render()` only when a `ThemeProvider` wraps the tree — tests render components inside `<ThemeProvider>` (a tiny `renderWithTheme` helper is added in Phase 1).

---

## The rule

```tsx
import { useTheme } from '@/theme';

function Example() {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.colors.surface1, borderRadius: t.radii.lg, padding: t.spacing.s5 }}>
      <Text style={[t.type.h2, { color: t.colors.text1 }]}>Title</Text>
    </View>
  );
}
```

- **Never branch on theme** (`scheme === 'dark' ? …` is banned). Read a token; the provider swaps light/dark underneath.
- **Found = full color. Unfound = hollow** — outline (`borderColor: t.colors.locked`, transparent fill) + muted text (`t.colors.text3`). **Never** an opacity dim.
- Mono (`t.type.dexNo`, `t.type.stat`, `t.type.label`, `t.type.monoSm`) for all data: dex numbers, coords, distances, stat values, uppercase labels.

---

## Hex → token mapping (replace these literals from the earlier snippets)

| Literal in old snippets | Token |
|---|---|
| `#0d0f14` (screen bg) | `t.colors.bg` |
| `#12151c` | `t.colors.surface1` |
| `#1a1d24` | `t.colors.surface2` |
| `#21252f` | `t.colors.surface3` |
| `#2a2f3a` (raised / hairline) | `t.colors.surface4` (fill) or `t.colors.borderStrong` (border) |
| `#1c2028` / `#1c2331` (dividers) | `t.colors.divider` |
| `#22324d` / `#34507a` / `#223` (hero / photo placeholder) | `t.colors.phBase` |
| `#fff`/`#ffffff` on an accent fill | `t.colors.textOnAccent` |
| `#e6e9ef` / `#cdd6e4` (primary text) | `t.colors.text1` |
| `#9aa4b2` / `#c2c9d6` (secondary) | `t.colors.text2` |
| `#7a8494` / `#5f6b7c` (tertiary/placeholder) | `t.colors.text3` |
| `#2e8b57` (primary positive button) | `t.colors.actionPositive` |
| `#4ade80` (found/claimed accent) | `t.colors.green` (or `found` / `pinFound` / `chunkClaimed`) |
| `#c9882b` (Log/Find action) | `t.colors.actionPrimary` |
| `#1a1206` (text on amber) | `t.colors.textOnAccent` |
| `#8fb6ff` (type tags / info) | `t.colors.info` |
| `#ff6b6b` (errors) | `t.colors.danger` |
| `#3a4150` (locked / unseen) | `t.colors.locked` |
| `#2e8b57`/amber chunk states | `t.colors.chunkClaimed` / `t.colors.chunkProgress` / `t.colors.chunkUntouched` |
| pin fill (found / unseen / selected) | `t.colors.pinFound` / `t.colors.pinUnseen` / `t.colors.pinSelected` |
| paddings `12/16/24` | `t.spacing.s4 / s5 / s7` |
| radii `8/10/12/18` | `t.radii.sm / sm / md / lg` |
| font sizes `22/20/16/12/11` | `t.type.*` roles (h1/h2/h3/body/dexNo/label) |

> Mapping note: the literals above were the **dark** values; tokens resolve to the correct light/dark value automatically, so using the token is strictly more correct.

---

## Premium (Travidex+) gating — forward reference

Per product direction, after all features are built and fine-tuned, **some aspects are locked behind an in-app subscription (Travidex+) before App Store release** — built in **Phase 8**. The first entitlement is the **dark theme/Appearance** (the design system already designates dark as premium): `useThemeMode().setScheme('dark')` is gated by the premium entitlement. Other premium candidates are finalized in Phase 8. Build Phases 1–7 with no gating; Phase 8 adds the entitlement layer on top.
