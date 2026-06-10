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

export default function City() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCityId } = useCity();
  const { session } = useAuth();
  const { sights, completion } = useCityCatalog(id!);

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

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
        {/* Header row: completion + sparkles */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[t.type.stat, { color: t.colors.text1, flex: 1 }]}>
            {`${completion.found} of ${completion.total} found`}
          </Text>
          <Pressable
            testID="highlights-btn"
            onPress={() => router.push('/highlights/' + id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontSize: 20 }}>✨</Text>
          </Pressable>
        </View>

        {/* Open map button */}
        <Pressable
          onPress={openMap}
          style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}
        >
          <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Open map</Text>
        </Pressable>

        {/* Search input */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sights"
          placeholderTextColor={t.colors.text3}
          style={[
            t.type.body,
            {
              color: t.colors.text1,
              backgroundColor: t.colors.surface2,
              borderRadius: t.radii.sm,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
              paddingHorizontal: t.spacing.s4,
              paddingVertical: t.spacing.s3,
            },
          ]}
        />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={s => s.id}
        renderItem={({ item }) => (
          <SightRow
            sight={item}
            onPress={() => router.push(`/sight/${item.id}`)}
            favorited={favIds.has(item.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      />
    </View>
  );
}
