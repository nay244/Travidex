// Medallion — circular badge/achievement unit (design ProfilePages.jsx).
// earned: tone-tinted disc + tone ring + soft glow + tone icon.
// locked: hollow (transparent fill, locked ring, dim glyph) — never opacity.

import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

export type MedallionTone = 'green' | 'amber' | 'blue';

export type MedallionProps = {
  icon: string;
  tone: MedallionTone;
  earned: boolean;
  size?: number;
  badge?: string | number;
  testID?: string;
};

// Tone map — resolves tinted bg, border, glow, and icon color from theme tokens.
// (t.colors as any) cast for blueGlow which is not in the current ColorTokens type.
function useTone(tone: MedallionTone) {
  const t = useTheme();
  const c = t.colors as any;
  const map = {
    green: { bg: c.greenDim, border: c.greenLine, glow: c.greenGlow, icon: c.green },
    amber: { bg: c.amberDim, border: c.amberLine, glow: c.amberGlow, icon: c.amber },
    blue:  { bg: c.blueDim,  border: c.blueLine,  glow: c.blueGlow ?? c.blueDim, icon: c.blue },
  } as const;
  return map[tone];
}

export function Medallion({ icon, tone, earned, size = 64, badge, testID }: MedallionProps) {
  const t = useTheme();
  const tk = useTone(tone);
  const iconSize = Math.round(size * 0.42);
  const chipSize = Math.round(size * 0.34);

  if (!earned) {
    return (
      <View
        testID={testID}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: t.colors.locked,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon as any} size={iconSize} color={t.colors.locked} />
      </View>
    );
  }

  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tk.bg,
        borderWidth: 2,
        borderColor: tk.border,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: tk.glow,
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
      }}
    >
      <Ionicons name={icon as any} size={iconSize} color={tk.icon} />
      {badge != null && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            minWidth: chipSize,
            height: chipSize,
            paddingHorizontal: 3,
            borderRadius: 999,
            backgroundColor: t.colors.surface1,
            borderWidth: 1,
            borderColor: tk.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: t.fontFamily.monoBold,
              fontSize: t.fontSize.micro,
              color: tk.icon,
            }}
          >
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}
