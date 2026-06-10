import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightRow({ sight, onPress, selected, onSeeMore, favorited, onToggleFavorite }: {
  sight: SightWithFind;
  onPress: (id: string) => void;
  selected?: boolean;
  onSeeMore?: (id: string) => void;
  favorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const t = useTheme();

  // Found rows get a subtle foundBg tint unless selected (selected takes precedence)
  const rowBg = selected
    ? t.colors.surface3
    : sight.found
    ? t.colors.foundBg
    : 'transparent';

  const chips = (sight.type_tags ?? []).slice(0, 3);

  return (
    <Pressable
      onPress={() => onPress(sight.id)}
      style={{
        flexDirection: 'row', alignItems: 'center', padding: t.spacing.s4, gap: t.spacing.s3,
        backgroundColor: rowBg,
        borderWidth: selected ? 1 : 0, borderColor: selected ? t.colors.amberLine : 'transparent',
        borderRadius: t.radii.sm,
      }}
    >
      {/* Thumbnail: found = foundBg fill + green border; unfound = hollow transparent + locked border */}
      <View style={{
        width: 48, height: 48, borderRadius: t.radii.sm,
        backgroundColor: sight.found ? t.colors.foundBg : 'transparent',
        borderWidth: sight.found ? 1 : 1,
        borderColor: sight.found ? t.colors.green : t.colors.locked,
      }} />

      {/* Middle: name + type chips */}
      <View style={{ flex: 1, gap: t.spacing.s1 }}>
        <Text style={[t.type.body, { color: t.colors.text1 }]} numberOfLines={1}>{sight.name}</Text>
        {chips.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s1 }}>
            {chips.map(tag => (
              <View
                key={tag}
                style={{
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                  borderRadius: t.radii.xs,
                  paddingHorizontal: t.spacing.s2,
                  paddingVertical: 1,
                }}
              >
                <Text style={[t.type.caption, { color: t.colors.text2 }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Right column: favorite (top) + dex number (bottom) */}
      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' }}>
        {onToggleFavorite ? (
          <Pressable
            testID={`fav-${sight.id}`}
            onPress={() => onToggleFavorite(sight.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ color: favorited ? t.colors.amber : t.colors.text3, fontSize: 16 }}>
              {favorited ? '♥' : '♡'}
            </Text>
          </Pressable>
        ) : (
          // Spacer when no favorite handler — keeps dex number at bottom
          <View />
        )}
        <View style={{ alignItems: 'flex-end' }}>
          {sight.found && <Text testID="found-check" style={{ color: t.colors.green }}>✓</Text>}
          <Text style={[t.type.stat, { color: t.colors.text3 }]}>{`#${String(sight.dex_no).padStart(3, '0')}`}</Text>
        </View>
      </View>

      {/* Chevron see-more (for DexSheet / map) */}
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
