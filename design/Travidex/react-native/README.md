# Travidex — React Native Theme

Generated 1:1 from `design/Travidex/tokens/*.css`. This is the **single source of color, type, spacing, elevation, and motion** for the Travidex Expo app — components read tokens, never hardcode hex.

## Files
- `theme/palette.ts` — `lightColors` / `darkColors` (identical keys; the only thing that changes by theme)
- `theme/tokens.ts` — spacing, radii, sizes, font families/sizes, motion, blur (theme-invariant)
- `theme/typography.ts` — `textStyles` (CSS roles → RN `TextStyle`, line-height/letter-spacing converted to px)
- `theme/theme.ts` — `buildTheme(scheme)`, `lightTheme`, `darkTheme`, RN shadow/glow presets
- `theme/ThemeProvider.tsx` — provider + `useTheme()` / `useThemeMode()`
- `theme/index.ts` — import surface

## Usage
```tsx
import { ThemeProvider, useTheme } from '@/theme';

// at the app root (light is default; dark is the Travidex+ opt-in)
<ThemeProvider>{children}</ThemeProvider>

function FoundBadge() {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.colors.foundBg, borderRadius: t.radii.sm, padding: t.spacing.s3 }}>
      <Text style={[t.type.label, { color: t.colors.found }]}>found</Text>
    </View>
  );
}
```

## Rules (from the design system)
- **Never branch on theme.** Read a token key; the provider swaps light/dark underneath you.
- **Accents are fixed semantics:** green = found/claimed, amber = in-progress + Log/Find, blue = personal/info, locked = unseen/disabled.
- **Found = full color, unfound = hollow/dim.**
- **Fonts:** Space Grotesk (UI) + Space Mono (data). Load via `@expo-google-fonts/space-grotesk` + `@expo-google-fonts/space-mono` before rendering; the family names in `tokens.ts` assume those packages.

## Conversions applied (CSS → RN)
- `line-height` multiplier → absolute px; `letter-spacing` `em` → px.
- `box-shadow` → `shadow*` (iOS) + `elevation` (Android); spread/inset can't be expressed — pair a 1px accent border for the `0 0 0 1px` ring.
- backdrop `blur(px)` → `expo-blur` `intensity` (0–100), approximated.

## Install location
Copy `theme/` into the Expo app at `travidex/theme/` (Phase 1) and add the `@/theme` path alias, or import by relative path. Regenerate from `tokens/*.css` if the design tokens change.
