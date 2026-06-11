import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useAuth } from '../context/AuthProvider';
import { useCity } from '../context/CityProvider';
import { useActiveCity } from '../hooks/useActiveCity';
import { getGemsForCity, setGemFavorite, reportGem, Gem } from '../lib/data/gems';
import { relativeTime } from '../lib/relativeTime';

type Sort = 'favs' | 'newest' | 'nearest';

type GemWithLocal = Gem & { reported?: boolean };

function sortGems(gems: GemWithLocal[], sort: Sort): GemWithLocal[] {
  return [...gems].sort((a, b) => {
    if (sort === 'favs') return b.favs_count - a.favs_count;
    if (sort === 'newest') {
      const ta = a.approved_at ? new Date(a.approved_at).getTime() : 0;
      const tb = b.approved_at ? new Date(b.approved_at).getTime() : 0;
      return tb - ta;
    }
    // nearest
    return a.distance_m - b.distance_m;
  });
}

export function GemsTab() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const { cityId } = useCity();
  const { city } = useActiveCity(cityId);
  const [gems, setGems] = useState<GemWithLocal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sort, setSort] = useState<Sort>('favs');

  const uid = session?.user?.id ?? '';

  useEffect(() => {
    if (!uid || !cityId) { setLoaded(true); return; }
    setLoaded(false);
    getGemsForCity(cityId, uid)
      .then(rows => setGems(rows))
      .catch((e: any) => console.warn('GemsTab load failed', e))
      .finally(() => setLoaded(true));
  }, [cityId, uid]);

  const cityName = city?.name ?? '';

  // Pending (own) gems always on top, regardless of sort
  const pending = gems.filter(g => g.status === 'pending' && g.author_id === uid);
  const approved = gems.filter(g => g.status === 'approved');
  const sorted = sortGems(approved, sort);
  const displayed = [...pending, ...sorted];

  function toggleFav(gem: GemWithLocal) {
    const newFaved = !gem.faved;
    const delta = newFaved ? 1 : -1;
    setGems(prev =>
      prev.map(g =>
        g.id === gem.id ? { ...g, faved: newFaved, favs_count: g.favs_count + delta } : g
      )
    );
    setGemFavorite(uid, gem.id, newFaved).catch((e: any) => {
      console.warn('setGemFavorite failed', e);
      setGems(prev =>
        prev.map(g =>
          g.id === gem.id ? { ...g, faved: gem.faved, favs_count: gem.favs_count } : g
        )
      );
    });
  }

  function onReport(gem: GemWithLocal) {
    Alert.alert('Report this gem?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: () => {
          setGems(prev => prev.map(g => g.id === gem.id ? { ...g, reported: true } : g));
          reportGem(uid, gem.id).catch((e: any) => console.warn('reportGem failed', e));
        },
      },
    ]);
  }

  const segmentBtnStyle = (active: boolean) => ({
    flex: 1,
    paddingVertical: t.spacing.s2,
    alignItems: 'center' as const,
    borderRadius: t.radii.sm,
    backgroundColor: active ? t.colors.amberDim : t.colors.surface2,
    borderWidth: 1,
    borderColor: active ? t.colors.amberLine : 'transparent',
  });

  const segmentTextStyle = (active: boolean) => [
    t.type.caption,
    { color: active ? t.colors.amber : t.colors.text3, fontFamily: t.fontFamily.monoRegular },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Header: always visible, outside FlatList */}
      <View style={{ padding: t.spacing.s4 }}>
        <Text style={[t.type.caption, { color: t.colors.text2, marginBottom: t.spacing.s3 }]}>
          {`Hidden gems near `}
          <Text style={{ color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }}>{cityName}</Text>
          {` — spotted by travelers, not yet in the dex.`}
        </Text>
        <Pressable
          testID="share-gem-btn"
          onPress={() => router.push('/community/share-gem')}
          style={{
            backgroundColor: t.colors.amber,
            borderRadius: t.radii.pill,
            paddingVertical: t.spacing.s3,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: t.spacing.s2,
            marginBottom: t.spacing.s4,
          }}
        >
          <Ionicons name="camera-outline" size={17} color="#000" />
          <Text style={[t.type.body, { color: '#000', fontFamily: t.fontFamily.sansSemibold }]}>Share a hidden gem</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
          <Pressable testID="sort-favs" onPress={() => setSort('favs')} style={segmentBtnStyle(sort === 'favs')}>
            <Text style={segmentTextStyle(sort === 'favs')}>Most favorited</Text>
          </Pressable>
          <Pressable testID="sort-newest" onPress={() => setSort('newest')} style={segmentBtnStyle(sort === 'newest')}>
            <Text style={segmentTextStyle(sort === 'newest')}>Newest</Text>
          </Pressable>
          <Pressable testID="sort-nearest" onPress={() => setSort('nearest')} style={segmentBtnStyle(sort === 'nearest')}>
            <Text style={segmentTextStyle(sort === 'nearest')}>Nearest</Text>
          </Pressable>
        </View>
      </View>

      {/* Gem list */}
      <FlatList
        data={displayed}
        keyExtractor={g => g.id}
        ListEmptyComponent={
          loaded ? (
            <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>
              {`No gems near ${cityName} yet — share the first one.`}
            </Text>
          ) : null
        }
        renderItem={({ item: gem }) => {
          // Own pending gem
          if (gem.status === 'pending' && gem.author_id === uid) {
            return (
              <View
                style={{
                  marginHorizontal: t.spacing.s4,
                  marginBottom: t.spacing.s3,
                  backgroundColor: t.colors.surface1,
                  borderRadius: t.radii.lg,
                  borderWidth: 1,
                  borderColor: t.colors.amberLine,
                  overflow: 'hidden',
                }}
              >
                {gem.photo_url ? (
                  <Image
                    source={{ uri: gem.photo_url }}
                    style={{ width: '100%', height: 160 }}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={{ padding: t.spacing.s4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, marginBottom: t.spacing.s1 }}>
                    <Text style={[t.type.h3, { color: t.colors.text1, flex: 1 }]}>{gem.name}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        height: 24,
                        paddingHorizontal: t.spacing.s2,
                        borderRadius: t.radii.pill,
                        backgroundColor: t.colors.amberDim,
                        borderWidth: 1,
                        borderColor: t.colors.amberLine,
                      }}
                    >
                      <Ionicons name="time-outline" size={11} color={t.colors.amber} />
                      <Text
                        style={[
                          t.type.caption,
                          {
                            color: t.colors.amber,
                            fontFamily: t.fontFamily.monoBold,
                            fontSize: 9,
                            letterSpacing: 0.8,
                          },
                        ]}
                      >
                        IN REVIEW
                      </Text>
                    </View>
                  </View>
                  {gem.note ? (
                    <Text style={[t.type.body, { color: t.colors.text2 }]}>{gem.note}</Text>
                  ) : null}
                </View>
              </View>
            );
          }

          // Reported gem
          if (gem.reported) {
            return (
              <View
                style={{
                  marginHorizontal: t.spacing.s4,
                  marginBottom: t.spacing.s3,
                  backgroundColor: t.colors.surface2,
                  borderRadius: t.radii.lg,
                  padding: t.spacing.s4,
                }}
              >
                <Text style={[t.type.caption, { color: t.colors.text3 }]}>Reported · under review</Text>
              </View>
            );
          }

          // Approved gem
          return (
            <View
              style={{
                marginHorizontal: t.spacing.s4,
                marginBottom: t.spacing.s3,
                backgroundColor: t.colors.surface1,
                borderRadius: t.radii.lg,
                borderWidth: 1,
                borderColor: t.colors.borderSubtle,
                overflow: 'hidden',
              }}
            >
              {gem.photo_url ? (
                <Image
                  source={{ uri: gem.photo_url }}
                  style={{ width: '100%', height: 160 }}
                  resizeMode="cover"
                />
              ) : null}
              <View style={{ padding: t.spacing.s4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: t.spacing.s2 }}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[t.type.h3, { color: t.colors.text1, marginBottom: t.spacing.s1 }]}>{gem.name}</Text>
                    <Text
                      style={[
                        t.type.caption,
                        {
                          color: t.colors.text3,
                          fontFamily: t.fontFamily.monoRegular,
                          marginBottom: t.spacing.s2,
                          textTransform: 'uppercase',
                          fontSize: 10,
                          letterSpacing: 0.5,
                        },
                      ]}
                    >
                      {`BY ${gem.author_name} · ${(gem.distance_m / 1000).toFixed(1)} KM · ${relativeTime(gem.approved_at ?? gem.created_at)}`}
                    </Text>
                    {gem.note ? (
                      <Text style={[t.type.body, { color: t.colors.text2, marginBottom: t.spacing.s3 }]}>{gem.note}</Text>
                    ) : null}
                  </View>
                  {/* Star chip — pinned to right of name row */}
                  <Pressable
                    testID={`star-${gem.id}`}
                    onPress={() => toggleFav(gem)}
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      paddingHorizontal: t.spacing.s2,
                      paddingVertical: t.spacing.s2,
                      borderRadius: t.radii.sm,
                      borderWidth: 1,
                      backgroundColor: gem.faved ? t.colors.amberDim : t.colors.surface2,
                      borderColor: gem.faved ? t.colors.amberLine : t.colors.borderSubtle,
                      flexShrink: 0,
                      minWidth: 38,
                    }}
                  >
                    <Text
                      style={[
                        t.type.caption,
                        {
                          color: gem.faved ? t.colors.amber : t.colors.text3,
                          fontFamily: t.fontFamily.monoBold,
                        },
                      ]}
                    >
                      {`★ ${gem.favs_count}`}
                    </Text>
                  </Pressable>
                </View>

                {/* Report */}
                <Pressable
                  testID={`report-${gem.id}`}
                  onPress={() => onReport(gem)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Ionicons name="flag-outline" size={11} color={t.colors.text3} />
                  <Text
                    style={[
                      t.type.caption,
                      {
                        color: t.colors.text3,
                        fontFamily: t.fontFamily.monoRegular,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        fontSize: 10,
                      },
                    ]}
                  >
                    Report
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
