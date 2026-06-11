import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

// Tone mapping for type chips (matches prototype TYPE_META)
const TYPE_TONES: Record<string, 'green' | 'amber' | 'blue'> = {
  Scenic: 'green', Nature: 'green',
  Historic: 'amber', Food: 'amber', Sacred: 'amber',
  Icon: 'blue', Coastal: 'blue', Modern: 'blue',
};

function getTone(tag: string): 'green' | 'amber' | 'blue' {
  return TYPE_TONES[tag] ?? 'amber';
}

export function SightRow({
  sight,
  onPress,
  selected,
  onSeeMore,
  favorited,
  onToggleFavorite,
}: {
  sight: SightWithFind;
  onPress: (id: string) => void;
  selected?: boolean;
  onSeeMore?: (id: string) => void;
  favorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const t = useTheme();

  // Found rows get a subtle foundBg gradient tint; selected takes precedence
  const rowBg = selected
    ? t.colors.surface3
    : sight.found
    ? t.colors.foundBg
    : t.colors.surface1;

  const rowBorderColor = selected
    ? t.colors.amberLine
    : sight.found
    ? t.colors.greenLine
    : t.colors.borderSubtle;

  // Show every tag as its own chip (wrapping to a second line if ever needed) —
  // never collapse into a "+N" chip.
  const chips = sight.type_tags ?? [];

  return (
    <Pressable
      onPress={() => onPress(sight.id)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 74,
        paddingVertical: t.spacing.s3,
        paddingHorizontal: t.spacing.s4,
        gap: t.spacing.s3,
        backgroundColor: rowBg,
        borderWidth: 1,
        borderColor: rowBorderColor,
        borderRadius: t.radii.lg,
        marginBottom: t.spacing.s2,
      }}
    >
      {/* Favorite — top-right absolute */}
      {onToggleFavorite ? (
        <Pressable
          testID={`fav-${sight.id}`}
          onPress={() => onToggleFavorite(sight.id)}
          style={{
            position: 'absolute',
            top: t.spacing.s2,
            right: t.spacing.s3,
            zIndex: 2,
            width: 28,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ color: favorited ? t.colors.amber : t.colors.text3, fontSize: 16 }}>
            {favorited ? '♥' : '♡'}
          </Text>
        </Pressable>
      ) : null}

      {/* Thumbnail: found = foundBg fill + green border, unfound = hollow + locked border */}
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: t.radii.md,
          backgroundColor: sight.found ? t.colors.foundBg : t.colors.surface2,
          borderWidth: 1.5,
          borderColor: sight.found ? t.colors.green : t.colors.borderDefault,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {sight.found ? (
          <Text testID="found-check" style={{ color: t.colors.green, fontSize: 14 }}>{'✓'}</Text>
        ) : (
          <Text style={{ color: t.colors.locked, fontSize: 18 }}>{'⌂'}</Text>
        )}
      </View>

      {/* Middle: name + chips — flex:1 with minWidth:0 to prevent overflow */}
      <View style={{ flex: 1, minWidth: 0, gap: t.spacing.s1 }}>
        <Text
          style={[
            t.type.body,
            {
              color: sight.found ? t.colors.text1 : t.colors.text2,
              fontWeight: '700',
              fontSize: 16,
              flexShrink: 1,
            },
          ]}
          numberOfLines={1}
        >
          {sight.name}
        </Text>

        {/* Type chips — every tag, text centered in its border; wraps if tight */}
        {chips.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s1 }}>
            {chips.map(tag => {
              const tone = getTone(tag);
              const bg =
                tone === 'green'
                  ? t.colors.greenDim
                  : tone === 'blue'
                  ? t.colors.blueDim
                  : t.colors.amberDim;
              const fg =
                tone === 'green'
                  ? t.colors.green
                  : tone === 'blue'
                  ? t.colors.blue
                  : t.colors.amber;
              const border =
                tone === 'green'
                  ? t.colors.greenLine
                  : tone === 'blue'
                  ? t.colors.blueLine
                  : t.colors.amberLine;
              return (
                <View
                  key={tag}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 2,
                    paddingHorizontal: t.spacing.s2,
                    borderRadius: t.radii.pill,
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: border,
                  }}
                >
                  <Text
                    style={[
                      t.type.label,
                      {
                        color: fg,
                        fontSize: 10,
                        lineHeight: 13,
                        textTransform: 'none',
                        letterSpacing: 0,
                        textAlign: 'center',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {tag}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Right column: dex number — fixed width, no overflow into middle */}
      <View style={{ width: 40, alignItems: 'flex-end', flexShrink: 0 }}>
        <Text
          style={[
            t.type.dexNo,
            {
              color: t.colors.text3,
              opacity: sight.found ? 0.9 : 0.55,
              fontSize: 10,
            },
          ]}
          numberOfLines={1}
        >
          {`#${String(sight.dex_no).padStart(3, '0')}`}
        </Text>
      </View>

      {/* Chevron see-more */}
      {onSeeMore && (
        <Pressable
          testID={`seemore-${sight.id}`}
          onPress={() => onSeeMore(sight.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ color: t.colors.text3, fontSize: 18 }}>{'›'}</Text>
        </Pressable>
      )}
    </Pressable>
  );
}
