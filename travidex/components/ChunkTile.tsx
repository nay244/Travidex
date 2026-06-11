import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { progressState } from '../lib/claim';

/**
 * ChunkTile — square tile in the 3-col explore board.
 *
 * Visual: bottom-up fill whose height = (found/total)*100%.
 *   - claimed  → fill color chunkClaimed (green), small ✓ disc top-right
 *   - in-progress → fill color chunkProgress (amber), dot indicator top-right
 *   - untouched → no fill, hollow dot top-right
 *
 * Optional `region` prop shows a mono region label top-left (per ref 07/08).
 * All existing consumers (name, found, total, onPress) remain compatible.
 */
export function ChunkTile({
  name,
  found,
  total,
  onPress,
  region,
}: {
  name: string;
  found: number;
  total: number;
  onPress: () => void;
  region?: string;
}) {
  const t = useTheme();
  const state = progressState(found, total);
  const pct = total > 0 ? Math.min(100, Math.round((found / total) * 100)) : 0;

  const fillColor =
    state === 'claimed'
      ? t.colors.chunkClaimed
      : state === 'in-progress'
      ? t.colors.chunkProgress
      : 'transparent';

  const borderColor =
    state === 'claimed'
      ? t.colors.chunkClaimed
      : state === 'in-progress'
      ? t.colors.chunkProgress
      : t.colors.chunkUntouched;

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: 1,
        width: '100%',
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor,
        backgroundColor: t.colors.surface1,
        padding: t.spacing.s3,
        justifyContent: 'space-between',
      }}
    >
      {/* Bottom-up fill */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${pct}%`,
          backgroundColor: fillColor,
        }}
      />

      {/* Top row: region label + status indicator */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text
          style={[
            t.type.label,
            {
              color: t.colors.text3,
              fontSize: t.fontSize.micro,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            },
          ]}
          numberOfLines={1}
        >
          {region ?? ''}
        </Text>

        {state === 'claimed' ? (
          /* Claimed: green ✓ disc */
          <View
            testID="claimed"
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: t.colors.chunkClaimed,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: t.colors.textOnAccent, fontSize: 9, lineHeight: 11 }}>✓</Text>
          </View>
        ) : (
          /* In-progress: filled dot; untouched: hollow dot */
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: state === 'in-progress' ? borderColor : 'transparent',
              borderWidth: 2,
              borderColor: state === 'in-progress' ? borderColor : t.colors.chunkUntouched,
            }}
          />
        )}
      </View>

      {/* Bottom: name + count */}
      <View>
        <Text
          style={[
            t.type.body,
            { color: state === 'claimed' ? t.colors.text1 : t.colors.text2, fontWeight: '600' },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={[
            t.type.label,
            {
              color: state === 'claimed' ? t.colors.chunkClaimed : t.colors.text3,
              fontWeight: '700',
              marginTop: 2,
            },
          ]}
        >
          {`${found}/${total}`}
        </Text>
      </View>
    </Pressable>
  );
}
