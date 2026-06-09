# Travidex Phase 4 — Sight Detail & Find Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the core loop — open a sight's detail, navigate to it (Walking in-app / Driving hand-off), and log a find (honor system) that writes to `finds`, brightens the entry, and posts to recent finds.

**Architecture:** A pure `externalMaps` URL builder backs the Driving hand-off. `getSightById` extends the Phase-2 catalog layer. The Sight Detail route renders the entry (reference photo, stats, Navigate + Log buttons, hint, about, your photos, recent finds). Log find writes via the Phase-2 `logFind`. The Find tab wraps `expo-camera` → nearby-sight picker → the same log composer → success.

**Tech Stack:** expo-router, expo-camera, React Native `Linking`, Jest/RNTL, Phase-2 data layer.

**CLAUDE.md compliance:** honor-system logging exactly as specced (no proximity/verification); Driving reuses the pure URL builder (DRY); Walking shows the in-app map (route polyline deferred as polish — YAGNI); each step is test-first.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for the hex→token mapping. In every component below add `const t = useTheme();` and read tokens. The Log button uses `t.colors.actionPrimary`; Navigate uses `t.colors.actionPositive`; the reference-photo hero uses `t.colors.phBase`. **Found = full color; unfound = hollow** — never an opacity dim.

---

## File Structure

```
travidex/
├─ lib/navigation/externalMaps.ts
├─ lib/data/catalog.ts            # + getSightById
├─ lib/data/finds.ts              # + getRecentFinds
├─ hooks/useSight.ts
├─ app/sight/[id].tsx             # Sight Detail
├─ app/sight/[id]/navigate.tsx    # Navigate (Walking | Driving)
├─ components/LogFindSheet.tsx
├─ app/(tabs)/find.tsx            # camera capture entry
└─ app/find/pick.tsx             # nearby-sight picker → log
```

---

### Task 1: External maps URL builder (pure TDD)

**Files:** Create `lib/navigation/externalMaps.ts`; Test: `lib/navigation/__tests__/externalMaps.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { buildDirectionsUrl } from '../externalMaps';

const dest = { lat: 48.8584, lng: 2.2945 };

it('apple url', () => {
  expect(buildDirectionsUrl('apple', dest)).toBe('http://maps.apple.com/?daddr=48.8584,2.2945&dirflg=d');
});
it('google url', () => {
  expect(buildDirectionsUrl('google', dest)).toBe('https://www.google.com/maps/dir/?api=1&destination=48.8584,2.2945&travelmode=driving');
});
it('waze url', () => {
  expect(buildDirectionsUrl('waze', dest)).toBe('https://waze.com/ul?ll=48.8584,2.2945&navigate=yes');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- externalMaps`
Expected: FAIL — cannot find module `../externalMaps`.

- [ ] **Step 3: Implement**

Create `lib/navigation/externalMaps.ts`:
```ts
export type MapProvider = 'apple' | 'google' | 'waze';
export type LatLng = { lat: number; lng: number };

export function buildDirectionsUrl(provider: MapProvider, d: LatLng): string {
  switch (provider) {
    case 'apple':  return `http://maps.apple.com/?daddr=${d.lat},${d.lng}&dirflg=d`;
    case 'google': return `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}&travelmode=driving`;
    case 'waze':   return `https://waze.com/ul?ll=${d.lat},${d.lng}&navigate=yes`;
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- externalMaps`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add external directions url builder"
```

---

### Task 2: getSightById + getRecentFinds

