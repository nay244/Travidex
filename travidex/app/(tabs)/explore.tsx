import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCountryProgress, getCityProgress, Progress } from '../../lib/data/progress';
import { CountryPicker } from '../../components/CountryPicker';
import { ChunkTile } from '../../components/ChunkTile';
import { CompletionBar } from '../../components/CompletionBar';
import { Flag } from '../../components/Flag';
import { Screen } from '../../components/Screen';
import { progressState } from '../../lib/claim';
import type { City, Country } from '../../lib/types';

// ── Header ring: ~44px circle with 3px greenLine border + country flag inside ──
function HeaderRing({
  found,
  total,
  children,
  size = 44,
}: {
  found: number;
  total: number;
  children?: React.ReactNode;
  size?: number;
}) {
  const t = useTheme();
  const pct = total > 0 ? Math.min(100, Math.round((found / total) * 100)) : 0;
  const ringColor =
    pct >= 100 ? t.colors.green : pct > 0 ? t.colors.amber : t.colors.locked;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: ringColor,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors.surface2,
        flexShrink: 0,
      }}
    >
      {children}
    </View>
  );
}

// ── Legend dot ──
function LegendDot({ color, label }: { color: string; label: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 3,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <Text
        style={[
          t.type.label,
          {
            color: t.colors.text3,
            fontSize: 9,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

// ── List row (list-view mode) ──
function ListRow({
  id,
  name,
  region,
  found,
  total,
  onPress,
}: {
  id: string;
  name: string;
  region?: string;
  found: number;
  total: number;
  onPress: () => void;
}) {
  const t = useTheme();
  const state = progressState(found, total);
  return (
    <Pressable
      testID={`list-row-${id}`}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: t.spacing.s4,
        paddingVertical: t.spacing.s3,
        borderBottomWidth: 1,
        borderBottomColor: t.colors.divider,
        gap: t.spacing.s3,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        {region ? (
          <Text
            style={[
              t.type.label,
              {
                color: t.colors.text3,
                fontSize: 9,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                marginBottom: 2,
              },
            ]}
            numberOfLines={1}
          >
            {region}
          </Text>
        ) : null}
        <Text
          style={[t.type.body, { color: t.colors.text1, fontWeight: '600' }]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      <Text
        style={[
          t.type.label,
          { color: t.colors.text3, fontSize: 11, fontWeight: '700', letterSpacing: 0 },
        ]}
      >
        {`${found}`}
        <Text style={{ color: t.colors.text3, fontWeight: '400' }}>{`/${total}`}</Text>
      </Text>
      {/* State marker */}
      {state === 'claimed' ? (
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: t.colors.chunkClaimed,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: t.colors.textOnAccent, fontSize: 9, lineHeight: 11 }}>✓</Text>
        </View>
      ) : (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: state === 'in-progress' ? t.colors.chunkProgress : 'transparent',
            borderWidth: 2,
            borderColor:
              state === 'in-progress' ? t.colors.chunkProgress : t.colors.chunkUntouched,
          }}
        />
      )}
    </Pressable>
  );
}

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // ── Derived header stats ──
  function getHeaderStats(): {
    ringFound: number;
    ringTotal: number;
    claimedLabel: string;
    totalSightsFound: number;
    totalSightsTotal: number;
    hint: string;
  } {
    if (!selectedCountry) {
      return { ringFound: 0, ringTotal: 0, claimedLabel: '0 of 0', totalSightsFound: 0, totalSightsTotal: 0, hint: '' };
    }

    if (selectedCountry.tier === 'cities') {
      const claimedCount = cities.filter(c => {
        const p = cityProg.get(c.id) ?? { found: 0, total: 0 };
        return p.total > 0 && p.found >= p.total;
      }).length;
      const totalFound = cities.reduce((a, c) => a + (cityProg.get(c.id)?.found ?? 0), 0);
      const totalSights = cities.reduce((a, c) => a + (cityProg.get(c.id)?.total ?? 0), 0);
      return {
        ringFound: claimedCount,
        ringTotal: cities.length,
        claimedLabel: `${claimedCount} of ${cities.length}`,
        totalSightsFound: totalFound,
        totalSightsTotal: totalSights,
        hint: 'Find every sight in a city to claim it.',
      };
    }

    // states tier — stateFilter open: show state stats
    if (stateFilter !== null) {
      const stateCities = cities.filter(c => (c.region ?? 'Other') === stateFilter);
      const claimedCount = stateCities.filter(c => {
        const p = cityProg.get(c.id) ?? { found: 0, total: 0 };
        return p.total > 0 && p.found >= p.total;
      }).length;
      const totalFound = stateCities.reduce((a, c) => a + (cityProg.get(c.id)?.found ?? 0), 0);
      const totalSights = stateCities.reduce((a, c) => a + (cityProg.get(c.id)?.total ?? 0), 0);
      return {
        ringFound: claimedCount,
        ringTotal: stateCities.length,
        claimedLabel: `${claimedCount} of ${stateCities.length}`,
        totalSightsFound: totalFound,
        totalSightsTotal: totalSights,
        hint: 'Claim every city to complete the state.',
      };
    }

    // states level — build state aggregates
    const stateMap = new Map<string, { found: number; total: number }>();
    for (const city of cities) {
      const region = city.region ?? 'Other';
      const existing = stateMap.get(region) ?? { found: 0, total: 0 };
      const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
      stateMap.set(region, {
        found: existing.found + p.found,
        total: existing.total + p.total,
      });
    }
    const stateEntries = Array.from(stateMap.values());
    const claimedStates = stateEntries.filter(s => s.total > 0 && s.found >= s.total).length;
    const totalFound = stateEntries.reduce((a, s) => a + s.found, 0);
    const totalSights = stateEntries.reduce((a, s) => a + s.total, 0);
    return {
      ringFound: claimedStates,
      ringTotal: stateMap.size,
      claimedLabel: `${claimedStates} of ${stateMap.size}`,
      totalSightsFound: totalFound,
      totalSightsTotal: totalSights,
      hint: 'Tap a state to explore its cities.',
    };
  }

  const headerStats = getHeaderStats();

  // ── Board rendering ──
  const renderBoard = () => {
    if (!selectedCountry) return null;

    if (selectedCountry.tier === 'cities') {
      if (viewMode === 'list') {
        return (
          <View>
            {cities.map(city => {
              const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
              return (
                <ListRow
                  key={city.id}
                  id={city.id}
                  name={city.name}
                  region={city.region ?? undefined}
                  found={p.found}
                  total={p.total}
                  onPress={() => router.push(`/city/${city.id}`)}
                />
              );
            })}
          </View>
        );
      }
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3, gap: t.spacing.s3 }}>
          {cities.map(city => {
            const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
            return (
              <View key={city.id} style={{ width: '30%' }}>
                <ChunkTile
                  testID={`chunk-tile-${city.id}`}
                  name={city.name}
                  found={p.found}
                  total={p.total}
                  region={city.region ?? undefined}
                  onPress={() => router.push(`/city/${city.id}`)}
                />
              </View>
            );
          })}
        </View>
      );
    }

    // tier === 'states'
    if (stateFilter !== null) {
      const stateCities = cities.filter(c => (c.region ?? 'Other') === stateFilter);
      const cityList =
        viewMode === 'list' ? (
          <View>
            {stateCities.map(city => {
              const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
              return (
                <ListRow
                  key={city.id}
                  id={city.id}
                  name={city.name}
                  region={city.region ?? undefined}
                  found={p.found}
                  total={p.total}
                  onPress={() => router.push(`/city/${city.id}`)}
                />
              );
            })}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: t.spacing.s3,
              gap: t.spacing.s3,
            }}
          >
            {stateCities.map(city => {
              const p = cityProg.get(city.id) ?? { found: 0, total: 0 };
              return (
                <View key={city.id} style={{ width: '30%' }}>
                  <ChunkTile
                    testID={`chunk-tile-${city.id}`}
                    name={city.name}
                    found={p.found}
                    total={p.total}
                    region={city.region ?? undefined}
                    onPress={() => router.push(`/city/${city.id}`)}
                  />
                </View>
              );
            })}
          </View>
        );

      return (
        <View>
          <Pressable
            testID="breadcrumb"
            onPress={() => setStateFilter(null)}
            style={{
              marginHorizontal: t.spacing.s4,
              marginBottom: t.spacing.s3,
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s1,
              paddingHorizontal: t.spacing.s3,
              paddingVertical: 6,
              borderRadius: t.radii.pill,
              backgroundColor: t.colors.surface2,
              borderWidth: 1,
              borderColor: t.colors.borderDefault,
            }}
          >
            <Text
              style={[
                t.type.label,
                {
                  color: t.colors.text2,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {`‹ ${selectedCountry.name} · all states`}
            </Text>
          </Pressable>
          {cityList}
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

    if (viewMode === 'list') {
      return (
        <View>
          {Array.from(stateMap.entries()).map(([region, agg]) => (
            <ListRow
              key={region}
              id={region}
              name={region}
              found={agg.found}
              total={agg.total}
              onPress={() => setStateFilter(region)}
            />
          ))}
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: t.spacing.s3,
          gap: t.spacing.s3,
        }}
      >
        {Array.from(stateMap.entries()).map(([region, agg]) => (
          <View key={region} style={{ width: '30%' }}>
            <ChunkTile
              testID={`chunk-tile-${region}`}
              name={region}
              found={agg.found}
              total={agg.total}
              onPress={() => setStateFilter(region)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <Screen>
      {/* ── Top control bar: country pill + list/grid toggle ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: t.spacing.s4,
          paddingVertical: t.spacing.s3,
          backgroundColor: t.colors.surface1,
          borderBottomWidth: 1,
          borderBottomColor: t.colors.divider,
          gap: t.spacing.s3,
        }}
      >
        {/* Country pill */}
        <Pressable
          testID="country-pill"
          onPress={() => setPickerOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 36,
            gap: t.spacing.s2,
            paddingHorizontal: t.spacing.s3,
            borderRadius: t.radii.pill,
            backgroundColor: t.colors.surface2,
            borderWidth: 1,
            borderColor: t.colors.borderDefault,
          }}
        >
          {selectedCountry ? (
            <Flag code={selectedCountry.code} size={22} radius={5} />
          ) : null}
          <Text
            style={[t.type.label, { color: t.colors.text1, fontWeight: '700', fontSize: 13, lineHeight: 17, letterSpacing: 0.3 }]}
            numberOfLines={1}
          >
            {selectedCountry?.code ?? '—'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={t.colors.text3} />
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* Right: list/grid toggle chip */}
        <Pressable
          testID="view-toggle"
          onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
          style={{
            width: 36,
            height: 36,
            borderRadius: t.radii.md,
            backgroundColor: t.colors.surface2,
            borderWidth: 1,
            borderColor: t.colors.borderDefault,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
            size={18}
            color={t.colors.text1}
          />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: t.spacing.s8 }}>
        {/* ── Country / state header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: t.spacing.s4,
            paddingTop: t.spacing.s4,
            paddingBottom: t.spacing.s2,
            gap: t.spacing.s3,
          }}
        >
          {/* Ring with flag inside (country level) or just flag (state drilldown) */}
          {selectedCountry && stateFilter === null ? (
            <HeaderRing
              found={headerStats.ringFound}
              total={headerStats.ringTotal}
              size={44}
            >
              <Flag code={selectedCountry.code} size={28} radius={5} />
            </HeaderRing>
          ) : selectedCountry && stateFilter !== null ? (
            <Flag code={selectedCountry.code} size={36} radius={6} />
          ) : null}

          <View style={{ flex: 1 }}>
            <Text style={[t.type.h2 ?? t.type.h3, { color: t.colors.text1 }]}>
              {stateFilter ?? selectedCountry?.name ?? ''}
            </Text>
            {selectedCountry && (
              <Text
                style={[
                  t.type.label,
                  {
                    color: t.colors.text3,
                    fontSize: 11,
                    letterSpacing: 0.3,
                    marginTop: 2,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                <Text style={{ color: t.colors.green, fontWeight: '700' }}>
                  {headerStats.claimedLabel}
                </Text>
                {selectedCountry.tier === 'cities' || stateFilter !== null
                  ? ' cities claimed · '
                  : ' states complete · '}
                {`${headerStats.totalSightsFound}/${headerStats.totalSightsTotal} sights`}
              </Text>
            )}
          </View>
        </View>

        {/* ── 1.2: Full-width CompletionBar between header and legend ── */}
        {selectedCountry && (
          <View style={{ paddingHorizontal: t.spacing.s4, paddingBottom: t.spacing.s2 }}>
            <CompletionBar
              found={headerStats.totalSightsFound}
              total={headerStats.totalSightsTotal}
            />
          </View>
        )}

        {/* ── Legend ── */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: t.spacing.s3,
            paddingHorizontal: t.spacing.s4,
            paddingVertical: t.spacing.s3,
          }}
        >
          <LegendDot
            color={t.colors.chunkClaimed}
            label={selectedCountry?.tier === 'states' && stateFilter === null ? 'Complete' : 'Claimed'}
          />
          <LegendDot color={t.colors.chunkProgress} label="In progress" />
          <LegendDot color={t.colors.chunkUntouched} label="Untouched" />
        </View>

        {/* ── Board ── */}
        {renderBoard()}

        {/* ── Hint caption ── */}
        {selectedCountry && (
          <Text
            style={[
              t.type.body,
              {
                color: t.colors.text3,
                textAlign: 'center',
                marginTop: t.spacing.s5,
                paddingHorizontal: t.spacing.s5,
                lineHeight: 20,
              },
            ]}
          >
            {headerStats.hint}
          </Text>
        )}
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
    </Screen>
  );
}
