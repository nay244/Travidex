import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { getSightById } from '../../lib/data/catalog';
import { getUserFindCount } from '../../lib/data/finds';
import { useAuth } from '../../context/AuthProvider';
import { isClaimed } from '../../lib/claim';
import { CompletionBar } from '../../components/CompletionBar';
import type { Sight } from '../../lib/types';

export default function Success() {
  const t = useTheme();
  const router = useRouter();
  const { sightId, already } = useLocalSearchParams<{ sightId?: string; already?: string }>();
  const { cityId } = useCity();
  const { session } = useAuth();
  const { completion } = useCityCatalog(cityId);
  const [sight, setSight] = useState<Sight | null>(null);
  const [totalFinds, setTotalFinds] = useState<number | null>(null);

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

  const isAlready = already === '1';

  // Badge logic for new-find variant ("First find!" is the user's first EVER find)
  let badgeText: string | null = null;
  if (!isAlready) {
    if (completion.total > 0 && isClaimed(completion.found, completion.total)) {
      badgeText = 'City claimed!';
    } else if (totalFinds === 1) {
      badgeText = 'First find!';
    }
  }

  const dexLabel = sight ? '#' + String(sight.dex_no).padStart(3, '0') : null;

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.s6 }}>

        {/* Stamp disc */}
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

        {/* Label + name + dex row */}
        <View style={{ alignItems: 'center', width: '100%', marginBottom: t.spacing.s6 }}>
          {isAlready ? (
            <>
              <Text style={[t.type.label, { color: t.colors.green, marginBottom: t.spacing.s3 }]}>
                Already in your dex
              </Text>
              {sight && (
                <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>
                  {sight.name}
                </Text>
              )}
              {dexLabel && (
                <Text style={[t.type.monoSm, { color: t.colors.text3, marginTop: t.spacing.s2 }]}>
                  {dexLabel}
                </Text>
              )}
              <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center', marginTop: t.spacing.s4 }]}>
                You've already logged this find. Your dex entry is saved.
              </Text>
            </>
          ) : (
            <>
              <Text style={[t.type.label, { color: t.colors.green, marginBottom: t.spacing.s3 }]}>
                Added to your dex!
              </Text>
              {sight && (
                <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>
                  {sight.name}
                </Text>
              )}
              {dexLabel && (
                <Text style={[t.type.monoSm, { color: t.colors.text3, marginTop: t.spacing.s2 }]}>
                  {dexLabel}
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
              <CompletionBar label="This city" found={completion.found} total={completion.total} />
            </View>

            {badgeText && (
              <View style={{
                width: '100%',
                backgroundColor: t.colors.foundBg,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: t.colors.greenLine,
                padding: t.spacing.s4,
                marginBottom: t.spacing.s3,
              }}>
                <Text style={[t.type.h3, { color: t.colors.green }]}>{badgeText}</Text>
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