**Files:** Modify `lib/data/catalog.ts`, `lib/data/finds.ts`; Test: `lib/data/__tests__/sight-detail.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const maybeSingle = jest.fn();
const eqId = jest.fn(() => ({ maybeSingle }));
const selectCatalog = jest.fn(() => ({ eq: eqId }));

const limit = jest.fn();
const orderFinds = jest.fn(() => ({ limit }));
const eqFinds = jest.fn(() => ({ order: orderFinds }));
const selectFinds = jest.fn(() => ({ eq: eqFinds }));

const from = jest.fn((t: string) =>
  t === 'sights' ? { select: selectCatalog } : { select: selectFinds });
jest.mock('../../supabase', () => ({ supabase: { from } }));

import { getSightById } from '../catalog';
import { getRecentFinds } from '../finds';

beforeEach(() => jest.clearAllMocks());

it('getSightById returns one sight', async () => {
  maybeSingle.mockResolvedValue({ data: { id: 's1', name: 'Eiffel Tower' }, error: null });
  const s = await getSightById('s1');
  expect(eqId).toHaveBeenCalledWith('id', 's1');
  expect(s!.name).toBe('Eiffel Tower');
});

it('getRecentFinds returns latest finds for a sight', async () => {
  limit.mockResolvedValue({ data: [{ id: 'f1', comment: 'Found!' }], error: null });
  const finds = await getRecentFinds('s1', 10);
  expect(eqFinds).toHaveBeenCalledWith('sight_id', 's1');
  expect(orderFinds).toHaveBeenCalledWith('found_at', { ascending: false });
  expect(limit).toHaveBeenCalledWith(10);
  expect(finds[0].comment).toBe('Found!');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- sight-detail`
Expected: FAIL — `getSightById`/`getRecentFinds` not exported.

- [ ] **Step 3: Implement**

Append to `lib/data/catalog.ts`:
```ts
export async function getSightById(id: string): Promise<Sight | null> {
  const { data, error } = await supabase
    .from('sights')
    .select(SIGHT_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Sight) ?? null;
}
```

Append to `lib/data/finds.ts`:
```ts
export type RecentFind = { id: string; comment: string | null; found_at: string; user_id: string };

export async function getRecentFinds(sightId: string, limit = 10): Promise<RecentFind[]> {
  const { data, error } = await supabase
    .from('finds')
    .select('id, comment, found_at, user_id')
    .eq('sight_id', sightId)
    .order('found_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as RecentFind[];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- sight-detail`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add getSightById and getRecentFinds"
```

---

### Task 3: useSight hook

**Files:** Create `hooks/useSight.ts`; Test: `hooks/__tests__/useSight.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../lib/data/catalog', () => ({ getSightById: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn(), getRecentFinds: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getSightById } from '../../lib/data/catalog';
import { getFoundSightIds, getRecentFinds } from '../../lib/data/finds';
import { useSight } from '../useSight';

beforeEach(() => jest.clearAllMocks());

