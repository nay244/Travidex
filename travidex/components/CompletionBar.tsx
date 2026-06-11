import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

/**
 * Thin progress bar used in the DexSheet header.
 * label prop is kept for backward-compat (city/[id] CompletionBar usage)
 * but omitted in the map DexSheet (header now renders the label itself).
 */
export function CompletionBar({ label, found, total }: { label?: string; found: number; total: number }) {
  const t = useTheme();
  const pct = total === 0 ? 0 : Math.round((found / total) * 100);
  return (
    <View>
      {label !== undefined && (
        <Text style={[t.type.h3, { color: t.colors.text1, marginBottom: t.spacing.s2 }]}>{`${label} · ${found} of ${total}`}</Text>
      )}
      <View style={{ height: 7, backgroundColor: t.colors.progressBg, borderRadius: t.radii.xs }}>
        <View style={{ width: `${pct}%`, height: 7, backgroundColor: t.colors.amber, borderRadius: t.radii.xs }} />
      </View>
    </View>
  );
}
