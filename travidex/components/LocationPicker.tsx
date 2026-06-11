import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, PanResponder, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useAuth } from '../context/AuthProvider';
import { getCountries } from '../lib/data/countries';
import { getCitiesForCountry } from '../lib/data/citiesByCountry';
import { getCityProgress, getCountryProgress, Progress } from '../lib/data/progress';
import { Flag } from './Flag';
import type { City, Country } from '../lib/types';

type Props = {
  visible: boolean;
  currentCityId: string;
  initialCountryId: string | null;
  onPick: (cityId: string) => void;
  onClose: () => void;
};

export function LocationPicker({ visible, currentCityId, initialCountryId, onPick, onClose }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [view, setView] = useState<'cities' | 'countries'>('cities');
  const [browseId, setBrowseId] = useState<string | null>(initialCountryId);
  const [q, setQ] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cityProg, setCityProg] = useState<Map<string, Progress>>(new Map());
  const [countryProg, setCountryProg] = useState<Map<string, Progress>>(new Map());

  // drag-down to dismiss — copy this pattern for new sheets
  const translateY = useRef(new Animated.Value(0)).current;
  const dragPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 4,
      onPanResponderGrant: () => {
        (translateY as any).setOffset((translateY as any)._value);
        (translateY as any).setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        // clamp: only allow dragging downward
        translateY.setValue(Math.max(0, gs.dy));
      },
      onPanResponderRelease: (_, gs) => {
        (translateY as any).flattenOffset();
        if (gs.dy > 120 || gs.vy > 0.8) {
          // Dismiss: animate off-screen then call onClose
          Animated.timing(translateY, { toValue: 600, duration: 220, useNativeDriver: true }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          // Snap back
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
      onPanResponderTerminate: () => {
        (translateY as any).flattenOffset();
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      },
    }),
  ).current;

  // Reset translateY when sheet opens
  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  // Re-sync to the active city's country each time the sheet opens
  useEffect(() => {
    if (!visible) return;
    setBrowseId(initialCountryId);
    setQ('');
    setView('cities');
  }, [visible]);

  useEffect(() => {
    if (!visible || !session?.user) return;
    const uid = session.user.id;
    Promise.all([getCountries(), getCityProgress(uid), getCountryProgress(uid)])
      .then(([cs, cp, kp]) => { setCountries(cs); setCityProg(cp); setCountryProg(kp); })
      .catch(err => console.warn('LocationPicker load failed', err));
  }, [visible, session?.user?.id]);

  useEffect(() => {
    if (!visible || !browseId) return;
    getCitiesForCountry(browseId)
      .then(setCities)
      .catch(err => console.warn('LocationPicker cities failed', err));
  }, [visible, browseId]);

  const country = countries.find(c => c.id === browseId) ?? null;
  const visibleCities = cities.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.region ?? '').toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: t.colors.surfaceScrim, justifyContent: 'flex-end' }}>
        {/* Height lives HERE: the wrapper's parent (the scrim) is flex:1, so the
            percentage resolves correctly and the sheet runs flush to the screen
            bottom (ref 03). The inner sheet just fills it. */}
        <Animated.View style={{ height: '85%', transform: [{ translateY }] }}>
        <Pressable
          onPress={() => {}}
          style={{
            flex: 1,
            backgroundColor: t.colors.surface1,
            borderTopLeftRadius: t.radii.xl,
            borderTopRightRadius: t.radii.xl,
            paddingTop: t.spacing.s3,
            paddingHorizontal: t.spacing.s5,
            gap: t.spacing.s3,
          }}
        >
          {/* Grabber — drag handle to dismiss */}
          <View {...dragPan.panHandlers} style={{ paddingBottom: t.spacing.s2 }}>
            <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: t.colors.borderStrong, alignSelf: 'center' }} />
          </View>

          {view === 'countries' ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
                <Pressable onPress={() => setView('cities')} hitSlop={8}>
                  <Ionicons name="chevron-back" size={22} color={t.colors.text1} />
                </Pressable>
                <Text style={[t.type.h3, { color: t.colors.text1, fontFamily: t.fontFamily.sansBold, fontSize: t.fontSize.h2 }]}>Choose a country</Text>
              </View>
              <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + t.spacing.s6 }}
                data={countries}
                keyExtractor={c => c.id}
                renderItem={({ item }) => {
                  const p = countryProg.get(item.id) ?? { found: 0, total: 0 };
                  const active = item.id === browseId;
                  return (
                    <Pressable
                      onPress={() => { setBrowseId(item.id); setQ(''); setView('cities'); }}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: t.spacing.s4,
                        paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s4,
                        borderRadius: t.radii.lg,
                        backgroundColor: active ? t.colors.surface3 : t.colors.surface2,
                        borderWidth: 1,
                        borderColor: active ? t.colors.greenLine : t.colors.borderSubtle,
                        marginBottom: t.spacing.s2,
                      }}
                    >
                      <Flag code={item.code} size={34} radius={6} />
                      <View style={{ flex: 1 }}>
                        <Text style={[t.type.body, { color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }]}>{item.name}</Text>
                        <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.micro, letterSpacing: 0.03 * t.fontSize.micro, textTransform: 'uppercase' as const }]}>{`${p.found}/${p.total} sights`}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={t.colors.text3} />
                    </Pressable>
                  );
                }}
              />
            </>
          ) : (
            <>
              {/* Current country card — tap to change */}
              <Pressable
                onPress={() => setView('countries')}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3,
                  paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s4,
                  borderRadius: t.radii.lg,
                  backgroundColor: t.colors.surface2,
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                }}
              >
                <Flag code={country?.code ?? ''} size={32} radius={6} />
                <View style={{ flex: 1 }}>
                  <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.micro, letterSpacing: 0.12 * t.fontSize.micro, textTransform: 'uppercase' as const }]}>Country</Text>
                  <Text style={[t.type.h3, { color: t.colors.text1, fontFamily: t.fontFamily.sansBold, fontSize: t.fontSize.h3, letterSpacing: -0.01 * t.fontSize.h3 }]}>{country?.name ?? ''}</Text>
                </View>
                {/* "Change ⇅" pill */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: t.spacing.s1,
                  height: 30, paddingHorizontal: t.spacing.s3,
                  borderRadius: 999,
                  backgroundColor: t.colors.surface3,
                  borderWidth: 1,
                  borderColor: t.colors.borderDefault,
                }}>
                  <Text style={[t.type.body, { color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold, fontSize: t.fontSize.caption }]}>Change</Text>
                  <Ionicons name="swap-vertical-outline" size={14} color={t.colors.text3} />
                </View>
              </Pressable>

              {/* City search field with icon */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2,
                height: 46, paddingHorizontal: t.spacing.s4,
                backgroundColor: t.colors.surface2,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: t.colors.borderSubtle,
              }}>
                <Ionicons name="search" size={16} color={t.colors.text3} />
                <TextInput
                  value={q}
                  onChangeText={setQ}
                  placeholder={`Search cities in ${country?.name ?? ''}`}
                  placeholderTextColor={t.colors.text3}
                  style={[t.type.body, { flex: 1, color: t.colors.text1, padding: 0 }]}
                />
              </View>

              {/* "CITIES IN {COUNTRY}" mono overline */}
              <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.micro, letterSpacing: 0.10 * t.fontSize.micro, textTransform: 'uppercase' as const, marginTop: t.spacing.s1 }]}>
                {`Cities in ${country?.name ?? ''}`}
              </Text>

              <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + t.spacing.s6 }}
                data={visibleCities}
                keyExtractor={c => c.id}
                renderItem={({ item }) => {
                  const p = cityProg.get(item.id) ?? { found: 0, total: 0 };
                  const claimed = p.total > 0 && p.found >= p.total;
                  const current = item.id === currentCityId;
                  return (
                    <Pressable
                      onPress={() => onPick(item.id)}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3,
                        paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s2,
                        borderRadius: t.radii.md,
                        backgroundColor: current ? t.colors.surface3 : 'transparent',
                        borderWidth: current ? 1 : 0,
                        borderColor: t.colors.greenLine,
                      }}
                    >
                      {/* Map-pin icon colored green when claimed */}
                      <Ionicons name="location-outline" size={16} color={claimed ? t.colors.green : t.colors.text3} />

                      <View style={{ flex: 1 }}>
                        <Text style={[t.type.body, { color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }]}>{item.name}</Text>
                        {item.region ? (
                          <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.micro, letterSpacing: 0.03 * t.fontSize.micro, textTransform: 'uppercase' as const }]}>{item.region}</Text>
                        ) : null}
                      </View>

                      {/* Mono found/total (green when claimed) */}
                      <Text style={{ fontFamily: t.fontFamily.monoBold, fontSize: t.fontSize.caption, color: claimed ? t.colors.green : t.colors.text3 }}>
                        <Text style={{ color: claimed ? t.colors.green : t.colors.text3 }}>{p.found}</Text>
                        <Text style={{ color: t.colors.text3 }}>/{p.total}</Text>
                      </Text>

                      {/* Current = green check disc; otherwise chevron */}
                      {current ? (
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: t.colors.green, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="checkmark" size={12} color={t.colors.textOnAccent} />
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={<Text style={[t.type.body, { color: t.colors.text3, textAlign: 'center', padding: t.spacing.s5 }]}>{`No cities match "${q}".`}</Text>}
              />
            </>
          )}
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
