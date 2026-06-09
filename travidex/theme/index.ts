/**
 * Travidex React Native theme — single import surface.
 *
 *   import { ThemeProvider, useTheme } from '@/theme';
 *
 *   function Title() {
 *     const t = useTheme();
 *     return <Text style={[t.type.h1, { color: t.colors.text1 }]}>Travidex</Text>;
 *   }
 *
 * Never hardcode hex or branch on theme — read tokens from useTheme().
 */
export { ThemeProvider, useTheme, useThemeMode } from './ThemeProvider';
export { buildTheme, lightTheme, darkTheme } from './theme';
export type { Theme, Scheme, Shadows } from './theme';
export { lightColors, darkColors } from './palette';
export type { ColorTokens } from './palette';
export { textStyles } from './typography';
export type { TextRole } from './typography';
export { spacing, layout, radii, size, fontFamily, fontSize, duration, easing, interaction, blur } from './tokens';
