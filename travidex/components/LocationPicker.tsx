import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
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
  const { session } = useAuth();
  const [view, setView] = useState<'cities' | 'countries'>('cities');
  const [browseId, setBrowseId] = useState<string | null>(initialCountryId);
  const [q, setQ] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cityProg, setCityProg] = useState<Map<string, Progress>>(new Map());
  const [countryProg, setCountryProg] = useState<Map<string, Progress>>(new Map());

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
        <Pressable onPress={() => {}} style={{ maxHeight: '86%', backgroundColor: t.colors.surface1, borderTopLeftRadius: t.radii.lg, borderTopRightRadius: t.radii.lg, padding: t.spacing.s4, gap: t.spacing.s3 }}>
          <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: t.colors.borderStrong, alignSelf: 'center' }} />

          {view === 'countries' ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
                <Pressable onPress={() => setView('cities')} hitSlop={8}>
                  <Text style={[t.type.h3, { color: t.colors.text1 }]}>{'‹'}</Text>
                </Pressable>
                <Text style={[t.type.h3, { color: t.colors.text1 }]}>Choose a country</Text>
              </View>
              <FlatList
                data={countries}
                keyExtractor={c => c.id}
                renderItem={({ item }) => {
                  const p = countryProg.get(item.id) ?? { found: 0, total: 0 };
                  const active = item.id === browseId;
                  return (
                    <Pressable
                      onPress={() => { setBrowseId(item.id); setQ(''); setView('cities'); }}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3, padding: t.spacing.s3, borderRadius: t.radii.sm, backgroundColor: active ? t.colors.surface3 : t.colors.surface2, borderWidth: 1, borderColor: active ? t.colors.greenLine : t.colors.borderSubtle, marginBottom: t.spacing.s2 }}
                    >
                      <Flag code={item.code} size={34} radius={6} />
                      <View style={{ flex: 1 }}>
                        <Text style={[t.type.body, { color: t.colors.text1 }]}>{item.name}</Text>
                        <Text style={[t.type.caption, { color: t.colors.text3 }]}>{`${p.found}/${p.total} sights`}</Text>
                      </View>
                      <Text style={{ color: t.colors.text3 }}>{'›'}</Text>
                    </Pressable>
                  );
                }}
              />
            </>
          ) : (
            <>
              <Pressable
                onPress={() => setView('countries')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3, padding: t.spacing.s3, borderRadius: t.radii.sm, backgroundColor: t.colors.surface2, borderWidth: 1, borderColor: t.colors.borderSubtle }}
              >
                <Flag code={country?.code ?? ''} size={32} radius={6} />
                <View style={{ flex: 1 }}>
                  <Text style={[t.type.label, { color: t.colors.text3 }]}>Country</Text>
                  <Text style={[t.type.h3, { color: t.colors.text1 }]}>{country?.name ?? ''}</Text>
                </View>
                <Text style={[t.type.body, { color: t.colors.text1 }]}>Change</Text>
              </Pressable>

              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder={`Search cities in ${country?.name ?? ''}`}
                placeholderTextColor={t.colors.text3}
                style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s3, borderRadius: t.radii.sm }]}
              />

              <Text style={[t.type.label, { color: t.colors.text3 }]}>{`Cities in ${country?.name ?? ''}`}</Text>
              <FlatList
                data={visibleCities}
                keyExtractor={c => c.id}
                renderItem={({ item }) => {
                  const p = cityProg.get(item.id) ?? { found: 0, total: 0 };
                  const claimed = p.total > 0 && p.found >= p.total;
                  const current = item.id === currentCityId;
                  return (
                    <Pressable
                      onPress={() => onPick(item.id)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3, padding: t.spacing.s3, borderRadius: t.radii.sm, backgroundColor: current ? t.colors.surface3 : 'transparent', borderWidth: current ? 1 : 0, borderColor: t.colors.greenLine }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[t.type.body, { color: t.colors.text1 }]}>{item.name}</Text>
                        {item.region ? <Text style={[t.type.caption, { color: t.colors.text3 }]}>{item.region}</Text> : null}
                      </View>
                      <Text style={[t.type.stat, { color: claimed ? t.colors.green : t.colors.text3 }]}>{`${p.found}/${p.total}`}</Text>
                      <Text style={{ color: current ? t.colors.green : t.colors.text3 }}>{current ? '✓' : '›'}</Text>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={<Text style={[t.type.body, { color: t.colors.text3, textAlign: 'center', padding: t.spacing.s5 }]}>{`No cities match "${q}".`}</Text>}
              />
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
