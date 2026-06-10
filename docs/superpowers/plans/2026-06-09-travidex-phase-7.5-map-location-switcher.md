# Travidex Phase 7.5 — Map Location Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the updated Map design (design/Travidex prototype, June 9): a location pill (country flag + city name + chevron) on the Map that opens a LocationPicker bottom sheet (cities view with country-scoped search + countries view), so the user can re-target the Map to any city without leaving the tab.

**Architecture:** The prototype's `sightsByCity` cache, `mapSights` synthesis, and `findCity` lookup all dissolve in the real app — Supabase is the single source of truth (`useCityCatalog(cityId)` already swaps sights per city; finds persist server-side; `city_progress`/`country_progress` RPCs give found/total). The new work is UI only: a `Flag` asset component (port of the prototype's CSS-flag DSL), a `LocationPicker` modal sheet that composes the four existing data wrappers, a tiny `useActiveCity` hook (city name + country code for the pill, lat/lng for map recenter), and `map.tsx` integration. Picking a city = `setCityId(id)` on the existing `CityProvider` — everything downstream already reacts.

**Tech Stack:** TypeScript, React Native `Modal`, existing Supabase data wrappers, Jest/RNTL.

---

## Theming (REQUIRED)

All color/type/spacing comes from the RN theme via `useTheme()` — **never hardcode hex** — with ONE documented exemption: the `FLAGS` spec map in `components/Flag.tsx` contains real-world flag colors (e.g. Japan's `#BC002D`). Those are intrinsic asset data, not UI theme colors, exactly like the prototype's `flags.jsx`. Reviewers must not flag hex inside the `FLAGS` constant; everywhere else the rule holds.

## Adaptation decisions (vs. prototype)

1. **No `sightsByCity`/`mapSights`/`findCity` ports** — backend already provides per-city data + persistence.
2. **Icons are text glyphs** (`▾ ‹ › ✓`) — the RN app has no icon library and existing screens use plain text affordances; do not add a dependency.
3. **Countries view rows show `found/total sights`** (from `country_progress`) but NOT the prototype's `claimed/units cities` count — computing claimed-city counts per country would require loading every country's city list. Deferred (YAGNI).
4. **No "Search 60+ more countries" row** — decorative/non-functional in the prototype.
5. **Unknown flag codes render a neutral placeholder box** (theme `surface3`) instead of the prototype's `null`, so rows never collapse for countries without a spec.

## File Structure

```
travidex/
├─ components/Flag.tsx              # FLAGS spec map + <Flag/> (asset port)
├─ components/LocationPicker.tsx    # modal bottom sheet, cities/countries views
├─ hooks/useActiveCity.ts           # cityId → CityWithCountry (pill, recenter, sheet title)
├─ lib/data/citiesByCountry.ts      # + getCityWithCountry
└─ app/(tabs)/map.tsx               # pill + region + real city name + picker wiring
```

Existing modules consumed (no changes): `lib/data/countries.ts` (`getCountries`), `lib/data/progress.ts` (`getCityProgress`, `getCountryProgress`), `context/CityProvider.tsx` (`cityId`, `setCityId`), `hooks/useCityCatalog.ts`, `components/DexSheet.tsx`.

---

### Task 1: Flag asset component

**Files:** Create `travidex/components/Flag.tsx`; Test: `travidex/components/__tests__/Flag.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { Flag } from '../Flag';

it('renders a known flag with the country name as label', async () => {
  await renderWithTheme(<Flag code="JP" size={22} />);
  expect(screen.getByLabelText('Japan')).toBeOnTheScreen();
});

it('renders a neutral placeholder for unknown codes', async () => {
  await renderWithTheme(<Flag code="ZZ" size={22} />);
  expect(screen.getByLabelText('ZZ')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- Flag`
Expected: FAIL — cannot find module `../Flag`.

- [ ] **Step 3: Implement** — create `travidex/components/Flag.tsx`

```tsx
import { View } from 'react-native';
import { useTheme } from '@/theme';

// Real-world flag colors below are intrinsic asset data (port of the design kit's
// flags.jsx) — exempt from the no-hardcoded-hex theme rule. Everything else themes.

type Spec =
  | ['v' | 'h', string[]]
  | ['vu' | 'hu', [string, number][]]
  | ['circle', string, string, number]
  | ['nordic', string, string] | ['nordic', string, string, string]
  | ['plus', string, string]
  | ['usa'];

const FLAGS: Record<string, { name: string; spec: Spec }> = {
  JP: { name: 'Japan',         spec: ['circle', '#ffffff', '#BC002D', 42] },
  BD: { name: 'Bangladesh',    spec: ['circle', '#006A4E', '#F42A41', 40] },
  FR: { name: 'France',        spec: ['v', ['#0055A4', '#ffffff', '#EF4135']] },
  IT: { name: 'Italy',         spec: ['v', ['#009246', '#ffffff', '#CE2B37']] },
  IE: { name: 'Ireland',       spec: ['v', ['#169B62', '#ffffff', '#FF883E']] },
  BE: { name: 'Belgium',       spec: ['v', ['#000000', '#FAE042', '#ED2939']] },
  RO: { name: 'Romania',       spec: ['v', ['#002B7F', '#FCD116', '#CE1126']] },
  DE: { name: 'Germany',       spec: ['h', ['#000000', '#DD0000', '#FFCE00']] },
  NL: { name: 'Netherlands',   spec: ['h', ['#AE1C28', '#ffffff', '#21468B']] },
  RU: { name: 'Russia',        spec: ['h', ['#ffffff', '#0039A6', '#D52B1E']] },
  HU: { name: 'Hungary',       spec: ['h', ['#CE2939', '#ffffff', '#477050']] },
  ID: { name: 'Indonesia',     spec: ['h', ['#FF0000', '#ffffff']] },
  PL: { name: 'Poland',        spec: ['h', ['#ffffff', '#DC143C']] },
  UA: { name: 'Ukraine',       spec: ['h', ['#0057B7', '#FFD700']] },
  AT: { name: 'Austria',       spec: ['h', ['#ED2939', '#ffffff', '#ED2939']] },
  LT: { name: 'Lithuania',     spec: ['h', ['#FDB913', '#006A44', '#C1272D']] },
  ES: { name: 'Spain',         spec: ['hu', [['#AA151B', 1], ['#F1BF00', 2], ['#AA151B', 1]]] },
  TH: { name: 'Thailand',      spec: ['hu', [['#A51931', 1], ['#F4F5F8', 1], ['#2D2A4A', 2], ['#F4F5F8', 1], ['#A51931', 1]]] },
  PT: { name: 'Portugal',      spec: ['vu', [['#006600', 2], ['#FF0000', 3]]] },
  SE: { name: 'Sweden',        spec: ['nordic', '#006AA7', '#FECC00'] },
  DK: { name: 'Denmark',       spec: ['nordic', '#C8102E', '#ffffff'] },
  FI: { name: 'Finland',       spec: ['nordic', '#ffffff', '#003580'] },
  NO: { name: 'Norway',        spec: ['nordic', '#BA0C2F', '#ffffff', '#00205B'] },
  CH: { name: 'Switzerland',   spec: ['plus', '#D52B1E', '#ffffff'] },
  US: { name: 'United States', spec: ['usa'] },
};

function Stripes({ dir, parts }: { dir: 'v' | 'h'; parts: [string, number][] }) {
  return (
    <View style={{ flex: 1, flexDirection: dir === 'v' ? 'row' : 'column' }}>
      {parts.map(([color, weight], i) => <View key={i} style={{ flex: weight, backgroundColor: color }} />)}
    </View>
  );
}

function FlagInner({ spec, size }: { spec: Spec; size: number }) {
  const kind = spec[0];
  if (kind === 'v' || kind === 'h') return <Stripes dir={kind} parts={spec[1].map(c => [c, 1] as [string, number])} />;
  if (kind === 'vu' || kind === 'hu') return <Stripes dir={kind === 'hu' ? 'h' : 'v'} parts={spec[1]} />;
  if (kind === 'circle') {
    const [, bg, dot, pct] = spec;
    const d = (size * pct) / 100;
    return (
      <View style={{ flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: dot }} />
      </View>
    );
  }
  if (kind === 'nordic') {
    const [, bg, cross, inner] = spec;
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: '16%', backgroundColor: cross }} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: '42%', height: '16%', backgroundColor: cross }} />
        {inner ? (
          <>
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: '34%', width: '8%', backgroundColor: inner }} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: '46%', height: '8%', backgroundColor: inner }} />
          </>
        ) : null}
      </View>
    );
  }
  if (kind === 'plus') {
    const [, bg, cross] = spec;
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ position: 'absolute', top: '18%', bottom: '18%', left: '40%', width: '20%', backgroundColor: cross }} />
        <View style={{ position: 'absolute', left: '18%', right: '18%', top: '40%', height: '20%', backgroundColor: cross }} />
      </View>
    );
  }
  // usa: 13 stripes + canton (star dots are sub-pixel at pill sizes; omitted)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {Array.from({ length: 13 }, (_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? '#B22234' : '#ffffff' }} />
        ))}
      </View>
      <View style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '53.85%', backgroundColor: '#3C3B6E' }} />
    </View>
  );
}

export function Flag({ code, size, radius = 0 }: { code: string; size: number; radius?: number }) {
  const t = useTheme();
  const f = FLAGS[code];
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={f?.name ?? code}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', backgroundColor: t.colors.surface3 }}
    >
      {f ? <FlagInner spec={f.spec} size={size} /> : null}
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- Flag` → PASS (2 tests). Then `npx tsc --noEmit` → clean.

- [ ] **Step 5: Commit**

```bash
git add components/Flag.tsx components/__tests__/Flag.test.tsx && git commit -m "feat: add Flag asset component (port of design-kit flags)"
```

---

### Task 2: Active-city lookup (data + hook)

**Files:** Modify (append to) `travidex/lib/data/citiesByCountry.ts`; Create `travidex/hooks/useActiveCity.ts`; Tests: `travidex/lib/data/__tests__/cityWithCountry.test.ts`, `travidex/hooks/__tests__/useActiveCity.test.tsx`

- [ ] **Step 1: Write the failing tests**

`travidex/lib/data/__tests__/cityWithCountry.test.ts`:
```ts
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
jest.mock('../../supabase', () => ({ supabase: { from: jest.fn(() => ({ select: mockSelect })) } }));

import { getCityWithCountry } from '../citiesByCountry';

beforeEach(() => jest.clearAllMocks());

it('returns the city with flattened country code/name', async () => {
  mockSingle.mockResolvedValue({
    data: { id: 'c1', country_id: 'k1', name: 'Paris', region: 'Île-de-France', lat: 48.85, lng: 2.35, countries: { code: 'FR', name: 'France' } },
    error: null,
  });
  const c = await getCityWithCountry('c1');
  expect(mockEq).toHaveBeenCalledWith('id', 'c1');
  expect(c).toMatchObject({ id: 'c1', name: 'Paris', country_code: 'FR', country_name: 'France' });
});
```

`travidex/hooks/__tests__/useActiveCity.test.tsx`:
```tsx
jest.mock('../../lib/data/citiesByCountry', () => ({ getCityWithCountry: jest.fn() }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getCityWithCountry } from '../../lib/data/citiesByCountry';
import { useActiveCity } from '../useActiveCity';

beforeEach(() => jest.clearAllMocks());

it('loads the active city record', async () => {
  (getCityWithCountry as jest.Mock).mockResolvedValue({ id: 'c1', name: 'Paris', country_code: 'FR' });
  const { result } = await renderHook(() => useActiveCity('c1'));
  await waitFor(() => expect(result.current.city?.name).toBe('Paris'));
});
```
(RNTL14: `await renderHook` per repo pattern.)

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- cityWithCountry useActiveCity` → FAIL (missing exports/modules).

- [ ] **Step 3: Implement**

Append to `travidex/lib/data/citiesByCountry.ts` (touch nothing existing):
```ts
export type CityWithCountry = City & { country_code: string; country_name: string };

export async function getCityWithCountry(cityId: string): Promise<CityWithCountry | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, country_id, name, region, lat:st_y(center::geometry), lng:st_x(center::geometry), countries(code, name)')
    .eq('id', cityId)
    .single();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { countries, ...city } = data as any;
  return { ...(city as City), country_code: countries?.code ?? '', country_name: countries?.name ?? '' };
}
```

Create `travidex/hooks/useActiveCity.ts`:
```ts
import { useEffect, useState } from 'react';
import { getCityWithCountry, CityWithCountry } from '../lib/data/citiesByCountry';

