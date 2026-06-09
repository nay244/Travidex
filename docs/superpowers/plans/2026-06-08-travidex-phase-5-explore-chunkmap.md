# Travidex Phase 5 — Explore & Country Chunk-Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Explore tab — World (countries with completion), the OSRS-style Country chunk-map (each city a tile that claims at 100%), and a City preview that opens the city's map.

**Architecture:** Two SQL aggregation RPCs (`city_progress`, `country_progress`) compute found/total per city/country in one query each. Thin TS wrappers expose them; a pure `isClaimed` decides the green state. `ChunkTile` renders the three states. Screens compose these. Free exploration only — no gating.

**Tech Stack:** Postgres RPC, TypeScript, Jest/RNTL, Phase 2–3 layers.

**CLAUDE.md compliance:** claim rule is exactly "100% of a city's sights" (spec); no adjacency/challenge logic (explicitly cut); aggregation done in SQL, not N+1 client calls (DRY/efficiency); test-first throughout.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for the hex→token mapping. `ChunkTile` states use `t.colors.chunkClaimed` / `chunkProgress` / `chunkUntouched` (untouched is **hollow** — outline + transparent fill, not dim). Read all other colors from tokens too.

---

## File Structure

```
travidex/
├─ supabase/migrations/0007_progress_rpc.sql
├─ lib/claim.ts                      # pure isClaimed
├─ lib/data/progress.ts             # getCityProgress, getCountryProgress
├─ components/ChunkTile.tsx
├─ app/(tabs)/explore.tsx           # World (countries)
├─ app/country/[id].tsx             # chunk-map
└─ app/city/[id].tsx                # city preview
```

---

### Task 1: Progress aggregation RPCs

**Files:** Create `supabase/migrations/0007_progress_rpc.sql`

- [ ] **Step 1: Write the migration**

```sql
-- found/total sights per city for a given user
create or replace function city_progress(p_user uuid)
returns table(city_id uuid, total bigint, found bigint)
language sql stable as $$
  select s.city_id,
         count(s.id) as total,
         count(f.id) as found
  from sights s
  left join finds f on f.sight_id = s.id and f.user_id = p_user
  group by s.city_id;
$$;

-- found/total sights per country for a given user
create or replace function country_progress(p_user uuid)
returns table(country_id uuid, total bigint, found bigint)
language sql stable as $$
  select c.country_id,
         count(s.id) as total,
         count(f.id) as found
  from cities c
  join sights s on s.city_id = c.id
  left join finds f on f.sight_id = s.id and f.user_id = p_user
  group by c.country_id;
$$;
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Run: `npx supabase db query "select * from city_progress('00000000-0000-0000-0000-000000000000');"`
Expected: one row for Paris with `total = 3`, `found = 0` (no finds for that dummy user).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): city/country progress rpcs"
```

---

### Task 2: Pure claim logic

**Files:** Create `lib/claim.ts`; Test: `lib/__tests__/claim.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { isClaimed, progressState } from '../claim';

it('claimed only at 100% with at least one sight', () => {
  expect(isClaimed(3, 3)).toBe(true);
  expect(isClaimed(2, 3)).toBe(false);
  expect(isClaimed(0, 0)).toBe(false);
});

it('progressState buckets correctly', () => {
  expect(progressState(0, 3)).toBe('untouched');
  expect(progressState(1, 3)).toBe('in-progress');
  expect(progressState(3, 3)).toBe('claimed');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- claim`
Expected: FAIL — cannot find module `../claim`.

- [ ] **Step 3: Implement**

Create `lib/claim.ts`:
```ts
export type ProgressState = 'untouched' | 'in-progress' | 'claimed';

export function isClaimed(found: number, total: number): boolean {
  return total > 0 && found === total;
}

export function progressState(found: number, total: number): ProgressState {
  if (isClaimed(found, total)) return 'claimed';
  if (found > 0) return 'in-progress';
  return 'untouched';
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- claim`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add claim/progress-state logic"
```

---

### Task 3: Progress data-access

**Files:** Create `lib/data/progress.ts`; Test: `lib/data/__tests__/progress.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const rpc = jest.fn();
jest.mock('../../supabase', () => ({ supabase: { rpc } }));
import { getCityProgress, getCountryProgress } from '../progress';

beforeEach(() => jest.clearAllMocks());

it('getCityProgress returns a map of cityId → {found,total}', async () => {
  rpc.mockResolvedValue({ data: [{ city_id: 'c1', total: 3, found: 1 }], error: null });
  const map = await getCityProgress('u1');
  expect(rpc).toHaveBeenCalledWith('city_progress', { p_user: 'u1' });
  expect(map.get('c1')).toEqual({ found: 1, total: 3 });
});

