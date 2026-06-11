import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { progressState } from '../lib/claim';

/**
 * ChunkTile — square tile in the 3-col explore board.
 *
 * Anatomy (per spec §3.5 / PNG 07):
 *   top-left  — region label (mono caps, ellipsized)
 *   top-right — state marker: green ✓ disc (claimed) / amber dot (in-progress) / hollow ring (untouched)
 *   bottom    — city name (sans 600) + mono count on the line below, zIndex 1
 *   fill      — gradient rising from bottom: 3 stacked amberDim layers (no hard border line)
 *               claimed → solid greenDim fill + 2px green bar pinned at tile top + green glow
 *
 * Optional `region` prop shows a mono region label top-left.
 * Optional `testID` forwarded to the root Pressable for grid assertions.
 */
export function ChunkTile({
  name,
  found,
  total,
  onPress,
  region,
  testID,
}: {
  name: string;
  found: number;
  total: number;
  onPress: () => void;
  region?: string;
  testID?: string;
}) {
  const t = useTheme();
  const state = progressState(found, total);
  const pct = total > 0 ? Math.min(100, Math.round((found / total) * 100)) : 0;

  const borderColor =
    state === 'claimed'
      ? t.colors.chunkClaimed
      : state === 'in-progress'
      ? t.colors.chunkProgress
      : t.colors.chunkUntouched;

  const claimedGlow =
    state === 'claimed'
      ? {
          shadowColor: t.colors.greenGlow ?? t.colors.chunkClaimed,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.55,
          shadowRadius: 8,
          elevation: 4,
        }
      : {};

  // Gradient approximation: 3 stacked amberDim layers, bottom-anchored.
  // Heights cap at 100% to avoid overflow.
  const h1 = Math.min(100, pct);           // bottom layer — full opacity amberDim
  const h2 = Math.min(100, pct * 1.15);   // middle layer — 0.66 opacity
  const h3 = Math.min(100, pct * 1.3);    // top layer    — 0.33 opacity

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        {
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
        },
        claimedGlow,
      ]}
    >
      {/* ── Fill layer(s) ── */}
      {state === 'claimed' ? (
        /* Claimed: solid greenDim full fill */
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: t.colors.greenDim,
          }}
        />
      ) : state === 'in-progress' ? (
        /* In-progress: 3-layer gradient approximation (bottom-anchored) */
        <>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${h3}%`,
              backgroundColor: t.colors.amberDim,
              opacity: 0.33,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${h2}%`,
              backgroundColor: t.colors.amberDim,
              opacity: 0.66,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${h1}%`,
              backgroundColor: t.colors.amberDim,
              opacity: 1,
            }}
          />
        </>
      ) : null}

      {/* Claimed: 2px green bar pinned at tile top */}
      {state === 'claimed' && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 2,
            backgroundColor: t.colors.chunkClaimed,
          }}
        />
      )}

      {/* ── Top row: region label + status marker ── */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 1,
        }}
      >
        {/* Left: region label (mono caps, ellipsized) */}
        <Text
          style={[
            t.type.label,
            {
              color: t.colors.text3,
              fontSize: t.fontSize.micro,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              flex: 1,
              minWidth: 0,
            },
          ]}
          numberOfLines={1}
        >
          {region ?? ''}
        </Text>

        {/* Right: state marker */}
        {state === 'claimed' ? (
          <View
            testID="claimed"
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: t.colors.chunkClaimed,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 4,
              flexShrink: 0,
            }}
          >
            <Text style={{ color: t.colors.textOnAccent, fontSize: 9, lineHeight: 11 }}>✓</Text>
          </View>
        ) : (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: state === 'in-progress' ? borderColor : 'transparent',
              borderWidth: 2,
              borderColor: state === 'in-progress' ? borderColor : t.colors.chunkUntouched,
              marginLeft: 4,
              flexShrink: 0,
            }}
          />
        )}
      </View>

      {/* ── Bottom: city name + mono count ── */}
      <View style={{ zIndex: 1 }}>
        <Text
          style={[
            t.type.body,
            {
              color: state === 'claimed' ? t.colors.text1 : t.colors.text2,
              fontWeight: '600',
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={[
            t.type.label,
            {
              color: state === 'claimed' ? t.colors.green : t.colors.text3,
              fontSize: 11,
              fontWeight: '700',
              marginTop: 2,
              letterSpacing: 0,
            },
          ]}
          numberOfLines={1}
        >
          {`${found}`}
          <Text style={{ color: t.colors.text3 }}>{`/${total}`}</Text>
        </Text>
      </View>
    </Pressable>
  );
}