export function useActiveCity(cityId: string) {
  const [city, setCity] = useState<CityWithCountry | null>(null);

  useEffect(() => {
    let live = true;
    getCityWithCountry(cityId)
      .then(c => { if (live) setCity(c); })
      .catch(err => console.warn('useActiveCity failed', err));
    return () => { live = false; };
  }, [cityId]);

  return { city };
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npm test -- cityWithCountry useActiveCity` → PASS. Then existing `npm test -- country-screen` still PASS (file only appended). `npx tsc --noEmit` → clean.

- [ ] **Step 5: Commit**

```bash
git add lib/data/citiesByCountry.ts lib/data/__tests__/cityWithCountry.test.ts hooks/useActiveCity.ts hooks/__tests__/useActiveCity.test.tsx && git commit -m "feat: add active-city lookup with country code"
```

---

### Task 3: LocationPicker sheet

**Files:** Create `travidex/components/LocationPicker.tsx`; Test: `travidex/components/__tests__/LocationPicker.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn(), getCountryProgress: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress, getCountryProgress } from '../../lib/data/progress';
import { LocationPicker } from '../LocationPicker';

const COUNTRIES = [
  { id: 'k1', name: 'France', code: 'FR', created_at: '' },
  { id: 'k2', name: 'Japan', code: 'JP', created_at: '' },
];
const FR_CITIES = [
  { id: 'c1', country_id: 'k1', name: 'Paris', region: 'Île-de-France', lat: 48.85, lng: 2.35 },
  { id: 'c2', country_id: 'k1', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', lat: 45.76, lng: 4.83 },
];
const JP_CITIES = [{ id: 'c3', country_id: 'k2', name: 'Kyoto', region: 'Kansai', lat: 35.0, lng: 135.77 }];

beforeEach(() => {
  jest.clearAllMocks();
  (getCountries as jest.Mock).mockResolvedValue(COUNTRIES);
  (getCitiesForCountry as jest.Mock).mockImplementation((id: string) => Promise.resolve(id === 'k1' ? FR_CITIES : JP_CITIES));
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 3, total: 8 }], ['c2', { found: 0, total: 5 }]]));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 3, total: 13 }], ['k2', { found: 0, total: 8 }]]));
});

