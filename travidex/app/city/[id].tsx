import { useState, useEffect, useCallback } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';
import { filterSights, sortSights } from '../../lib/sightList';
import { getFavoriteSightIds, setFavorite } from '../../lib/data/favorites';
import { useAuth } from '../../context/AuthProvider';
import { Screen } from '../../components/Screen';
import { useActiveCity } from '../../hooks/useActiveCity';

export default function City() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCityId } = useCity();
  const { session } = useAuth();
  const { sights, completion } = useCityCatalog(id!);
  const { city } = useActiveCity(id!);

  const [query, setQuery] = useState('');
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  // Load favorites on mount
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    getFavoriteSightIds(uid)
      .then(ids => setFavIds(ids))
      .catch(err => console.warn('Failed to load favorites', err));
  }, [session?.user?.id]);

  const handleToggleFavorite = useCallback(async (sightId: string) => {
    const uid = session?.user?.id;
    if (!uid) return;
    const wasOn = favIds.has(sightId);
    // Optimistic update
    setFavIds(prev => {
      const next = new Set(prev);
      if (wasOn) next.delete(sightId); else next.add(sightId);
      return next;
    });
    try {
      await setFavorite(uid, sightId, !wasOn);
    } catch (err) {
      console.warn('Failed to toggle favorite', err);
      // Revert
      setFavIds(prev => {
        const next = new Set(prev);
        if (wasOn) next.add(sightId); else next.delete(sightId);
        return next;
      });
    }
  }, [favIds, session?.user?.id]);

  function openMap() {
    setCityId(id!);
    router.replace('/(tabs)/map');
  }

  const displayed = sortSights(filterSights(sights, query), 'dex');

  const cityName = city?.name ?? '…';
  const regionLabel = city?.region ?? '';

  return (
    <Screen>
      {/* ── Region Dex header ── */}
      <View
        style={{
          paddingTop: t.spacing.s3,
          paddingBottom: t.spacing.s3,
          paddingHorizontal: t.spacing.s3,
          backgroundColor: t.colors.surfaceOverlay,
          borderBottomWidth: 1,
          borderBottomColor: t.colors.borderSubtle,
          gap: t.spacing.s2,
        }}
      >
        {/* Back + city name row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s1 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={8}
          >
            <Text style={{ color: t.colors.text1, fontSize: 22, lineHeight: 26 }}>{'‹'}</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[t.type.h2, { color: t.colors.text1 }]} numberOfLines={1}>
              {cityName}
            </Text>
            <Text
              style={[
                t.type.label,
                { color: t.colors.text3, fontSize: 10, marginTop: 1 },
              ]}
            >
              {regionLabel ? `${regionLabel} · ` : ''}
              <Text
                style={{
                  color:
                    completion.found >= completion.total && completion.total > 0
                      ? t.colors.green
                      : t.colors.text2,
                }}
              >
                {`${completion.found}/${completion.total} FOUND`}
              </Text>
            </Text>
          </View>
        </View>

        {/* Search + sort/filter + sparkles row */}
        <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
          {/* Search field */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s2,
              height: 42,
              paddingHorizontal: t.spacing.s3,
              backgroundColor: t.colors.surface2,
              borderRadius: t.radii.md,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
            }}
          >
            <Text style={{ color: t.colors.text3, fontSize: 15 }}>{'⌕'}</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={`Search ${cityName}`}
              placeholderTextColor={t.colors.text3}
              style={[
                t.type.body,
                {
                  flex: 1,
                  color: t.colors.text1,
                },
              ]}
            />
          </View>

          {/* Sort button */}
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: t.radii.md,
              backgroundColor: t.colors.surface2,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: t.colors.text2, fontSize: 15 }}>{'⇅'}</Text>
          </View>

          {/* Filter button */}
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: t.radii.md,
              backgroundColor: t.colors.surface2,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: t.colors.text2, fontSize: 15 }}>{'≡'}</Text>
          </View>

          {/* Sparkles / highlights button */}
          <Pressable
            testID="highlights-btn"
            onPress={() => router.push('/highlights/' + id)}
            style={{
              width: 42,
              height: 42,
              borderRadius: t.radii.md,
              backgroundColor: t.colors.amberDim,
              borderWidth: 1,
              borderColor: t.colors.amberLine,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ color: t.colors.amber, fontSize: 16 }}>{'✨'}</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Open map button ── */}
      <Pressable
        onPress={openMap}
        style={{
          backgroundColor: t.colors.actionPositive,
          marginHorizontal: t.spacing.s4,
          marginTop: t.spacing.s3,
          marginBottom: t.spacing.s2,
          padding: t.spacing.s4,
          borderRadius: t.radii.sm,
        }}
      >
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Open map</Text>
      </Pressable>

      <FlatList
        data={displayed}
        keyExtractor={s => s.id}
        contentContainerStyle={{ paddingHorizontal: t.spacing.s4, paddingBottom: t.spacing.s8 }}
        renderItem={({ item }) => (
          <SightRow
            sight={item}
            onPress={() => router.push(`/sight/${item.id}`)}
            favorited={favIds.has(item.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      />
    </Screen>
  );
}
