// Screen twin of components/LocationPicker.tsx (modal) — keep semantics in sync.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useAuth } from '../context/AuthProvider';
import { useCity } from '../context/CityProvider';
import { useActiveCity } from '../hooks/useActiveCity';
import { getCountries } from '../lib/data/countries';
import { getCitiesForCountry } from '../lib/data/citiesByCountry';
import { getCityProgress, getCountryProgress, Progress } from '../lib/data/progress';
import { Flag } from '../components/Flag';
import { Glass } from '../components/Glass';
import type { City, Country } from '../lib/types';

export default function LocationScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const { cityId, setCityId } = useCity();
  const { city: activeCity } = useActiveCity(cityId);

  const [view, setView] = useState<'cities' | 'countries'>('cities');
  const [browseId, setBrowseId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cityProg, setCityProg] = useState<Map<string, Progress>>(new Map());
  const [countryProg, setCountryProg] = useState<Map<string, Progress>>(new Map());

  // Initialise browseId from the active city's country once it loads
  useEffect(() => {
    if (activeCity && browseId === null) {
      setBrowseId(activeCity.country_id);
    }
  }, [activeCity]);

  // Load countries + progress on mount
  useEffect(() => {
    if (!session?.user) return;
    const uid = session.user.id;
    Promise.all([getCountries(), getCityProgress(uid), getCountryProgress(uid)])
      .then(([cs, cp, kp]) => { setCountries(cs); setCityProg(cp); setCountryProg(kp); })
      .catch(err => console.warn('LocationScreen load failed', err));
  }, [session?.user?.id]);

  // Load cities whenever browseId changes
  useEffect(() => {
    if (!browseId) return;
    getCitiesForCountry(browseId)
      .then(setCities)
      .catch(err => console.warn('LocationScreen cities failed', err));
  }, [browseId]);

  const country = countries.find(c => c.id === browseId) ?? null;
  const visibleCities = cities.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.region ?? '').toLowerCase().includes(q.toLowerCase()),
  );

  const handlePickCity = (id: string) => {
    setCityId(id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.surface1, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2,
        paddingHorizontal: t.spacing.s5, paddingVertical: t.spacing.s4,
      }}>
        <Pressable testID="back-btn" onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
        </Pressable>
        <Text style={[t.type.h2, { color: t.colors.text1, fontFamily: t.fontFamily.sansBold, flex: 1 }]}>
          Change location
        </Text>
      </View>

      {view === 'countries' ? (
        <View style={{ flex: 1, paddingHorizontal: t.spacing.s5, gap: t.spacing.s3 }}>
          {/* Back to cities + title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
            <Pressable onPress={() => setView('cities')} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color={t.colors.text1} />
            </Pressable>
            <Text style={[t.type.h3, { color: t.colors.text1, fontFamily: t.fontFamily.sansBold, fontSize: t.fontSize.h2 }]}>
              Choose a country
            </Text>
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
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: t.spacing.s5, gap: t.spacing.s3 }}>
          {/* Current country card — tap to change */}
          <Pressable onPress={() => setView('countries')} style={{ borderRadius: t.radii.lg }}>
            <Glass style={{
              flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3,
              paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s4,
              borderRadius: t.radii.lg,
            }}>
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
            </Glass>
          </Pressable>

          {/* City search field */}
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
              const current = item.id === cityId;
              return (
                <Pressable
                  onPress={() => handlePickCity(item.id)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3,
                    paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s2,
                    borderRadius: t.radii.md,
                    backgroundColor: current ? t.colors.surface3 : 'transparent',
                    borderWidth: current ? 1 : 0,
                    borderColor: t.colors.greenLine,
                  }}
                >
                  <Ionicons name="location-outline" size={16} color={claimed ? t.colors.green : t.colors.text3} />
                  <View style={{ flex: 1 }}>
                    <Text style={[t.type.body, { color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }]}>{item.name}</Text>
                    {item.region ? (
                      <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.micro, letterSpacing: 0.03 * t.fontSize.micro, textTransform: 'uppercase' as const }]}>{item.region}</Text>
                    ) : null}
                  </View>

                  {/* Mono found/total */}
                  <Text style={{ fontFamily: t.fontFamily.monoBold, fontSize: t.fontSize.caption, color: claimed ? t.colors.green : (p.found > 0 ? t.colors.amber : t.colors.text3) }}>
                    <Text style={{ color: claimed ? t.colors.green : (p.found > 0 ? t.colors.amber : t.colors.text3) }}>{p.found}</Text>
                    <Text style={{ color: t.colors.text3 }}>/{p.total}</Text>
                  </Text>

                  {/* Claimed = green check disc; otherwise chevron */}
                  {claimed ? (
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
        </View>
      )}
    </View>
  );
}
