/**
 * Travidex theme-invariant tokens — generated from design/Travidex/tokens/
 * (spacing.css, typography.css, motion.css). These do NOT change with theme.
 */

/* ---- Spacing (4pt base, px) ---- */
export const spacing = {
  s0: 0, s1: 2, s2: 4, s3: 8, s4: 12, s5: 16, s6: 20, s7: 24, s8: 32, s9: 40, s10: 48, s11: 64,
} as const;

/* ---- Screen layout ---- */
export const layout = {
  screenGutter: 16,
  screenGutterLg: 20,
  contentMax: 440,
} as const;

/* ---- Radii ---- */
export const radii = {
  xs: 6, sm: 10, md: 14, lg: 18, xl: 24, xxl: 30, pill: 999, card: 18,
} as const;

/* ---- Component sizing + iOS chrome ---- */
export const size = {
  statusbarH: 54, navheaderH: 52, tabbarH: 84, homeIndicator: 34, fabSize: 62,
  hitMin: 44, rowH: 72, inputH: 50, btnH: 52, btnHSm: 40, chipH: 28, avatar: 40, pin: 34,
} as const;

/* ---- Font families (expo-google-fonts naming) ---- */
export const fontFamily = {
  sansRegular: 'SpaceGrotesk_400Regular',
  sansMedium: 'SpaceGrotesk_500Medium',
  sansSemibold: 'SpaceGrotesk_600SemiBold',
  sansBold: 'SpaceGrotesk_700Bold',
  monoRegular: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',
} as const;

/* ---- Raw font sizes (px) ---- */
export const fontSize = {
  display: 34, h1: 27, h2: 21, h3: 17, bodyLg: 16, body: 15, caption: 13, micro: 11,
  statXl: 26, stat: 19, label: 11, monoSm: 12,
} as const;

/* ---- Motion (durations ms; easing as cubic-bezier control points) ---- */
export const duration = {
  instant: 90, fast: 150, med: 260, slow: 420, celebrate: 720,
} as const;

export const easing = {
  standard: [0.4, 0.0, 0.2, 1] as const,   // general
  out: [0.16, 1, 0.3, 1] as const,         // decelerate
  spring: [0.22, 1.4, 0.36, 1] as const,   // overshoot pop (reward)
  sheet: [0.32, 0.72, 0, 1] as const,      // iOS bottom-sheet
} as const;

export const interaction = {
  pressScale: 0.97,   // buttons/rows squash on press
  pressBright: 1.08,  // accent fills brighten on press
  tapScale: 0.94,     // small icon buttons
} as const;

/* ---- Backdrop blur → expo-blur `intensity` (0–100), approximated from px ---- */
export const blur = { sm: 20, md: 40, lg: 60 } as const;