it('loads sight, found flag, and recent finds', async () => {
  (getSightById as jest.Mock).mockResolvedValue({ id: 's1', name: 'Tower' });
  (getFoundSightIds as jest.Mock).mockResolvedValue(new Set(['s1']));
  (getRecentFinds as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
  const { result } = renderHook(() => useSight('s1'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.sight!.name).toBe('Tower');
  expect(result.current.found).toBe(true);
  expect(result.current.recentFinds).toHaveLength(1);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- useSight`
Expected: FAIL — cannot find module `../useSight`.

- [ ] **Step 3: Implement**

Create `hooks/useSight.ts`:
```ts
import { useCallback, useEffect, useState } from 'react';
import { getSightById } from '../lib/data/catalog';
import { getFoundSightIds, getRecentFinds, RecentFind } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';
import type { Sight } from '../lib/types';

export function useSight(id: string) {
  const { session } = useAuth();
  const [sight, setSight] = useState<Sight | null>(null);
  const [found, setFound] = useState(false);
  const [recentFinds, setRecentFinds] = useState<RecentFind[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, recent] = await Promise.all([getSightById(id), getRecentFinds(id)]);
    let isFound = false;
    if (session?.user) isFound = (await getFoundSightIds(session.user.id, [id])).has(id);
    setSight(s);
    setRecentFinds(recent);
    setFound(isFound);
    setLoading(false);
  }, [id, session?.user?.id]);

  useEffect(() => { load(); }, [load]);
  return { sight, found, recentFinds, loading, reload: load };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- useSight`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add useSight hook"
```

---

### Task 4: LogFindSheet component

**Files:** Create `components/LogFindSheet.tsx`; Test: `components/__tests__/LogFindSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../lib/data/finds', () => ({ logFind: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { logFind } from '../../lib/data/finds';
import { LogFindSheet } from '../LogFindSheet';

beforeEach(() => jest.clearAllMocks());

it('logs with default "Found!" when comment empty', async () => {
  (logFind as jest.Mock).mockResolvedValue(undefined);
  const onLogged = jest.fn();
  renderWithTheme(<LogFindSheet sightId="s1" onLogged={onLogged} />);
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Found!'));
  expect(onLogged).toHaveBeenCalled();
});

it('logs with the typed comment', async () => {
  (logFind as jest.Mock).mockResolvedValue(undefined);
  renderWithTheme(<LogFindSheet sightId="s1" onLogged={jest.fn()} />);
  fireEvent.changeText(screen.getByPlaceholderText('Add a note (optional)'), 'Amazing at sunset');
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Amazing at sunset'));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- LogFindSheet`
Expected: FAIL — cannot find module `../LogFindSheet`.

- [ ] **Step 3: Implement**

Create `components/LogFindSheet.tsx`:
```tsx
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { logFind } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';

export function LogFindSheet({ sightId, onLogged }: { sightId: string; onLogged: () => void }) {
  const t = useTheme();
  const { session } = useAuth();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!session?.user) return;
    setBusy(true);
    setError(null);
    try {
      await logFind(session.user.id, sightId, comment.trim() || 'Found!');
      onLogged();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: t.spacing.s5, backgroundColor: t.colors.surface1, borderRadius: t.radii.md }}>
      <TextInput
        placeholder="Add a note (optional)"
        placeholderTextColor={t.colors.text3}
        value={comment}
        onChangeText={setComment}
        style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }]}
      />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      {/* Log = the primary amber action */}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPrimary, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Log find</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- LogFindSheet`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add LogFindSheet"
```

---

### Task 5: Sight Detail screen

**Files:** Create `app/sight/[id].tsx`; Test: `app/__tests__/sight-detail-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }), useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useSight } from '../../hooks/useSight';
import SightDetail from '../sight/[id]';

beforeEach(() => jest.clearAllMocks());

it('renders the entry and routes to navigate', () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'], about: 'Tower', hint: 'South side', access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  renderWithTheme(<SightDetail />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('Easy')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Navigate'));
  expect(push).toHaveBeenCalledWith('/sight/s1/navigate');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- sight-detail-screen`
Expected: FAIL — cannot find module `sight/[id]`.

- [ ] **Step 3: Implement**

Create `app/sight/[id].tsx`:
```tsx
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useSight } from '../../hooks/useSight';
import { LogFindSheet } from '../../components/LogFindSheet';

