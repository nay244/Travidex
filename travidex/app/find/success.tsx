import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { getSightById } from '../../lib/data/catalog';
import { getUserFindCount } from '../../lib/data/finds';
import { useAuth } from '../../context/AuthProvider';
import { isClaimed } from '../../lib/claim';
import { CompletionBar } from '../../components/CompletionBar';
import { Medallion } from '../../components/Medallion';
import { BADGES } from '../../lib/badges';
import type { Sight } from '../../lib/types';

// Confetti speck definitions — 14 specks, positions seeded deterministically by index.
// Colors cycle through green/amber/blue token values (resolved at render time).
const SPECK_COUNT = 14;
type SpeckDef = {
  leftPct: number;
  topPct: number;
  size: number;
  colorKey: 0 | 1 | 2;
  circle: boolean;
  delay: number;
  duration: number;
};
function buildSpecks(): SpeckDef[] {
  return Array.from({ length: SPECK_COUNT }, (_, i) => ({
    leftPct: 8 + ((i * 37) % 84),
    topPct: 4 + ((i * 53) % 44),
    size: 4 + (i % 5),
    colorKey: (i % 3) as 0 | 1 | 2,
    circle: i % 2 === 0,
    delay: (i * 22) % 300,
    duration: 900 + ((i * 61) % 600),
  }));
}
const SPECKS = buildSpecks();

function ConfettiSpecks({ reduceMotion }: { reduceMotion: boolean }) {
  const t = useTheme();
  const speckColors = [t.colors.green, t.colors.amber, t.colors.blue];

  // One Animated.Value per speck for the fall translation.
  const anims = useRef(SPECKS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduceMotion) return;

    const loops = anims.map((anim, i) => {
      const speck = SPECKS[i];
      anim.setValue(0);
      return Animated.loop(
        Animated.sequence([
          Animated.delay(speck.delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: speck.duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });

    const group = Animated.parallel(loops);
    group.start();
    return () => group.stop();
  }, [reduceMotion]);

  return (
    <View
      testID="confetti"
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
    >
      {SPECKS.map((speck, i) => {
        const translateY = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 200],
        });
        const opacity = anims[i].interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0.85, 0.6, 0],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: `${speck.leftPct}%` as `${number}%`,
              top: `${speck.topPct}%` as `${number}%`,
              width: speck.size,
              height: speck.size,
              borderRadius: speck.circle ? speck.size / 2 : 2,
              backgroundColor: speckColors[speck.colorKey],
              opacity: reduceMotion ? 0.85 : opacity,
              transform: reduceMotion ? [] : [{ translateY }],
            }}
          />
        );
      })}
    </View>
  );
}

