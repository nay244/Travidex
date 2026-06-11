import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, useThemeMode } from '@/theme';

/**
 * Glass — the design system's frosted surface (kit: surface-overlay + blur-md).
 * Use it anywhere the reference screens show a translucent "glass" card/rail:
 *
 *   <Glass style={{ borderRadius: t.radii.lg, padding: t.spacing.s4 }}>...</Glass>
 *
 * `intensity` 0–100 (default 40 ≈ the kit's blur-md). The tint follows the
 * active scheme automatically — do NOT branch on theme at call sites.
 */
export function Glass({
  children,
  style,
  intensity = 40,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}) {
  const t = useTheme();
  const { scheme } = useThemeMode();
  return (
    <View style={[{ overflow: 'hidden', borderWidth: 1, borderColor: t.colors.borderSubtle }, style]}>
      <BlurView
        intensity={intensity}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* surfaceOverlay wash on top of the blur = the kit's glass color */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: t.colors.surfaceOverlay,
        }}
      />
      {children}
    </View>
  );
}