export default function SightDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, found, recentFinds, loading, reload } = useSight(id!);

  if (loading || !sight) return <View style={{ flex: 1, backgroundColor: t.colors.bg }} />;

  const Stat = ({ label, value }: { label: string; value: string | null }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={[t.type.stat, { color: t.colors.text1 }]}>{value ?? '—'}</Text>
      <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ height: 160, backgroundColor: t.colors.phBase, justifyContent: 'flex-end', padding: t.spacing.s4 }}>
        <Text style={[t.type.label, { color: t.colors.text3 }]}>Reference — what to look for</Text>
      </View>
      <View style={{ padding: t.spacing.s5, gap: t.spacing.s4 }}>
        <Text style={[t.type.h1, { color: t.colors.text1 }]}>{sight.name}</Text>
        <Text style={[t.type.caption, { color: t.colors.info }]}>{sight.type_tags.join(' · ')}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: t.spacing.s3 }}>
          <Stat label="Access" value={sight.access} />
          <Stat label="Size" value={sight.size} />
          <Stat label="Busyness" value={sight.busyness} />
        </View>

        <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
          <Pressable onPress={() => router.push(`/sight/${sight.id}/navigate`)} style={{ flex: 1, backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
            <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Navigate</Text>
          </Pressable>
        </View>

        {!found && <LogFindSheet sightId={sight.id} onLogged={reload} />}

        {sight.hint && <Text style={[t.type.body, { color: t.colors.text2 }]}>💡 {sight.hint}</Text>}
        {sight.about && <Text style={[t.type.body, { color: t.colors.text2 }]}>{sight.about}</Text>}

        <Text style={[t.type.label, { color: t.colors.text3 }]}>Recent finds</Text>
        {recentFinds.map(f => (
          <Text key={f.id} style={[t.type.body, { color: t.colors.text2 }]}>{f.comment ?? 'Found!'}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- sight-detail-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Sight Detail screen"
```

---

### Task 6: Navigate screen (Walking | Driving)

**Files:** Create `app/sight/[id]/navigate.tsx`; Test: `app/__tests__/navigate-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('expo-router', () => ({ useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
const openURL = jest.fn(() => Promise.resolve());
jest.mock('react-native/Libraries/Linking/Linking', () => ({ openURL }));
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useSight } from '../../hooks/useSight';
import Navigate from '../sight/[id]/navigate';

beforeEach(() => jest.clearAllMocks());

it('opens Google Maps directions on Driving → Google', () => {
  (useSight as jest.Mock).mockReturnValue({ sight: { id: 's1', name: 'Tower', lat: 48.8584, lng: 2.2945 }, loading: false });
  renderWithTheme(<Navigate />);
  fireEvent.press(screen.getByText('Driving'));
  fireEvent.press(screen.getByText('Google Maps'));
  expect(openURL).toHaveBeenCalledWith('https://www.google.com/maps/dir/?api=1&destination=48.8584,2.2945&travelmode=driving');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- navigate-screen`
Expected: FAIL — cannot find module `navigate`.

- [ ] **Step 3: Implement**

Create `app/sight/[id]/navigate.tsx`:
```tsx
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useSight } from '../../../hooks/useSight';
import { SightPin } from '../../../components/SightPin';
import { buildDirectionsUrl, MapProvider } from '../../../lib/navigation/externalMaps';

export default function Navigate() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, loading } = useSight(id!);
  const [mode, setMode] = useState<'walking' | 'driving'>('walking');

  if (loading || !sight) return <View style={{ flex: 1, backgroundColor: t.colors.bg }} />;

  const drive = (provider: MapProvider) =>
    Linking.openURL(buildDirectionsUrl(provider, { lat: sight.lat, lng: sight.lng }));

  const Tab = ({ k, label }: { k: 'walking' | 'driving'; label: string }) => (
    <Pressable onPress={() => setMode(k)} style={{ paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s5, backgroundColor: mode === k ? t.colors.actionPositive : t.colors.surface2, borderRadius: t.radii.lg }}>
      <Text style={[t.type.body, { color: mode === k ? t.colors.textOnAccent : t.colors.text1 }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flexDirection: 'row', gap: t.spacing.s3, padding: t.spacing.s4 }}>
        <Tab k="walking" label="Walking" />
        <Tab k="driving" label="Driving" />
      </View>
      {mode === 'walking' ? (
        <MapView style={{ flex: 1 }} testID="map-view">
          <SightPin sight={{ ...sight, found: true } as any} onPress={() => {}} />
        </MapView>
      ) : (
        <View style={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
          <Text style={[t.type.body, { color: t.colors.text2 }]}>Open directions in:</Text>
          {(['apple', 'google', 'waze'] as MapProvider[]).map(p => (
            <Pressable key={p} onPress={() => drive(p)} style={{ backgroundColor: t.colors.surface2, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
              <Text style={[t.type.body, { color: t.colors.text1 }]}>{p === 'apple' ? 'Apple Maps' : p === 'google' ? 'Google Maps' : 'Waze'}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- navigate-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Navigate screen with walking/driving"
```

---

### Task 7: Find tab — camera capture → picker → log → success

**Files:** Modify `app/(tabs)/find.tsx`; Create `app/find/pick.tsx`; Test: `app/__tests__/find-pick.test.tsx`

- [ ] **Step 1: Install camera**

```bash
npx expo install expo-camera
```
Add to `app.json` plugins: `["expo-camera", { "cameraPermission": "Travidex uses your camera to photograph sights you find." }]`.

- [ ] **Step 2: Write the failing test** (the picker logs + advances; camera screen is a thin wrapper)

Create `app/__tests__/find-pick.test.tsx`:
```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ logFind: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { logFind } from '../../lib/data/finds';
import Pick from '../find/pick';

beforeEach(() => jest.clearAllMocks());

it('lists nearby sights and logs the chosen one', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [{ id: 's1', dex_no: 1, name: 'Tower', found: false }], loading: false, reload: jest.fn(),
  });
  (logFind as jest.Mock).mockResolvedValue(undefined);
  renderWithTheme(<Pick />);
  fireEvent.press(screen.getByText('Tower'));        // select sight
  fireEvent.press(screen.getByText('Log find'));      // confirm in composer
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Found!'));
  expect(push).toHaveBeenCalledWith('/find/success');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- find-pick`
Expected: FAIL — cannot find module `find/pick`.

- [ ] **Step 4: Implement**

Create `app/find/pick.tsx`:
```tsx
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';
import { LogFindSheet } from '../../components/LogFindSheet';

export default function Pick() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { sights } = useCityCatalog(cityId);
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.bg, justifyContent: 'center', padding: t.spacing.s5 }}>
        <LogFindSheet sightId={selected} onLogged={() => router.push('/find/success')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <FlatList
        data={sights}
        keyExtractor={s => s.id}
        renderItem={({ item }) => <SightRow sight={item} onPress={setSelected} />}
      />
    </View>
  );
}
```

Replace `app/(tabs)/find.tsx` (camera → picker):
```tsx
import { Pressable, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';

export default function Find() {
  const t = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.bg, alignItems: 'center', justifyContent: 'center', gap: t.spacing.s4 }}>
        <Text style={[t.type.body, { color: t.colors.text2 }]}>Travidex needs your camera to log finds.</Text>
        <Pressable onPress={requestPermission} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
          <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Enable camera</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/find/pick')}><Text style={[t.type.body, { color: t.colors.text3 }]}>Skip & pick a sight</Text></Pressable>
      </View>
    );
  }

  // Camera chrome is intentionally fixed black viewfinder + white shutter (not themed).
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView style={{ flex: 1 }} />
      <Pressable onPress={() => router.push('/find/pick')} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', width: 70, height: 70, borderRadius: 35 }} />
    </View>
  );
}
```

Create `app/find/success.tsx`:
```tsx
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';

export default function Success() {
  const t = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, alignItems: 'center', justifyContent: 'center', gap: t.spacing.s4 }}>
      <Text style={[t.type.h1, { color: t.colors.green }]}>Added to your dex!</Text>
      <Pressable onPress={() => router.replace('/(tabs)/map')} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Done</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- find-pick`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Find capture, picker, log, success flow"
```

---

## Phase 4 Done — Definition of Done

- `npm test` green; URL builder, `getSightById`/`getRecentFinds`, `useSight`, `LogFindSheet`, Sight Detail, Navigate, and the Find flow are covered.
- A user can open a sight, hand off Driving to Apple/Google/Waze, and log an honor-system find that brightens the entry and appears in recent finds.