it('lists cities with progress and picks one', async () => {
  const onPick = jest.fn();
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={onPick} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  expect(screen.getByText('3/8')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Lyon'));
  expect(onPick).toHaveBeenCalledWith('c2');
});

it('filters cities by search', async () => {
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={jest.fn()} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  await act(async () => { fireEvent.changeText(screen.getByPlaceholderText('Search cities in France'), 'ly'); });
  expect(screen.queryByText('Paris')).toBeNull();
  expect(screen.getByText('Lyon')).toBeOnTheScreen();
});

it('switches country via the countries view', async () => {
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={jest.fn()} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Change'));
  await waitFor(() => expect(screen.getByText('Choose a country')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Japan'));
  await waitFor(() => expect(screen.getByText('Kyoto')).toBeOnTheScreen());
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- LocationPicker` → FAIL (cannot find module `../LocationPicker`).

- [ ] **Step 3: Implement** — create `travidex/components/LocationPicker.tsx`

```tsx
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
                  <Text style={[t.type.h3, { color: t.colors.text1 }]}>‹</Text>
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
                      <Text style={{ color: t.colors.text3 }}>›</Text>
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
```
TOKEN CHECK: confirm `t.radii.lg`, `t.type.stat`, `t.type.label`, `t.type.caption`, `t.colors.greenLine`, `t.colors.borderStrong`, `t.colors.borderSubtle`, `t.colors.surfaceScrim` exist in `travidex/theme/`; substitute the closest existing token if any differ and report it.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- LocationPicker` → PASS (3 tests). `npx tsc --noEmit` → clean.

- [ ] **Step 5: Commit**

```bash
git add components/LocationPicker.tsx components/__tests__/LocationPicker.test.tsx && git commit -m "feat: add LocationPicker sheet (cities + countries views)"
```

---

### Task 4: Map screen integration

**Files:** Modify `travidex/app/(tabs)/map.tsx` (replace), `travidex/app/__tests__/tabs.test.tsx` (add 2 mocks); Create `travidex/app/__tests__/map-screen.test.tsx`

- [ ] **Step 1: Write the failing test** — `travidex/app/__tests__/map-screen.test.tsx`

```tsx
const mockSetCityId = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1', setCityId: mockSetCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: () => ({ sights: [], completion: { found: 0, total: 0 }, loading: false, reload: jest.fn() }) }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({ city: { id: 'c1', country_id: 'k1', name: 'Paris', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' } }),
}));
// Stub the picker — its own behavior is covered by LocationPicker.test.tsx.
// When visible it renders a probe that exercises the onPick wiring.
jest.mock('../../components/LocationPicker', () => ({
  LocationPicker: ({ visible, onPick }: any) => {
    const { Text } = require('react-native');
    return visible ? <Text onPress={() => onPick('c9')}>PICKER-OPEN</Text> : null;
  },
}));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import MapScreen from '../(tabs)/map';

beforeEach(() => jest.clearAllMocks());

it('shows the location pill and opens the picker', async () => {
  await renderWithTheme(<MapScreen />);
  expect(screen.getByText('Paris')).toBeOnTheScreen();        // pill city name
  expect(screen.getByLabelText('France')).toBeOnTheScreen();  // pill flag
  fireEvent.press(screen.getByTestId('location-pill'));
  expect(screen.getByText('PICKER-OPEN')).toBeOnTheScreen();
});

it('picking a city updates the provider and closes the picker', async () => {
  await renderWithTheme(<MapScreen />);
  fireEvent.press(screen.getByTestId('location-pill'));
  fireEvent.press(screen.getByText('PICKER-OPEN'));           // stub calls onPick('c9')
  expect(mockSetCityId).toHaveBeenCalledWith('c9');
  expect(screen.queryByText('PICKER-OPEN')).toBeNull();        // picker closed
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- map-screen` → FAIL (no pill / no `location-pill` testID).

- [ ] **Step 3: Implement** — replace `travidex/app/(tabs)/map.tsx`

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';
import { LocationPicker } from '../../components/LocationPicker';
import { Flag } from '../../components/Flag';

export default function MapScreen() {
  const t = useTheme();
  const router = useRouter();
  const { cityId, setCityId } = useCity();
  const { sights } = useCityCatalog(cityId);
  const { city } = useActiveCity(cityId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const open = (id: string) => router.push(`/sight/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          testID="map-view"
          region={city ? { latitude: city.lat, longitude: city.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 } : undefined}
        >
          {sights.map(s => <SightPin key={s.id} sight={s} onPress={open} />)}
        </MapView>
        <Pressable
          testID="location-pill"
          onPress={() => setPickerOpen(true)}
          style={{ position: 'absolute', top: t.spacing.s5, left: t.spacing.s4, flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, paddingVertical: t.spacing.s2, paddingHorizontal: t.spacing.s3, borderRadius: 999, backgroundColor: t.colors.surfaceOverlay, borderWidth: 1, borderColor: t.colors.borderSubtle }}
        >
          <Flag code={city?.country_code ?? ''} size={22} radius={5} />
          <Text style={[t.type.body, { color: t.colors.text1 }]}>{city?.name ?? ''}</Text>
          <Text style={{ color: t.colors.text3 }}>▾</Text>
        </Pressable>
      </View>
      <View style={{ height: '42%' }}>
        <DexSheet cityName={city?.name ?? ''} sights={sights} onSelect={open} />
      </View>
      <LocationPicker
        visible={pickerOpen}
        currentCityId={cityId}
        initialCountryId={city?.country_id ?? null}
        onPick={(id) => { setCityId(id); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
```
This removes the hardcoded `cityName="Paris"` — the sheet title now tracks the active city.

- [ ] **Step 4: Update `travidex/app/__tests__/tabs.test.tsx`**

The Map smoke test now needs the two new hooks stubbed. ADD these mocks next to the existing ones (change nothing else):
```tsx
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({ city: { id: 'c1', country_id: 'k1', name: 'Paris', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' } }),
}));
jest.mock('../../components/LocationPicker', () => ({ LocationPicker: () => null }));
```
Note: the existing `jest.mock('../../context/CityProvider', ...)` in tabs.test returns only `{ cityId: 'city-1' }` — extend that factory's return to `{ cityId: 'city-1', setCityId: jest.fn() }` since map.tsx now destructures `setCityId`.

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- map-screen tabs` → PASS. Then `npx tsc --noEmit` → clean. Then FULL suite `npm test -- --runInBand` → ALL pass (use `--runInBand`; parallel workers have a known pre-existing flake).

- [ ] **Step 6: Commit**

```bash
git add app/\(tabs\)/map.tsx app/__tests__/map-screen.test.tsx app/__tests__/tabs.test.tsx && git commit -m "feat: add map location pill + picker wiring"
```

---

## Phase 7.5 Done — Definition of Done

- `npm test -- --runInBand` green across the whole app; `npx tsc --noEmit` clean.
- Map shows a location pill (flag + active city + chevron); tapping it opens the LocationPicker; picking a city swaps pins, recenters the map, and retitles the dex sheet; per-city find progress persists automatically (server-side).
- No change to the find-logging path, DexSheet, SightPin, or any Phase 5 explore screens (besides the appended data function).
