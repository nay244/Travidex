import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCountryProgress, getCityProgress, Progress } from '../../lib/data/progress';
import { CountryPicker } from '../../components/CountryPicker';
import { ChunkTile } from '../../components/ChunkTile';
import { Flag } from '../../components/Flag';
import type { City, Country } from '../../lib/types';

export default function Explore() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryProg, setCountryProg] = useState<Map<string, Progress>>(new Map());
  const [cityProg, setCityProg] = useState<Map<string, Progress>>(new Map());
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Load countries + both progress maps on mount / user change
  useEffect(() => {
    const uid = session?.user?.id;
    Promise.all([
      getCountries(),
      uid ? getCountryProgress(uid) : Promise.resolve(new Map<string, Progress>()),
      uid ? getCityProgress(uid) : Promise.resolve(new Map<string, Progress>()),
    ])
      .then(([list, coProg, ciProg]) => {
        setCountries(list);
        setCountryProg(coProg);
        setCityProg(ciProg);
        if (list.length > 0 && !selectedCountryId) {
          setSelectedCountryId(list[0].id);
        }
      })
      .catch(err => console.warn('Explore load failed', err));
  }, [session?.user?.id]);

  // Load cities when selected country changes
  useEffect(() => {
    if (!selectedCountryId) return;
    setStateFilter(null);
    getCitiesForCountry(selectedCountryId)
      .then(setCities)
      .catch(err => console.warn('Explore cities failed', err));
  }, [selectedCountryId]);

  const selectedCountry = countries.find(c => c.id === selectedCountryId) ?? null;

  // Build board content based on tier + stateFilter
  const renderBoard = () => {
    if (!selectedCountry) return null;

    if (selectedCountry.tier === 'cities') {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3 }}>
          {cities.map(city => {
            const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
            return (
              <ChunkTile
                key={city.id}
                name={city.name}
                found={p.found}
                total={p.total}
                onPress={() => router.push(`/city/${city.id}`)}
              />
            );
          })}
        </View>
      );
    }

    // tier === 'states'
    if (stateFilter !== null) {
      // Show cities for the filtered state + breadcrumb
      const stateCities = cities.filter(c => (c.region ?? 'Other') === stateFilter);
      return (
        <View>
          <Pressable
            testID="breadcrumb"
            onPress={() => setStateFilter(null)}
            style={{
              padding: t.spacing.s4,
              paddingBottom: t.spacing.s3,
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s2,
            }}
          >
            <Text style={[t.type.body, { color: t.colors.blue }]}>
              {`‹ ${selectedCountry.name} · all states`}
            </Text>
          </Pressable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3 }}>
            {stateCities.map(city => {
              const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
              return (
                <ChunkTile
                  key={city.id}
                  name={city.name}
                  found={p.found}
                  total={p.total}
                  onPress={() => router.push(`/city/${city.id}`)}
                />
              );
            })}
          </View>
        </View>
      );
    }

    // Show state-level aggregate tiles
    const stateMap = new Map<string, { found: number; total: number; cities: City[] }>();
    for (const city of cities) {
      const region = city.region ?? 'Other';
      const existing = stateMap.get(region) ?? { found: 0, total: 0, cities: [] };
      const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
      stateMap.set(region, {
        found: existing.found + p.found,
        total: existing.total + p.total,
        cities: [...existing.cities, city],
      });
    }

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3 }}>
        {Array.from(stateMap.entries()).map(([region, agg]) => (
          <ChunkTile
            key={region}
            name={region}
            found={agg.found}
            total={agg.total}
            onPress={() => setStateFilter(region)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: t.spacing.s4,
          gap: t.spacing.s3,
          backgroundColor: t.colors.surface1,
          borderBottomWidth: 1,
          borderBottomColor: t.colors.divider,
        }}
      >
        <Pressable
          testID="country-pill"
          onPress={() => setPickerOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.spacing.s2,
            paddingHorizontal: t.spacing.s3,
            paddingVertical: t.spacing.s2,
            borderRadius: t.radii.pill,
            backgroundColor: t.colors.surface2,
            borderWidth: 1,
            borderColor: t.colors.borderDefault,
          }}
        >
          {selectedCountry ? (
            <Flag code={selectedCountry.code} size={22} radius={5} />
          ) : null}
          <Text style={[t.type.stat, { color: t.colors.text1, fontSize: 14 }]}>
            {selectedCountry?.code ?? '—'}
          </Text>
          <Text style={{ color: t.colors.text2, fontSize: 12 }}>{'▾'}</Text>
        </Pressable>

        {selectedCountry && (
          <Text style={[t.type.caption, { color: t.colors.text2 }]}>
            {`${countryProg.get(selectedCountry.id)?.found ?? 0}/${countryProg.get(selectedCountry.id)?.total ?? 0} sights`}
          </Text>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {renderBoard()}
      </ScrollView>

      <CountryPicker
        visible={pickerOpen}
        countries={countries}
        progress={countryProg}
        currentId={selectedCountryId}
        onPick={id => {
          setSelectedCountryId(id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
