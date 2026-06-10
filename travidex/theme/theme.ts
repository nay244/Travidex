/**
 * Travidex theme assembly. Combines the active color palette with the
 * theme-invariant tokens, plus RN shadow/glow presets derived from
 * design/Travidex/tokens/elevation.css.
 */
import type { ViewStyle } from 'react-native';
import { ColorTokens, lightColors, darkColors, shadowInk } from './palette';
import { spacing, layout, radii, size, fontFamily, fontSize, duration, easing, interaction, blur } from './tokens';
import { textStyles } from './typography';

export type Scheme = 'light' | 'dark';

type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;
export type Shadows = {
  sm: ShadowStyle; md: ShadowStyle; lg: ShadowStyle; sheet: ShadowStyle; fab: ShadowStyle;
  glowFound: ShadowStyle; glowProgress: ShadowStyle; glowPin: ShadowStyle;
};

/**
 * Ambient shadows: light uses soft cool-ink; dark uses heavier black.
 * Glows: shadowColor follows the themed accent so they "follow the theme automatically".
 * (RN cannot express box-shadow spread/inset — pair a 1px accent border at the
 * call site if the design calls for the `0 0 0 1px` ring.)
 */
function makeShadows(scheme: Scheme, c: ColorTokens): Shadows {
  const inkSm = scheme === 'dark' ? 0.40 : 0.08;
  const inkMd = scheme === 'dark' ? 0.45 : 0.10;
  const inkLg = scheme === 'dark' ? 0.55 : 0.14;
  const inkSheet = scheme === 'dark' ? 0.55 : 0.12;
  const inkFab = scheme === 'dark' ? 0.55 : 0.18;
  const inkColor = scheme === 'dark' ? '#000000' : shadowInk; // rgba(22,30,48)

  return {
    sm:    { shadowColor: inkColor, shadowOffset: { width: 0, height: 1 },  shadowOpacity: inkSm,    shadowRadius: 2,  elevation: 1 },
    md:    { shadowColor: inkColor, shadowOffset: { width: 0, height: 4 },  shadowOpacity: inkMd,    shadowRadius: 14, elevation: 4 },
    lg:    { shadowColor: inkColor, shadowOffset: { width: 0, height: 12 }, shadowOpacity: inkLg,    shadowRadius: 32, elevation: 12 },
    sheet: { shadowColor: inkColor, shadowOffset: { width: 0, height: -8 }, shadowOpacity: inkSheet, shadowRadius: 40, elevation: 16 },
    fab:   { shadowColor: inkColor, shadowOffset: { width: 0, height: 8 },  shadowOpacity: inkFab,   shadowRadius: 24, elevation: 12 },

    glowFound:    { shadowColor: c.green,  shadowOffset: { width: 0, height: 6 }, shadowOpacity: scheme === 'dark' ? 0.45 : 0.22, shadowRadius: 20, elevation: 6 },
    glowProgress: { shadowColor: c.amber,  shadowOffset: { width: 0, height: 6 }, shadowOpacity: scheme === 'dark' ? 0.45 : 0.22, shadowRadius: 20, elevation: 6 },
    glowPin:      { shadowColor: c.green,  shadowOffset: { width: 0, height: 0 }, shadowOpacity: scheme === 'dark' ? 0.45 : 0.22, shadowRadius: 12, elevation: 4 },
  };
}

export type Theme = {
  scheme: Scheme;
  colors: ColorTokens;
  spacing: typeof spacing;
  layout: typeof layout;
  radii: typeof radii;
  size: typeof size;
  type: typeof textStyles;
  fontFamily: typeof fontFamily;
  fontSize: typeof fontSize;
  duration: typeof duration;
  easing: typeof easing;
  interaction: typeof interaction;
  blur: typeof blur;
  shadow: Shadows;
};

export function buildTheme(scheme: Scheme): Theme {
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return {
    scheme, colors, spacing, layout, radii, size,
    type: textStyles, fontFamily, fontSize,
    duration, easing, interaction, blur,
    shadow: makeShadows(scheme, colors),
  };
}

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');
