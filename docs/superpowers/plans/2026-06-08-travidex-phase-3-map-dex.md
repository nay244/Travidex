# Travidex Phase 3 — Map Home & Dex Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Map tab: an Apple-Maps view where every sight is a pin (bright = found, dim = unseen) plus a draggable dex bottom sheet with completion header, search, sort, and pin⇄row focus sync.

**Architecture:** A `CityProvider` holds the active city. A `useCityCatalog` hook merges `getSightsForCity` + `getFoundSightIds` into `SightWithFind[]` and completion counts. Pure list logic (filter/sort) is extracted to `lib/sightList.ts` and TDD'd. UI components (`CompletionBar`, `SightRow`, pins) are render-tested; `react-native-maps` is mocked in tests.

**Tech Stack:** react-native-maps, @gorhom/bottom-sheet, react-native-reanimated, react-native-gesture-handler, Jest/RNTL.

**CLAUDE.md compliance:** only the Map screen and its pieces — no map features beyond pins + sheet + sync; reuse Phase 2 data layer (DRY); each unit test defines a verifiable goal.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for the hex→token mapping. In every component below add `const t = useTheme();` and read tokens. Literal hex shown in snippets is illustrative — implement it as the mapped token. **Found = full color; unfound = hollow** (`borderColor: t.colors.locked`, transparent fill, `t.colors.text3` label) — never an opacity dim. This directly affects `SightPin`, `SightRow`, and the dex list states.

---

## File Structure

```
travidex/
├─ context/CityProvider.tsx
├─ hooks/useCityCatalog.ts
├─ lib/sightList.ts                 # pure filter/sort/compute
├─ components/
│  ├─ CompletionBar.tsx
│  ├─ SightRow.tsx
│  ├─ SightPin.tsx
│  └─ DexSheet.tsx
├─ app/(tabs)/map.tsx               # replaces the Phase 1 placeholder
└─ __mocks__/react-native-maps.tsx
```

---

### Task 1: Install map + bottom-sheet deps

- [ ] **Step 1: Install**

```bash
cd travidex
npx expo install react-native-maps react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet
```

- [ ] **Step 2: Configure reanimated + gesture handler**

In `babel.config.js` add `'react-native-reanimated/plugin'` as the **last** plugin.
At the top of `app/_layout.tsx` add: `import 'react-native-gesture-handler';`

- [ ] **Step 3: Add a jest mock for react-native-maps**

Create `__mocks__/react-native-maps.tsx`:
```tsx
import { View } from 'react-native';
const MockMapView = (props: any) => <View testID="map-view">{props.children}</View>;
export const Marker = (props: any) => <View testID={`marker-${props.identifier ?? ''}`}>{props.children}</View>;
export default MockMapView;
```
Add to `package.json` jest config: `"setupFiles"` already set; add `"moduleNameMapper": { "react-native-maps": "<rootDir>/__mocks__/react-native-maps.tsx" }`.

- [ ] **Step 4: Verify tests still run**

Run: `npm test`
Expected: existing suites still PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: add react-native-maps and bottom-sheet"
```

---

### Task 2: Pure sight-list logic

**Files:** Create `lib/sightList.ts`; Test: `lib/__tests__/sightList.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { filterSights, sortSights, completion, SightWithFind } from '../sightList';

const s = (id: string, dex: number, name: string, found: boolean): SightWithFind =>
  ({ id, dex_no: dex, name, found } as SightWithFind);
const list = [s('a', 3, 'Cathedral', false), s('b', 1, 'Tower', true), s('c', 2, 'Market', false)];