it('getCountryProgress maps countryId → {found,total}', async () => {
  rpc.mockResolvedValue({ data: [{ country_id: 'k1', total: 10, found: 4 }], error: null });
  const map = await getCountryProgress('u1');
  expect(rpc).toHaveBeenCalledWith('country_progress', { p_user: 'u1' });
  expect(map.get('k1')).toEqual({ found: 4, total: 10 });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/progress`
Expected: FAIL — cannot find module `../progress`.

- [ ] **Step 3: Implement**

Create `lib/data/progress.ts`:
```ts
import { supabase } from '../supabase';

export type Progress = { found: number; total: number };

export async function getCityProgress(userId: string): Promise<Map<string, Progress>> {
  const { data, error } = await supabase.rpc('city_progress', { p_user: userId });
  if (error) throw new Error(error.message);
  const map = new Map<string, Progress>();
  for (const r of (data ?? []) as any[]) map.set(r.city_id, { found: Number(r.found), total: Number(r.total) });
  return map;
}

export async function getCountryProgress(userId: string): Promise<Map<string, Progress>> {
  const { data, error } = await supabase.rpc('country_progress', { p_user: userId });
  if (error) throw new Error(error.message);
  const map = new Map<string, Progress>();
  for (const r of (data ?? []) as any[]) map.set(r.country_id, { found: Number(r.found), total: Number(r.total) });
  return map;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- data/progress`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add progress data-access"
```

---

### Task 4: ChunkTile component

**Files:** Create `components/ChunkTile.tsx`; Test: `components/__tests__/ChunkTile.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { ChunkTile } from '../ChunkTile';

it('shows city name, progress, and claimed marker at 100%', () => {
  renderWithTheme(<ChunkTile name="Tokyo" found={20} total={20} onPress={() => {}} />);
  expect(screen.getByText('Tokyo')).toBeOnTheScreen();
  expect(screen.getByText('20/20')).toBeOnTheScreen();
  expect(screen.getByTestId('claimed')).toBeOnTheScreen();
});

it('no claimed marker when in-progress', () => {
  renderWithTheme(<ChunkTile name="Osaka" found={5} total={20} onPress={() => {}} />);
  expect(screen.queryByTestId('claimed')).toBeNull();
});

it('fires onPress', () => {
  const onPress = jest.fn();
  renderWithTheme(<ChunkTile name="Kyoto" found={0} total={18} onPress={onPress} />);
  fireEvent.press(screen.getByText('Kyoto'));
  expect(onPress).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- ChunkTile`
Expected: FAIL — cannot find module `../ChunkTile`.

- [ ] **Step 3: Implement**

Create `components/ChunkTile.tsx`:
```tsx
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { progressState } from '../lib/claim';

export function ChunkTile({ name, found, total, onPress }: { name: string; found: number; total: number; onPress: () => void }) {
  const t = useTheme();
  const state = progressState(found, total);
  // found/unfound spine: an untouched chunk is HOLLOW (transparent fill), not dimmed
  const fill = state === 'claimed' ? t.colors.foundBg : state === 'in-progress' ? t.colors.progressBg : 'transparent';
  const border = state === 'claimed' ? t.colors.chunkClaimed : state === 'in-progress' ? t.colors.chunkProgress : t.colors.chunkUntouched;
  return (
    <Pressable onPress={onPress} style={{ width: 96, height: 80, margin: t.spacing.s2, borderRadius: t.radii.sm, borderWidth: 1.5, borderColor: border, backgroundColor: fill, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[t.type.h3, { color: t.colors.text1 }]}>{name}</Text>
      <Text style={[t.type.monoSm, { color: t.colors.text2 }]}>{`${found}/${total}`}</Text>
      {state === 'claimed' && <Text testID="claimed" style={[t.type.label, { color: t.colors.green }]}>✓ claimed</Text>}
    </Pressable>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- ChunkTile`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add ChunkTile component"
```

---

### Task 5: Country chunk-map screen

**Files:** Create `app/country/[id].tsx`; Test: `app/__tests__/country-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }), useLocalSearchParams: () => ({ id: 'country-1' }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress } from '../../lib/data/progress';
import Country from '../country/[id]';

beforeEach(() => jest.clearAllMocks());

it('renders a chunk per city with its progress and opens a city', async () => {
  (getCitiesForCountry as jest.Mock).mockResolvedValue([{ id: 'c1', name: 'Tokyo' }, { id: 'c2', name: 'Osaka' }]);
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 20, total: 20 }], ['c2', { found: 5, total: 22 }]]));
  renderWithTheme(<Country />);
  await waitFor(() => expect(screen.getByText('Tokyo')).toBeOnTheScreen());
  expect(screen.getByText('20/20')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Osaka'));
  expect(push).toHaveBeenCalledWith('/city/c2');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- country-screen`
Expected: FAIL — cannot find modules `country/[id]` / `citiesByCountry`.

- [ ] **Step 3: Implement**

Create `lib/data/citiesByCountry.ts`:
```ts
import { supabase } from '../supabase';
import type { City } from '../types';

export async function getCitiesForCountry(countryId: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, country_id, name, region, lat:st_y(center::geometry), lng:st_x(center::geometry)')
    .eq('country_id', countryId)
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as City[];
}
```

Create `app/country/[id].tsx`:
```tsx
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress, Progress } from '../../lib/data/progress';
import { ChunkTile } from '../../components/ChunkTile';
import type { City } from '../../lib/types';

