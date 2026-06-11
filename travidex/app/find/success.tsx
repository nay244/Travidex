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

  return (
    <Screen>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.s4, padding: t.spacing.s5 }}>
      {isAlready ? (
        <>
          {sight && (
            <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>{sight.name}</Text>
          )}
          <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center' }]}>Already in your dex</Text>
        </>
      ) : (
        <>
          {sight && (
            <>
              <Text style={[t.type.stat, { color: t.colors.text3 }]}>
                {'#' + String(sight.dex_no).padStart(3, '0')}
              </Text>
              <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>{sight.name}</Text>
            </>
          )}
          <Text style={[t.type.h1, { color: t.colors.green }]}>Added to your dex!</Text>
          <CompletionBar label="This city" found={completion.found} total={completion.total} />
          {badgeText && (
            <View style={{ backgroundColor: t.colors.foundBg, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
              <Text style={[t.type.h3, { color: t.colors.green }]}>{badgeText}</Text>
            </View>
          )}
        </>
      )}
      <Pressable
        onPress={() => router.replace('/(tabs)/map')}
        style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}
      >
        <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Done</Text>
      </Pressable>
    </View>
    </Screen>
  );
}
