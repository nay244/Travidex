import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

export function CompletionBar({ label, found, total }: { label: string; found: number; total: number }) {
  const t = useTheme();
  const pct = total === 0 ? 0 : Math.round((found / total) * 100);
  return (
    <View>
      <Text style={[t.type.h3, { color: t.colors.text1 }]}>{`${label} · ${found} of ${total}`}</Text>
      <View style={{ height: 6, backgroundColor: t.colors.surface4, borderRadius: t.radii.xs, marginTop: t.spacing.s2 }}>
        <View style={{ width: `${pct}%`, height: 6, backgroundColor: t.colors.green, borderRadius: t.radii.xs }} />
      </View>
    </View>
  );
}
