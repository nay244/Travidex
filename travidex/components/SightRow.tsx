import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightRow({
  sight,
  onPress,
  selected,
  onSeeMore,
  favorited,
  onToggleFavorite,
  variant = 'dex',
}: {
  sight: SightWithFind;
  onPress: (id: string) => void;
  selected?: boolean;
  onSeeMore?: (id: string) => void;
  favorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  variant?: 'map' | 'dex';
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

  const chips = sight.type_tags ?? [];

  if (variant === 'map') {
    return (
      <Pressable
        onPress={() => onPress(sight.id)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 64,
          paddingVertical: t.spacing.s3,
          paddingHorizontal: t.spacing.s3,
          gap: t.spacing.s3,
          backgroundColor: rowBg,
          borderWidth: 1,
          borderColor: rowBorderColor,
          borderRadius: t.radii.lg,
          marginBottom: t.spacing.s2,
        }}
      >
        {/* 48px thumb: found = foundBg fill + green border block; unfound = hollow + faint landmark glyph */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: t.radii.md,
            backgroundColor: sight.found ? t.colors.foundBg : 'transparent',
            borderWidth: 1.5,
            borderColor: sight.found ? t.colors.greenLine : t.colors.borderDefault,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {!sight.found && (
            <Ionicons name="business-outline" size={18} color={t.colors.locked} />
          )}
        </View>

        {/* Middle: #001 mono + name (same line) + mono meta line */}
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
            <Text
              style={[
                t.type.dexNo,
                {
                  color: t.colors.text3,
                  fontSize: 10,
                  fontFamily: t.fontFamily.monoBold,
                },
              ]}
              numberOfLines={1}
            >
              {`#${String(sight.dex_no).padStart(3, '0')}`}
            </Text>
            <Text
              style={[
                t.type.body,
                {
                  color: sight.found ? t.colors.text1 : t.colors.text2,
                  fontWeight: '700',
                  fontSize: 15,
                  flex: 1,
                },
              ]}
              numberOfLines={1}
            >
              {sight.name}
            </Text>
          </View>
          {/* Mono meta line: Found (green) / Not found (text3) — distance omitted (geolocation unwired) */}
          <Text
            style={{
              fontFamily: t.fontFamily.monoRegular,
              fontSize: 11,
              color: sight.found ? t.colors.green : t.colors.text3,
            }}
            numberOfLines={1}
          >
            {sight.found ? 'Found' : 'Not found'}
          </Text>
        </View>

        {/* See-more chevron chip — round Glass/surface2 disc */}
        {onSeeMore && (
          <Pressable
            testID={`seemore-${sight.id}`}
            onPress={() => onSeeMore(sight.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: t.colors.surface2,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ color: t.colors.text2, fontSize: 17, lineHeight: 20 }}>{'›'}</Text>
          </Pressable>
        )}
      </Pressable>
    );
  }

  // ---- dex variant (default) ----
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

      {/* Middle: name + chips (blue-only) — flex:1 with minWidth:0 to prevent overflow */}
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

        {/* Type chips — blue-only (chips are info, not state) */}
        {chips.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s1 }}>
            {chips.map(tag => (
              <View
                key={tag}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 2,
                  paddingHorizontal: t.spacing.s2,
                  borderRadius: t.radii.pill,
                  backgroundColor: t.colors.blueDim,
                  borderWidth: 1,
                  borderColor: t.colors.blueLine,
                }}
              >
                <Text
                  style={[
                    t.type.label,
                    {
                      color: t.colors.blue,
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
            ))}
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
