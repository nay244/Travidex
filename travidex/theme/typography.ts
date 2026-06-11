/**
 * Travidex text roles — generated from design/Travidex/tokens/typography.css.
 *
 * CSS→RN conversions applied:
 *   - line-height multiplier → absolute px  (round(fontSize * multiplier))
 *   - letter-spacing `em`    → px            (round2(em * fontSize))
 *   - weight                 → the weight-specific font family (RN custom fonts
 *                              are selected by family name, not numeric weight)
 *
 * These are theme-invariant. Apply a color from useTheme().colors at the call site
 * (e.g. <Text style={[type.h1, { color: colors.text1 }]} />).
 */
import type { TextStyle } from 'react-native';
import { fontFamily } from './tokens';

export const textStyles = {
  display:  { fontFamily: fontFamily.sansBold,     fontSize: 34, lineHeight: 36, letterSpacing: -0.68 },
  h1:       { fontFamily: fontFamily.sansSemibold, fontSize: 27, lineHeight: 32, letterSpacing: -0.27 },
  h2:       { fontFamily: fontFamily.sansSemibold, fontSize: 21, lineHeight: 25, letterSpacing: -0.21 },
  h3:       { fontFamily: fontFamily.sansSemibold, fontSize: 17, lineHeight: 20, letterSpacing: 0 },
  bodyLg:   { fontFamily: fontFamily.sansRegular,  fontSize: 16, lineHeight: 25, letterSpacing: 0 },
  body:     { fontFamily: fontFamily.sansRegular,  fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  caption:  { fontFamily: fontFamily.sansRegular,  fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  // Mono roles need lineHeight ≥ 1.25× fontSize on iOS — equal values clip
  // Space Mono's ascenders (glyph tops get cut off).
  label:    { fontFamily: fontFamily.monoRegular,  fontSize: 11, lineHeight: 14, letterSpacing: 1.32, textTransform: 'uppercase' },
  dexNo:    { fontFamily: fontFamily.monoBold,     fontSize: 12, lineHeight: 15, letterSpacing: 0.48 },
  stat:     { fontFamily: fontFamily.monoBold,     fontSize: 19, lineHeight: 24, letterSpacing: 0 },
  statXl:   { fontFamily: fontFamily.monoBold,     fontSize: 26, lineHeight: 33, letterSpacing: 0 },
  monoSm:   { fontFamily: fontFamily.monoRegular,  fontSize: 12, lineHeight: 15, letterSpacing: 0.48 },
} satisfies Record<string, TextStyle>;

export type TextRole = keyof typeof textStyles;
