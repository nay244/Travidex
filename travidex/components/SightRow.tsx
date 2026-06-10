import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightRow({ sight, onPress, selected, onSeeMore }: {
  sight: SightWithFind;
  onPress: (id: string) => void;
  selected?: boolean;
  onSeeMore?: (id: string) => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={() => onPress(sight.id)}
      style={{
        flexDirection: 'row', alignItems: 'center', padding: t.spacing.s4, gap: t.spacing.s3,
        backgroundColor: selected ? t.colors.surface3 : 'transparent',
        borderWidth: selected ? 1 : 0, borderColor: selected ? t.colors.amberLine : 'transparent',
        borderRadius: t.radii.sm,
      }}
    >
      {/* found = full-color thumb; unfound = hollow outline (the found/unfound spine — never opacity-dim) */}
      <View style={{ width: 44, height: 44, borderRadius: t.radii.sm,
        backgroundColor: sight.found ? t.colors.foundBg : 'transparent',
        borderWidth: sight.found ? 0 : 1, borderColor: t.colors.locked }} />
      <View style={{ flex: 1 }}>
        <Text style={[t.type.h3, { color: sight.found ? t.colors.text1 : t.colors.text3 }]}>{sight.name}</Text>
        <Text style={[t.type.dexNo, { color: t.colors.text3 }]}>{`#${String(sight.dex_no).padStart(3, '0')}`}</Text>
      </View>
      {sight.found && <Text testID="found-check" style={{ color: t.colors.green }}>✓</Text>}
      {onSeeMore && (
        <Pressable
          testID={`seemore-${sight.id}`}
          onPress={() => onSeeMore(sight.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ color: t.colors.text3, fontSize: 18 }}>›</Text>
        </Pressable>
      )}
    </Pressable>
  );
}