it('filterSights matches name case-insensitively', () => {
  expect(filterSights(list, 'tow').map(x => x.id)).toEqual(['b']);
});
it('filterSights empty query returns all', () => {
  expect(filterSights(list, '')).toHaveLength(3);
});
it('sortSights by dex', () => {
  expect(sortSights(list, 'dex').map(x => x.dex_no)).toEqual([1, 2, 3]);
});
it('sortSights by found first', () => {
  expect(sortSights(list, 'found')[0].found).toBe(true);
});
it('completion counts found/total', () => {
  expect(completion(list)).toEqual({ found: 1, total: 3 });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- sightList`
Expected: FAIL — cannot find module `../sightList`.

- [ ] **Step 3: Implement**

Create `lib/sightList.ts`:
```ts
import type { SightWithFind as Base } from './types';
export type SightWithFind = Base;
export type SortKey = 'dex' | 'found' | 'name';

export function filterSights(list: SightWithFind[], query: string): SightWithFind[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(s => s.name.toLowerCase().includes(q));
}

export function sortSights(list: SightWithFind[], key: SortKey): SightWithFind[] {
  const copy = [...list];
  if (key === 'dex') return copy.sort((a, b) => a.dex_no - b.dex_no);
  if (key === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => Number(b.found) - Number(a.found) || a.dex_no - b.dex_no);
}

export function completion(list: SightWithFind[]): { found: number; total: number } {
  return { found: list.filter(s => s.found).length, total: list.length };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- sightList`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add pure sight-list filter/sort/completion"
```

---

### Task 3: Active city context

**Files:** Create `context/CityProvider.tsx`; Test: `context/__tests__/CityProvider.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { CityProvider, useCity } from '../CityProvider';

function Probe() {
  const { cityId, setCityId } = useCity();
  return (
    <>
      <Text>{cityId}</Text>
      <Pressable onPress={() => setCityId('tokyo')}><Text>change</Text></Pressable>
    </>
  );
}

it('defaults to the seeded Paris city and updates', () => {
  render(<CityProvider><Probe /></CityProvider>);
  expect(screen.getByText('22222222-2222-2222-2222-222222222222')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('change'));
  expect(screen.getByText('tokyo')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- CityProvider`
Expected: FAIL — cannot find module `../CityProvider`.

- [ ] **Step 3: Implement**

Create `context/CityProvider.tsx`:
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

const DEFAULT_CITY = '22222222-2222-2222-2222-222222222222'; // seeded Paris

type CityState = { cityId: string; setCityId: (id: string) => void };
const CityContext = createContext<CityState>({ cityId: DEFAULT_CITY, setCityId: () => {} });

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityId] = useState(DEFAULT_CITY);
  return <CityContext.Provider value={{ cityId, setCityId }}>{children}</CityContext.Provider>;
}

export const useCity = () => useContext(CityContext);
```

Wrap the tabs in it: in `app/(tabs)/_layout.tsx`, import `CityProvider` and wrap the returned `<Tabs>` in `<CityProvider>...</CityProvider>`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- CityProvider`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add active-city context"
```

---

### Task 4: useCityCatalog hook

**Files:** Create `hooks/useCityCatalog.ts`; Test: `hooks/__tests__/useCityCatalog.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../lib/data/catalog', () => ({ getSightsForCity: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getSightsForCity } from '../../lib/data/catalog';
import { getFoundSightIds } from '../../lib/data/finds';
import { useCityCatalog } from '../useCityCatalog';

beforeEach(() => jest.clearAllMocks());

it('merges found flags and computes completion', async () => {
  (getSightsForCity as jest.Mock).mockResolvedValue([
    { id: 's1', dex_no: 1, name: 'Tower' }, { id: 's2', dex_no: 2, name: 'Market' },
  ]);
  (getFoundSightIds as jest.Mock).mockResolvedValue(new Set(['s1']));
  const { result } = renderHook(() => useCityCatalog('city-1'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.sights.find(s => s.id === 's1')!.found).toBe(true);
  expect(result.current.sights.find(s => s.id === 's2')!.found).toBe(false);
  expect(result.current.completion).toEqual({ found: 1, total: 2 });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- useCityCatalog`
Expected: FAIL — cannot find module `../useCityCatalog`.

- [ ] **Step 3: Implement**

Create `hooks/useCityCatalog.ts`:
```ts
import { useEffect, useState, useCallback } from 'react';
import { getSightsForCity } from '../lib/data/catalog';
import { getFoundSightIds } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';
import { completion } from '../lib/sightList';
import type { SightWithFind } from '../lib/types';

export function useCityCatalog(cityId: string) {
  const { session } = useAuth();
  const [sights, setSights] = useState<SightWithFind[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const base = await getSightsForCity(cityId);
    const ids = base.map(s => s.id);
    const found = session?.user ? await getFoundSightIds(session.user.id, ids) : new Set<string>();
    setSights(base.map(s => ({ ...s, found: found.has(s.id) })));
    setLoading(false);
  }, [cityId, session?.user?.id]);

  useEffect(() => { load(); }, [load]);

  return { sights, completion: completion(sights), loading, reload: load };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- useCityCatalog`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add useCityCatalog hook"
```

---

### Task 5: CompletionBar component

**Files:** Create `components/CompletionBar.tsx`; Test: `components/__tests__/CompletionBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { CompletionBar } from '../CompletionBar';

it('renders the label with found/total', () => {
  renderWithTheme(<CompletionBar label="Paris" found={3} total={40} />);
  expect(screen.getByText('Paris · 3 of 40')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- CompletionBar`
Expected: FAIL — cannot find module `../CompletionBar`.

- [ ] **Step 3: Implement**

Create `components/CompletionBar.tsx`:
```tsx
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

export function CompletionBar({ label, found, total }: { label: string; found: number; total: number }) {
  const t = useTheme();
  const pct = total === 0 ? 0 : Math.round((found / total) * 100);
  return (
    <View>
      <Text style={[t.type.h3, { color: t.colors.text1 }]}>{`${label} · ${found} of ${total}`}</Text>
      <View style={{ height: 6, backgroundColor: t.colors.surface4, borderRadius: t.radii.xs, marginTop: t.spacing.s2 }}>
        <View style={{ width: `${pct}%`, height: 6, backgroundColor: t.colors.green, borderRadius: t.radii.xs }} />
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- CompletionBar`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add CompletionBar component"
```

---

### Task 6: SightRow component

**Files:** Create `components/SightRow.tsx`; Test: `components/__tests__/SightRow.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { SightRow } from '../SightRow';

const sight = { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: true } as any;

it('shows name and dex number and a found indicator', () => {
  renderWithTheme(<SightRow sight={sight} onPress={() => {}} />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('#001')).toBeOnTheScreen();
  expect(screen.getByTestId('found-check')).toBeOnTheScreen();
});

it('fires onPress with the sight id', () => {
  const onPress = jest.fn();
  renderWithTheme(<SightRow sight={sight} onPress={onPress} />);
  fireEvent.press(screen.getByText('Eiffel Tower'));
  expect(onPress).toHaveBeenCalledWith('s1');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- SightRow`
Expected: FAIL — cannot find module `../SightRow`.

- [ ] **Step 3: Implement**

Create `components/SightRow.tsx`:
```tsx
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightRow({ sight, onPress }: { sight: SightWithFind; onPress: (id: string) => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => onPress(sight.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: t.spacing.s4, gap: t.spacing.s3 }}>
      {/* found = full-color thumb; unfound = hollow outline (the found/unfound spine — never opacity-dim) */}
      <View style={{ width: 44, height: 44, borderRadius: t.radii.sm,
        backgroundColor: sight.found ? t.colors.foundBg : 'transparent',
        borderWidth: sight.found ? 0 : 1, borderColor: t.colors.locked }} />
      <View style={{ flex: 1 }}>
        <Text style={[t.type.h3, { color: sight.found ? t.colors.text1 : t.colors.text3 }]}>{sight.name}</Text>
        <Text style={[t.type.dexNo, { color: t.colors.text3 }]}>{`#${String(sight.dex_no).padStart(3, '0')}`}</Text>
      </View>
      {sight.found && <Text testID="found-check" style={{ color: t.colors.green }}>✓</Text>}
    </Pressable>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- SightRow`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add SightRow component"
```

---

### Task 7: DexSheet (list + search + sort + completion header)

**Files:** Create `components/DexSheet.tsx`; Test: `components/__tests__/DexSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { DexSheet } from '../DexSheet';

const sights = [
  { id: 'a', dex_no: 3, name: 'Cathedral', found: false },
  { id: 'b', dex_no: 1, name: 'Tower', found: true },
] as any;

it('renders completion header and rows, and filters by search', () => {
  renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={() => {}} />);
  expect(screen.getByText('Paris · 1 of 2')).toBeOnTheScreen();
  expect(screen.getByText('Cathedral')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByPlaceholderText('Search sights'), 'tow');
  expect(screen.queryByText('Cathedral')).toBeNull();
  expect(screen.getByText('Tower')).toBeOnTheScreen();
});

it('selecting a row calls onSelect', () => {
  const onSelect = jest.fn();
  renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={onSelect} />);
  fireEvent.press(screen.getByText('Tower'));
  expect(onSelect).toHaveBeenCalledWith('b');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- DexSheet`
Expected: FAIL — cannot find module `../DexSheet`.

- [ ] **Step 3: Implement**

Create `components/DexSheet.tsx`:
```tsx
import { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { CompletionBar } from './CompletionBar';
import { SightRow } from './SightRow';
import { useTheme } from '@/theme';
import { filterSights, sortSights, completion } from '../lib/sightList';
import type { SightWithFind } from '../lib/types';

export function DexSheet({ cityName, sights, onSelect }: { cityName: string; sights: SightWithFind[]; onSelect: (id: string) => void }) {
  const t = useTheme();
  const [query, setQuery] = useState('');
  const { found, total } = completion(sights);
  const visible = sortSights(filterSights(sights, query), 'dex');
  return (
    <View style={{ flex: 1, padding: t.spacing.s4 }}>
      <CompletionBar label={cityName} found={found} total={total} />
      <TextInput
        placeholder="Search sights"
        placeholderTextColor={t.colors.text3}
        value={query}
        onChangeText={setQuery}
        style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s3, borderRadius: t.radii.sm, marginVertical: t.spacing.s3 }]}
      />
      <FlatList data={visible} keyExtractor={s => s.id} renderItem={({ item }) => <SightRow sight={item} onPress={onSelect} />} />
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- DexSheet`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add DexSheet"
```

---

### Task 8: Map screen with pins + sheet + pin⇄row sync

**Files:** Replace `app/(tabs)/map.tsx`; Create `components/SightPin.tsx`; Test: `app/__tests__/map-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import MapScreen from '../(tabs)/map';

beforeEach(() => jest.clearAllMocks());

it('renders a marker per sight and navigates to detail on row select', () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [
      { id: 's1', dex_no: 1, name: 'Tower', found: true, lat: 48.85, lng: 2.29 },
      { id: 's2', dex_no: 2, name: 'Market', found: false, lat: 48.86, lng: 2.35 },
    ],
    completion: { found: 1, total: 2 }, loading: false, reload: jest.fn(),
  });
  renderWithTheme(<MapScreen />);
  expect(screen.getByTestId('marker-s1')).toBeOnTheScreen();
  expect(screen.getByTestId('marker-s2')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Tower'));
  expect(push).toHaveBeenCalledWith('/sight/s1');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- map-screen`
Expected: FAIL — current placeholder renders only "Map".

- [ ] **Step 3: Implement**

Create `components/SightPin.tsx`:
```tsx
import { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightPin({ sight, onPress }: { sight: SightWithFind; onPress: (id: string) => void }) {
  const t = useTheme();
  return (
    <Marker
      identifier={sight.id}
      coordinate={{ latitude: sight.lat, longitude: sight.lng }}
      onPress={() => onPress(sight.id)}
    >
      {/* found = solid pin; unfound = hollow (transparent fill, locked ring) — not an opacity dim */}
      <View style={{ width: 18, height: 18, borderRadius: 9,
        backgroundColor: sight.found ? t.colors.pinFound : 'transparent',
        borderWidth: 2, borderColor: sight.found ? t.colors.pinFound : t.colors.pinUnseen }} />
    </Marker>
  );
}
```

Replace `app/(tabs)/map.tsx`:
```tsx
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';

export default function MapScreen() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { sights } = useCityCatalog(cityId);

  const open = (id: string) => router.push(`/sight/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} testID="map-view">
          {sights.map(s => <SightPin key={s.id} sight={s} onPress={open} />)}
        </MapView>
      </View>
      <View style={{ height: '42%' }}>
        <DexSheet cityName="Paris" sights={sights} onSelect={open} />
      </View>
    </View>
  );
}
```

> Note: the sheet is shown as a fixed bottom panel here for testability and v1 simplicity. Swapping to `@gorhom/bottom-sheet` for the drag-to-minimize gesture is a drop-in replacement of the bottom `<View>` and is done as a follow-up polish step once the panel content is verified. (YAGNI: gesture polish after content works.)

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- map-screen`
Expected: PASS.

- [ ] **Step 5: Manual smoke**

Run: `npx expo start --ios` → Map tab shows the seeded Paris pins + dex list. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Map screen with pins and dex sheet"
```

---

## Phase 3 Done — Definition of Done

- `npm test` green; `sightList`, `useCityCatalog`, `CompletionBar`, `SightRow`, `DexSheet`, Map screen all covered.
- Map tab renders a pin per sight (bright/dim by found) and a dex panel with completion header, search, and row→detail navigation.
- Pin and row both call `open(id)` → `/sight/:id` (detail screen built in Phase 4).