export default function Success() {
  const t = useTheme();
  const router = useRouter();
  const { sightId, already } = useLocalSearchParams<{ sightId?: string; already?: string }>();
  const { cityId } = useCity();
  const { session } = useAuth();
  const { completion } = useCityCatalog(cityId);
  const { city } = useActiveCity(cityId);
  const [sight, setSight] = useState<Sight | null>(null);
  const [totalFinds, setTotalFinds] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (sightId) {
      getSightById(sightId).then(setSight).catch(() => setSight(null));
    }
  }, [sightId]);

  useEffect(() => {
    if (session?.user) {
      getUserFindCount(session.user.id).then(setTotalFinds).catch(() => setTotalFinds(null));
    }
  }, [session?.user?.id]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  const isAlready = already === '1';

  // Badge logic for new-find variant
  let badgeText: string | null = null;
  let badgeCode: string | null = null;
  if (!isAlready) {
    if (completion.total > 0 && isClaimed(completion.found, completion.total)) {
      badgeText = 'City claimed!';
      badgeCode = 'city_claimed';
    } else if (totalFinds === 1) {
      badgeText = 'First find!';
      badgeCode = 'first_find';
    }
  }

  // Resolve badge metadata from BADGES registry
  const badgeDef = badgeCode ? BADGES.find(b => b.code === badgeCode) : null;

  const dexLabel = sight ? '#' + String(sight.dex_no).padStart(3, '0') : null;
  const cityName = city?.name ?? null;
  const metaLine = dexLabel
    ? cityName
      ? `${dexLabel} · ${cityName}`
      : dexLabel
    : null;

  const completionLabel = city?.name?.toUpperCase() ?? 'THIS CITY';

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.s6 }}>

        {/* Green radial wash — always present, prominent on already variant */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180 }}
        >
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 120,
            backgroundColor: t.colors.wash1,
            opacity: isAlready ? 0.9 : 0.5,
          }} />
          <View style={{
            position: 'absolute',
            top: 80, left: 0, right: 0,
            height: 100,
            backgroundColor: t.colors.wash2,
            opacity: isAlready ? 0.6 : 0.3,
          }} />
        </View>

        {/* Confetti — new-find only */}
        {!isAlready && <ConfettiSpecks reduceMotion={reduceMotion} />}

        {/* Stamp disc / medallion */}
        <View style={{
          width: 80,
          height: 80,
          borderRadius: t.radii.pill,
          backgroundColor: t.colors.foundBg,
          borderWidth: 2,
          borderColor: t.colors.greenLine,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: t.spacing.s6,
          shadowColor: isAlready ? t.colors.greenGlow : undefined,
          shadowOpacity: isAlready ? 1 : 0,
          shadowRadius: isAlready ? 18 : 0,
          shadowOffset: { width: 0, height: 0 },
        }}>
          <View style={{
            width: 52,
            height: 52,
            borderRadius: t.radii.pill,
            backgroundColor: t.colors.actionPositive,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: t.colors.textOnAccent, fontSize: 24, lineHeight: 28 }}>✓</Text>
          </View>
        </View>

        {/* Label + name + meta row */}
        <View style={{ alignItems: 'center', width: '100%', marginBottom: t.spacing.s6 }}>
          {isAlready ? (
            <>
              <Text style={[t.type.label, { color: t.colors.green, marginBottom: t.spacing.s3, textTransform: 'uppercase' }]}>
                Already in your dex
              </Text>
              {sight && (
                <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>
                  {sight.name}
                </Text>
              )}
              {metaLine && (
                <Text style={[t.type.monoSm, { color: t.colors.text3, marginTop: t.spacing.s2 }]}>
                  {metaLine}
                </Text>
              )}
              <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center', marginTop: t.spacing.s4 }]}>
                You've already logged this find. Your dex entry is saved.
              </Text>
            </>
          ) : (
            <>
              <Text style={[t.type.label, { color: t.colors.green, marginBottom: t.spacing.s3, textTransform: 'uppercase' }]}>
                Added to your dex
              </Text>
              {sight && (
                <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>
                  {sight.name}
                </Text>
              )}
              {metaLine && (
                <Text style={[t.type.monoSm, { color: t.colors.text3, marginTop: t.spacing.s2 }]}>
                  {metaLine}
                </Text>
              )}
            </>
          )}
        </View>

        {/* New-find only: completion bar + badge */}
        {!isAlready && (
          <>
            <View style={{
              width: '100%',
              backgroundColor: t.colors.surface1,
              borderRadius: t.radii.md,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
              padding: t.spacing.s4,
              marginBottom: t.spacing.s3,
            }}>
              <CompletionBar label={completionLabel} found={completion.found} total={completion.total} />
            </View>

            {badgeText && (
              <View style={{
                width: '100%',
                backgroundColor: (t.colors as any).amberDim,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: (t.colors as any).amberLine,
                padding: t.spacing.s4,
                marginBottom: t.spacing.s3,
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing.s3,
              }}>
                {badgeDef && (
                  <Medallion
                    icon={badgeDef.icon}
                    tone={badgeDef.tone}
                    earned
                    size={40}
                  />
                )}
                <View>
                  <Text style={[t.type.monoSm, {
                    color: (t.colors as any).amber,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  }]}>
                    {`BADGE UNLOCKED · ${badgeDef?.label?.toUpperCase() ?? badgeText.toUpperCase()}`}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: t.spacing.s3, width: '100%', marginTop: t.spacing.s3 }}>
          <Pressable
            onPress={() => router.replace('/(tabs)/map')}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: t.colors.borderDefault,
              padding: t.spacing.s4,
              borderRadius: t.radii.pill,
              alignItems: 'center',
            }}
          >
            <Text style={[t.type.h3, { color: t.colors.text1 }]}>{isAlready ? 'Map' : 'Done'}</Text>
          </Pressable>
          <Pressable
            onPress={() => sightId ? router.push(`/sight/${sightId}`) : router.replace('/(tabs)/map')}
            style={{
              flex: 1,
              backgroundColor: t.colors.actionPositive,
              padding: t.spacing.s4,
              borderRadius: t.radii.pill,
              alignItems: 'center',
            }}
          >
            <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>View entry</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