export default function Country() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map());

  useEffect(() => {
    (async () => {
      const [list, prog] = await Promise.all([
        getCitiesForCountry(id!),
        session?.user ? getCityProgress(session.user.id) : Promise.resolve(new Map<string, Progress>()),
      ]);
      setCities(list);
      setProgress(prog);
    })();
  }, [id, session?.user?.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3 }}>
      {cities.map(c => {
        const p = progress.get(c.id) ?? { found: 0, total: 0 };
        return <ChunkTile key={c.id} name={c.name} found={p.found} total={p.total} onPress={() => router.push(`/city/${c.id}`)} />;
      })}
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- country-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add country chunk-map screen"
```

---

### Task 6: World (countries) screen

**Files:** Replace `app/(tabs)/explore.tsx`; Create `lib/data/countries.ts`; Test: `app/__tests__/explore-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCountryProgress: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCountryProgress } from '../../lib/data/progress';
import Explore from '../(tabs)/explore';

beforeEach(() => jest.clearAllMocks());

it('lists countries with progress and opens one', async () => {
  (getCountries as jest.Mock).mockResolvedValue([{ id: 'k1', name: 'France', code: 'FR' }]);
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 1, total: 3 }]]));
  renderWithTheme(<Explore />);
  await waitFor(() => expect(screen.getByText('France')).toBeOnTheScreen());
  expect(screen.getByText('1 / 3 sights')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('France'));
  expect(push).toHaveBeenCalledWith('/country/k1');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- explore-screen`
Expected: FAIL — current placeholder renders only "Explore".

- [ ] **Step 3: Implement**

Create `lib/data/countries.ts`:
```ts
import { supabase } from '../supabase';
import type { Country } from '../types';

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase.from('countries').select('*').order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Country[];
}
```

Replace `app/(tabs)/explore.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCountries } from '../../lib/data/countries';
import { getCountryProgress, Progress } from '../../lib/data/progress';
import type { Country } from '../../lib/types';

export default function Explore() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map());

  useEffect(() => {
    (async () => {
      const [list, prog] = await Promise.all([
        getCountries(),
        session?.user ? getCountryProgress(session.user.id) : Promise.resolve(new Map<string, Progress>()),
      ]);
      setCountries(list);
      setProgress(prog);
    })();
  }, [session?.user?.id]);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: t.colors.bg }}
      data={countries}
      keyExtractor={c => c.id}
      renderItem={({ item }) => {
        const p = progress.get(item.id) ?? { found: 0, total: 0 };
        return (
          <Pressable onPress={() => router.push(`/country/${item.id}`)} style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
            <Text style={[t.type.h3, { color: t.colors.text1 }]}>{item.name}</Text>
            <Text style={[t.type.caption, { color: t.colors.text2 }]}>{`${p.found} / ${p.total} sights`}</Text>
          </Pressable>
        );
      }}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- explore-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add World/Explore countries screen"
```

---

### Task 7: City preview screen

**Files:** Create `app/city/[id].tsx`; Test: `app/__tests__/city-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const replace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace }), useLocalSearchParams: () => ({ id: 'c1' }) }));
const setCityId = jest.fn();
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ setCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import City from '../city/[id]';

beforeEach(() => jest.clearAllMocks());

it('shows completion and opens the city map', () => {
  (useCityCatalog as jest.Mock).mockReturnValue({ sights: [], completion: { found: 2, total: 5 }, loading: false });
  renderWithTheme(<City />);
  expect(screen.getByText('2 of 5 found')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Open map'));
  expect(setCityId).toHaveBeenCalledWith('c1');
  expect(replace).toHaveBeenCalledWith('/(tabs)/map');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- city-screen`
Expected: FAIL — cannot find module `city/[id]`.

- [ ] **Step 3: Implement**

Create `app/city/[id].tsx`:
```tsx
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';

export default function City() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCityId } = useCity();
  const { sights, completion } = useCityCatalog(id!);

  function openMap() {
    setCityId(id!);
    router.replace('/(tabs)/map');
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
        <Text style={[t.type.h3, { color: t.colors.text1 }]}>{`${completion.found} of ${completion.total} found`}</Text>
        <Pressable onPress={openMap} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
          <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Open map</Text>
        </Pressable>
      </View>
      <FlatList data={sights} keyExtractor={s => s.id} renderItem={({ item }) => <SightRow sight={item} onPress={() => router.push(`/sight/${item.id}`)} />} />
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- city-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add city preview screen"
```

---

## Phase 5 Done — Definition of Done

- `npm test` green; progress RPCs wrapped + tested, `isClaimed`, `ChunkTile`, World/Country/City screens covered.
- Explore → country chunk-map shows each city's live found/total, claims green at 100%, and a city opens into its Map+Dex (sets active city). No gating — free exploration.
