import { Image, ScrollView, Share, Text, View, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useSight } from '../../hooks/useSight';
import { LogFindSheet } from '../../components/LogFindSheet';
import { YourPhotos } from '../../components/YourPhotos';
import { Glass } from '../../components/Glass';
import { getCityWithCountry } from '../../lib/data/citiesByCountry';
import { getFavoriteSightIds, setFavorite } from '../../lib/data/favorites';
import { relativeTime } from '../../lib/relativeTime';
import { useAuth } from '../../context/AuthProvider';

export default function SightDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, found, recentFinds, loading, reload } = useSight(id!);
  const { session } = useAuth();

  const [hintOpen, setHintOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  // Load favorite state
  useEffect(() => {
    if (!session?.user || !sight) return;
    getFavoriteSightIds(session.user.id)
      .then(ids => setIsFav(ids.has(sight.id)))
      .catch(err => console.warn('fav load failed', err));
  }, [session?.user?.id, sight?.id]);

  // Load city + country
  useEffect(() => {
    if (!sight?.city_id) return;
    getCityWithCountry(sight.city_id)
      .then(c => { if (c) setLocationLabel(`${c.name}, ${c.country_name}`); })
      .catch(err => console.warn('city load failed', err));
  }, [sight?.city_id]);

  const handleFavToggle = useCallback(async () => {
    if (!session?.user || !sight) return;
    const next = !isFav;
    setIsFav(next); // optimistic
    try {
      await setFavorite(session.user.id, sight.id, next);
    } catch (err) {
      setIsFav(!next); // revert
      console.warn('fav toggle failed', err);
    }
  }, [session?.user?.id, sight?.id, isFav]);

  const handleShare = useCallback(async () => {
    if (!sight) return;
    const dexLabel = '#' + String(sight.dex_no).padStart(3, '0');
    const city = locationLabel?.split(',')[0] ?? '';
    try {
      await Share.share({ message: `${sight.name} on Travidex — ${dexLabel} in ${city}` });
    } catch (err) {
      console.warn('share failed', err);
    }
  }, [sight, locationLabel]);

  if (loading || !sight) return <Screen><View style={{ flex: 1 }} /></Screen>;

  const dexLabel = '#' + String(sight.dex_no).padStart(3, '0');

  // Count recent finds within last 7 days
  const now = new Date();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekCount = recentFinds.filter(f => new Date(f.found_at).getTime() >= sevenDaysAgo).length;

  // Striped placeholder rows — alternating phStripe/phBase
  const STRIPE_COUNT = 14;
  const HERO_HEIGHT = 300;
  const stripeH = HERO_HEIGHT / STRIPE_COUNT;

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }}>

        {/* ── Hero block ── */}
        {found ? (
          <View testID="hero-found" style={{ height: HERO_HEIGHT, overflow: 'hidden' }}>
            {/* Striped placeholder (replaces when reference_photo available) */}
            {sight.reference_photo ? (
              <Image
                source={{ uri: sight.reference_photo }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.colors.phBase }}>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 0, right: 0,
                      top: i * stripeH,
                      height: stripeH,
                      backgroundColor: i % 2 === 0 ? t.colors.phBase : t.colors.phStripe,
                    }}
                  />
                ))}
              </View>
            )}

            {/* Bottom gradient scrim */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: t.colors.bg, opacity: 0.6 }} />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, backgroundColor: t.colors.bg, opacity: 0.7 }} />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 24, backgroundColor: t.colors.bg, opacity: 0.85 }} />

            {/* Top controls row */}
            <View style={{ position: 'absolute', top: 52, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Glass style={{ borderRadius: t.radii.pill }}>
                <Pressable
                  testID="back-btn"
                  onPress={() => router.back()}
                  hitSlop={8}
                  style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="chevron-back" size={20} color={t.colors.text1} />
                </Pressable>
              </Glass>
              <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
                <Glass style={{ borderRadius: t.radii.pill }}>
                  <Pressable
                    testID="fav-toggle"
                    onPress={handleFavToggle}
                    hitSlop={8}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? t.colors.amber : t.colors.text1} />
                  </Pressable>
                </Glass>
                <Glass style={{ borderRadius: t.radii.pill }}>
                  <Pressable
                    testID="share-btn"
                    onPress={handleShare}
                    hitSlop={8}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name="share-outline" size={18} color={t.colors.text1} />
                  </Pressable>
                </Glass>
              </View>
            </View>

            {/* Bottom badge chips */}
            <View style={{ position: 'absolute', bottom: 14, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
                <Glass style={{ borderRadius: t.radii.pill, paddingHorizontal: t.spacing.s3, paddingVertical: t.spacing.s1 }}>
                  <Text style={[t.type.dexNo, { color: t.colors.text1 }]}>{dexLabel}</Text>
                </Glass>
                <View style={{
                  backgroundColor: t.colors.greenDim,
                  borderRadius: t.radii.pill,
                  borderWidth: 1,
                  borderColor: t.colors.greenLine,
                  paddingHorizontal: t.spacing.s3,
                  paddingVertical: t.spacing.s1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: t.spacing.s1,
                }}>
                  <Text style={[t.type.dexNo, { color: t.colors.green }]}>✓ FOUND</Text>
                </View>
              </View>
              <Text style={[t.type.monoSm, { color: t.colors.text3, textTransform: 'uppercase', letterSpacing: 0.8 }]}>REFERENCE</Text>
            </View>
          </View>
        ) : (
          <View testID="hero-unfound" style={{ height: HERO_HEIGHT, overflow: 'hidden' }}>
            {/* Striped placeholder */}
            {sight.reference_photo ? (
              <>
                <Image
                  source={{ uri: sight.reference_photo }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  resizeMode="cover"
                />
                {/* surfaceScrim veil for unfound/desaturated treatment */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.colors.surfaceScrim }} />
              </>
            ) : (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.colors.phBase, opacity: 0.6 }}>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 0, right: 0,
                      top: i * stripeH,
                      height: stripeH,
                      backgroundColor: i % 2 === 0 ? t.colors.phBase : t.colors.phStripe,
                    }}
                  />
                ))}
              </View>
            )}

            {/* Dim veil for unfound (placeholder case) */}
            {!sight.reference_photo && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: t.colors.surfaceScrim, opacity: 0.5 }} />
            )}

            {/* Bottom gradient scrim */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: t.colors.bg, opacity: 0.6 }} />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, backgroundColor: t.colors.bg, opacity: 0.7 }} />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 24, backgroundColor: t.colors.bg, opacity: 0.85 }} />

            {/* Top controls row */}
            <View style={{ position: 'absolute', top: 52, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Glass style={{ borderRadius: t.radii.pill }}>
                <Pressable
                  testID="back-btn"
                  onPress={() => router.back()}
                  hitSlop={8}
                  style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="chevron-back" size={20} color={t.colors.text1} />
                </Pressable>
              </Glass>
              <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
                <Glass style={{ borderRadius: t.radii.pill }}>
                  <Pressable
                    testID="fav-toggle"
                    onPress={handleFavToggle}
                    hitSlop={8}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? t.colors.amber : t.colors.text1} />
                  </Pressable>
                </Glass>
                <Glass style={{ borderRadius: t.radii.pill }}>
                  <Pressable
                    testID="share-btn"
                    onPress={handleShare}
                    hitSlop={8}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name="share-outline" size={18} color={t.colors.text1} />
                  </Pressable>
                </Glass>
              </View>
            </View>

            {/* Bottom badge chips */}
            <View style={{ position: 'absolute', bottom: 14, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Glass style={{ borderRadius: t.radii.pill, paddingHorizontal: t.spacing.s3, paddingVertical: t.spacing.s1 }}>
                <Text style={[t.type.dexNo, { color: t.colors.text3 }]}>{dexLabel}</Text>
              </Glass>
              <Text style={[t.type.monoSm, { color: t.colors.text3, textTransform: 'uppercase', letterSpacing: 0.8 }]}>REFERENCE</Text>
            </View>
          </View>
        )}

        <View style={{ padding: t.spacing.s5, gap: t.spacing.s4 }}>

          {/* Title */}
          <View>
            <Text style={[t.type.h1, { color: t.colors.text1 }]}>{sight.name}</Text>
            {/* Location line */}
            {locationLabel && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s1, marginTop: t.spacing.s2 }}>
                <Ionicons name="location-outline" size={14} color={t.colors.text3} />
                <Text testID="location-line" style={[t.type.body, { color: t.colors.text3, fontSize: 14 }]}>{locationLabel}</Text>
              </View>
            )}
          </View>

          {/* Type chips — blue */}
          {sight.type_tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s2 }}>
              {sight.type_tags.map(tag => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: t.colors.blueDim,
                    borderWidth: 1,
                    borderColor: t.colors.blueLine,
                    borderRadius: t.radii.pill,
                    paddingHorizontal: t.spacing.s3,
                    paddingVertical: t.spacing.s1,
                  }}
                >
                  <Text style={[t.type.caption, { color: t.colors.blue }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stat tiles */}
          <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
            {([
              { label: 'ACCESS',   value: sight.access,   icon: 'walk-outline' },
              { label: 'SIZE',     value: sight.size,     icon: 'resize-outline' },
              { label: 'BUSYNESS', value: sight.busyness, icon: 'people-outline' },
            ] as { label: string; value: string | null; icon: string }[]).map(({ label, value, icon }) => (
              <View
                key={label}
                style={{
                  flex: 1,
                  minHeight: 88,
                  backgroundColor: t.colors.surface2,
                  borderRadius: t.radii.sm,
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                  padding: t.spacing.s3,
                  alignItems: 'center',
                  gap: t.spacing.s1,
                }}
              >
                <Ionicons name={icon as any} size={16} color={t.colors.text3} />
                <Text
                  style={[t.type.stat, { color: t.colors.text1 }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {value ?? '—'}
                </Text>
                <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
            <Pressable
              onPress={() => router.push(`/sight/${sight.id}/navigate`)}
              style={[{
                flex: 1,
                backgroundColor: t.colors.actionPositive,
                paddingVertical: t.spacing.s4,
                borderRadius: t.radii.pill,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: t.spacing.s2,
              }, t.shadow.glowFound]}
            >
              <Ionicons name="navigate-outline" size={16} color={t.colors.textOnAccent} />
              <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Navigate</Text>
            </Pressable>
            {!found && (
              <Pressable
                onPress={() => setLogOpen(o => !o)}
                style={[{
                  flex: 1,
                  backgroundColor: t.colors.actionPrimary,
                  paddingVertical: t.spacing.s4,
                  borderRadius: t.radii.pill,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: t.spacing.s2,
                }, t.shadow.glowProgress]}
              >
                <Ionicons name="add" size={16} color={t.colors.textOnAccent} />
                <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Log find</Text>
              </Pressable>
            )}
          </View>

          {/* Log find sheet */}
          {!found && logOpen && (
            <LogFindSheet sightId={sight.id} onLogged={reload} />
          )}

          {/* Find hint — expanded by default */}
          {sight.hint && (
            <Pressable
              testID="hint-toggle"
              onPress={() => setHintOpen(o => !o)}
              style={{
                backgroundColor: t.colors.amberDim,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: t.colors.amberLine,
                padding: t.spacing.s4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
                <Ionicons name="bulb-outline" size={16} color={t.colors.amber} />
                <Text style={[t.type.label, { color: t.colors.amber, flex: 1 }]}>FIND HINT</Text>
                <Ionicons name={hintOpen ? 'chevron-up' : 'chevron-down'} size={16} color={t.colors.amber} />
              </View>
              {hintOpen && (
                <Text style={[t.type.body, { color: t.colors.text2, marginTop: t.spacing.s3 }]}>
                  {sight.hint}
                </Text>
              )}
            </Pressable>
          )}

          {/* About */}
          {sight.about && (
            <View>
              <Text style={[t.type.h2, { color: t.colors.text1, marginBottom: t.spacing.s3 }]}>About</Text>
              <Text style={[t.type.body, { color: t.colors.text2 }]}>{sight.about}</Text>
            </View>
          )}

          {/* Your photos section */}
          <View>
            <Text style={[t.type.h2, { color: t.colors.text1, marginBottom: t.spacing.s3 }]}>Your photos</Text>
            {found ? (
              <YourPhotos sightId={sight.id} />
            ) : (
              <Text
                testID="photos-nudge"
                style={[t.type.body, { color: t.colors.text3 }]}
              >
                Log this find to start your photo collection.
              </Text>
            )}
          </View>

          {/* Recent finds section */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, marginBottom: t.spacing.s3 }}>
              <Text style={[t.type.h2, { color: t.colors.text1 }]}>Recent finds</Text>
              {thisWeekCount > 0 && (
                <Text testID="this-week-count" style={[t.type.monoSm, { color: t.colors.green }]}>
                  +{thisWeekCount} this week
                </Text>
              )}
            </View>
            {recentFinds.length === 0 ? (
              <Text style={[t.type.body, { color: t.colors.text3 }]}>No finds yet — be the first.</Text>
            ) : (
              recentFinds.slice(0, 3).map(f => {
                const displayName = f.username ?? 'Traveler';
                const initial = displayName[0].toUpperCase();
                return (
                  <View key={f.id} testID="recent-find-row" style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s4, paddingVertical: t.spacing.s3 }}>
                    <View style={{
                      width: 34, height: 34, borderRadius: 17,
                      backgroundColor: t.colors.surface3,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={[t.type.caption, { color: t.colors.text2, fontFamily: t.fontFamily.sansSemibold }]}>{initial}</Text>
                    </View>
                    <Text style={[t.type.body, { color: t.colors.text2, flex: 1 }]}>
                      <Text style={{ color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }}>{displayName}</Text>
                      {' '}found this
                    </Text>
                    <Text style={[t.type.monoSm, { color: t.colors.text3, textTransform: 'uppercase' }]}>
                      {relativeTime(f.found_at)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

        </View>
      </ScrollView>
    </Screen>
  );
}
