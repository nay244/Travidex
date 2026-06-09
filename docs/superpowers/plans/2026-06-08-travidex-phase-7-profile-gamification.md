# Travidex Phase 7 — Profile & Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Profile tab — completion + find-count stats, badges (earned/locked), a photo-journal of the user's photos, and settings (location toggle, sign out, delete account). Badges are awarded lazily when Profile loads, so the find flow stays untouched.

**Architecture:** Pure `stats` and `badges` modules compute everything from the Phase-5 progress maps + a find count — no new business logic in the find path (surgical). Data wrappers award/read badges and read/upload user photos (Supabase Storage). Screens compose these. Account deletion uses a service-role Edge Function.

**Tech Stack:** TypeScript, Supabase Storage + Edge Functions, expo-image-picker, expo-location, Jest/RNTL.

**CLAUDE.md compliance:** v1 badges only (no leaderboards — explicitly deferred); badge evaluation is pure + tested; awarding happens on Profile load (no change to Phase-4 logging); test-first for all logic.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for the hex→token mapping. Stat values use `t.type.statXl`/`t.type.stat` (mono); **earned badges = full color, locked = hollow** (outline + `t.colors.text3`), never an opacity dim. Read all other colors from tokens.

---

## File Structure

```
travidex/
├─ lib/stats.ts                     # pure computeStats
├─ lib/badges.ts                    # pure badge catalog + evaluate
├─ lib/data/badges.ts              # awardBadges, getUserBadges
├─ lib/data/finds.ts               # + getUserFindCount
├─ lib/data/photos.ts              # getUserPhotos, uploadUserPhoto
├─ hooks/useProfile.ts             # loads stats + awards badges
├─ components/YourPhotos.tsx        # gallery + add (used on Sight Detail)
├─ app/(tabs)/profile.tsx
├─ app/profile/badges.tsx
├─ app/profile/journal.tsx
├─ app/profile/settings.tsx
└─ supabase/functions/delete-account/index.ts
```

---

### Task 1: Pure stats

**Files:** Create `lib/stats.ts`; Test: `lib/__tests__/stats.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { computeStats } from '../stats';

const city = new Map([['c1', { found: 3, total: 3 }], ['c2', { found: 1, total: 4 }]]);
const country = new Map([['k1', { found: 4, total: 7 }], ['k2', { found: 0, total: 5 }]]);

it('computes finds, claimed cities, explored countries', () => {
  const s = computeStats(city, country, 4);
  expect(s.totalFinds).toBe(4);
  expect(s.citiesClaimed).toBe(1);       // c1 only
  expect(s.countriesExplored).toBe(1);   // k1 has finds
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- stats`
Expected: FAIL — cannot find module `../stats`.

- [ ] **Step 3: Implement**

Create `lib/stats.ts`:
```ts
import type { Progress } from './data/progress';
import { isClaimed } from './claim';

export type Stats = { totalFinds: number; citiesClaimed: number; countriesExplored: number };

export function computeStats(city: Map<string, Progress>, country: Map<string, Progress>, totalFinds: number): Stats {
  let citiesClaimed = 0;
  for (const p of city.values()) if (isClaimed(p.found, p.total)) citiesClaimed++;
  let countriesExplored = 0;
  for (const p of country.values()) if (p.found > 0) countriesExplored++;
  return { totalFinds, citiesClaimed, countriesExplored };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- stats`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add pure stats compute"
```

---

### Task 2: Pure badge catalog + evaluation

**Files:** Create `lib/badges.ts`; Test: `lib/__tests__/badges.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { BADGES, evaluateBadges } from '../badges';

it('catalog has stable codes and labels', () => {
  expect(BADGES.map(b => b.code)).toEqual(['first_find', 'finds_10', 'finds_50', 'city_claimed', 'countries_5']);
});

it('awards first_find and city_claimed appropriately', () => {
  const earned = evaluateBadges({ totalFinds: 3, citiesClaimed: 1, countriesExplored: 1 });
  expect(earned).toContain('first_find');
  expect(earned).toContain('city_claimed');
  expect(earned).not.toContain('finds_10');
});

it('awards find milestones', () => {
  expect(evaluateBadges({ totalFinds: 50, citiesClaimed: 0, countriesExplored: 0 }))
    .toEqual(expect.arrayContaining(['first_find', 'finds_10', 'finds_50']));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- badges`
Expected: FAIL — cannot find module `../badges`.

- [ ] **Step 3: Implement**

Create `lib/badges.ts`:
```ts
import type { Stats } from './stats';

export type Badge = { code: string; label: string; test: (s: Stats) => boolean };

export const BADGES: Badge[] = [
  { code: 'first_find', label: 'First Find', test: s => s.totalFinds >= 1 },
  { code: 'finds_10', label: '10 Sights', test: s => s.totalFinds >= 10 },
  { code: 'finds_50', label: '50 Sights', test: s => s.totalFinds >= 50 },
  { code: 'city_claimed', label: 'City Claimed', test: s => s.citiesClaimed >= 1 },
  { code: 'countries_5', label: '5 Countries', test: s => s.countriesExplored >= 5 },
];

export function evaluateBadges(s: Stats): string[] {
  return BADGES.filter(b => b.test(s)).map(b => b.code);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- badges`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add badge catalog and evaluation"
```

---

### Task 3: Badge + find-count data-access

**Files:** Create `lib/data/badges.ts`; Modify `lib/data/finds.ts`; Test: `lib/data/__tests__/badges-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const upsert = jest.fn();
const order = jest.fn();
const eqBadge = jest.fn(() => ({ order }));
const selectBadge = jest.fn(() => ({ eq: eqBadge }));

const headEq = jest.fn();
const selectCount = jest.fn(() => ({ eq: headEq }));

const from = jest.fn((t: string) =>
  t === 'user_badges' ? { upsert, select: selectBadge } : { select: selectCount });
jest.mock('../../supabase', () => ({ supabase: { from } }));

import { awardBadges, getUserBadges } from '../badges';
import { getUserFindCount } from '../finds';

beforeEach(() => jest.clearAllMocks());

it('awardBadges upserts rows ignoring duplicates', async () => {
  upsert.mockResolvedValue({ error: null });
  await awardBadges('u1', ['first_find', 'finds_10']);
  expect(upsert).toHaveBeenCalledWith(
    [{ user_id: 'u1', badge_code: 'first_find' }, { user_id: 'u1', badge_code: 'finds_10' }],
    { onConflict: 'user_id,badge_code', ignoreDuplicates: true },
  );
});

it('getUserBadges returns earned codes', async () => {
  order.mockResolvedValue({ data: [{ badge_code: 'first_find' }], error: null });
  await expect(getUserBadges('u1')).resolves.toEqual(['first_find']);
});

it('getUserFindCount returns the count', async () => {
  headEq.mockResolvedValue({ count: 7, error: null });
  await expect(getUserFindCount('u1')).resolves.toBe(7);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- badges-data`
Expected: FAIL — modules/exports missing.

- [ ] **Step 3: Implement**

Create `lib/data/badges.ts`:
```ts
import { supabase } from '../supabase';

export async function awardBadges(userId: string, codes: string[]): Promise<void> {
  if (codes.length === 0) return;
  const rows = codes.map(badge_code => ({ user_id: userId, badge_code }));
  const { error } = await supabase
    .from('user_badges')
    .upsert(rows, { onConflict: 'user_id,badge_code', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function getUserBadges(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_code')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { badge_code: string }) => r.badge_code);
}
```

Append to `lib/data/finds.ts`:
```ts
export async function getUserFindCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('finds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- badges-data`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add badge + find-count data-access"
```

---

### Task 4: useProfile hook (loads stats, awards badges lazily)

**Files:** Create `hooks/useProfile.ts`; Test: `hooks/__tests__/useProfile.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn(), getCountryProgress: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getUserFindCount: jest.fn() }));
jest.mock('../../lib/data/badges', () => ({ awardBadges: jest.fn(), getUserBadges: jest.fn() }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getCityProgress, getCountryProgress } from '../../lib/data/progress';
import { getUserFindCount } from '../../lib/data/finds';
import { awardBadges, getUserBadges } from '../../lib/data/badges';
import { useProfile } from '../useProfile';

beforeEach(() => jest.clearAllMocks());

it('computes stats and awards newly-earned badges', async () => {
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 3, total: 3 }]]));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 3, total: 3 }]]));
  (getUserFindCount as jest.Mock).mockResolvedValue(3);
  (getUserBadges as jest.Mock).mockResolvedValue(['first_find', 'city_claimed']);
  const { result } = renderHook(() => useProfile());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.stats.totalFinds).toBe(3);
  expect(result.current.stats.citiesClaimed).toBe(1);
  expect(awardBadges).toHaveBeenCalledWith('u1', expect.arrayContaining(['first_find', 'city_claimed']));
  expect(result.current.earnedBadges).toEqual(['first_find', 'city_claimed']);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- useProfile`
Expected: FAIL — cannot find module `../useProfile`.

- [ ] **Step 3: Implement**

Create `hooks/useProfile.ts`:
```ts
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { getCityProgress, getCountryProgress } from '../lib/data/progress';
import { getUserFindCount } from '../lib/data/finds';
import { awardBadges, getUserBadges } from '../lib/data/badges';
import { computeStats, Stats } from '../lib/stats';
import { evaluateBadges } from '../lib/badges';

const EMPTY: Stats = { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0 };

export function useProfile() {
  const { session } = useAuth();
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!session?.user) return;
      const uid = session.user.id;
      const [city, country, count] = await Promise.all([
        getCityProgress(uid), getCountryProgress(uid), getUserFindCount(uid),
      ]);
      const s = computeStats(city, country, count);
      setStats(s);
      await awardBadges(uid, evaluateBadges(s));
      setEarnedBadges(await getUserBadges(uid));
      setLoading(false);
    })();
  }, [session?.user?.id]);

  return { stats, earnedBadges, loading };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- useProfile`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add useProfile hook with lazy badge awarding"
```

---

### Task 5: Profile screen

**Files:** Replace `app/(tabs)/profile.tsx`; Test: `app/__tests__/profile-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import Profile from '../(tabs)/profile';

beforeEach(() => jest.clearAllMocks());

it('shows stats and links to settings', () => {
  (useProfile as jest.Mock).mockReturnValue({ stats: { totalFinds: 12, citiesClaimed: 2, countriesExplored: 1 }, earnedBadges: ['first_find'], loading: false });
  renderWithTheme(<Profile />);
  expect(screen.getByText('12')).toBeOnTheScreen();   // finds
  expect(screen.getByText('Sights found')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Settings'));
  expect(push).toHaveBeenCalledWith('/profile/settings');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- profile-screen`
Expected: FAIL — placeholder renders only "Profile".

- [ ] **Step 3: Implement**

Replace `app/(tabs)/profile.tsx`:
```tsx
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useProfile } from '../../hooks/useProfile';

export default function Profile() {
  const t = useTheme();
  const router = useRouter();
  const { stats, earnedBadges } = useProfile();

  const Stat = ({ value, label }: { value: number; label: string }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{value}</Text>
      <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
    </View>
  );
  const Link = ({ label, to }: { label: string; to: string }) => (
    <Pressable onPress={() => router.push(to as any)} style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
      <Text style={[t.type.body, { color: t.colors.text1 }]}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: t.spacing.s7 }}>
        <Stat value={stats.totalFinds} label="Sights found" />
        <Stat value={stats.citiesClaimed} label="Cities claimed" />
        <Stat value={stats.countriesExplored} label="Countries" />
        <Stat value={earnedBadges.length} label="Badges" />
      </View>
      <Link label="Badges" to="/profile/badges" />
      <Link label="Photo journal" to="/profile/journal" />
      <Link label="Settings" to="/profile/settings" />
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- profile-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Profile screen"
```

---

### Task 6: Badges screen

**Files:** Create `app/profile/badges.tsx`; Test: `app/__tests__/badges-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/badges', () => ({ getUserBadges: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getUserBadges } from '../../lib/data/badges';
import Badges from '../profile/badges';

beforeEach(() => jest.clearAllMocks());

it('marks earned vs locked from the catalog', async () => {
  (getUserBadges as jest.Mock).mockResolvedValue(['first_find']);
  renderWithTheme(<Badges />);
  await waitFor(() => expect(screen.getByText('First Find')).toBeOnTheScreen());
  expect(screen.getByTestId('badge-first_find-earned')).toBeOnTheScreen();
  expect(screen.getByTestId('badge-finds_50-locked')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- badges-screen`
Expected: FAIL — cannot find module `profile/badges`.

- [ ] **Step 3: Implement**

Create `app/profile/badges.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { BADGES } from '../../lib/badges';
import { getUserBadges } from '../../lib/data/badges';

export default function Badges() {
  const t = useTheme();
  const { session } = useAuth();
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) getUserBadges(session.user.id).then(setEarned);
  }, [session?.user?.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
      {BADGES.map(b => {
        const has = earned.includes(b.code);
        // earned = full color; locked = HOLLOW (transparent fill + outline), never opacity-dim
        return (
          <View key={b.code} testID={`badge-${b.code}-${has ? 'earned' : 'locked'}`}
            style={{ padding: t.spacing.s5, borderRadius: t.radii.sm,
              backgroundColor: has ? t.colors.foundBg : 'transparent',
              borderWidth: has ? 0 : 1, borderColor: t.colors.locked }}>
            <Text style={[t.type.h3, { color: has ? t.colors.text1 : t.colors.text3 }]}>{b.label}</Text>
            <Text style={[t.type.label, { color: has ? t.colors.green : t.colors.text3 }]}>{has ? 'Earned' : 'Locked'}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- badges-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Badges screen"
```

---

### Task 7: Photo data-access + journal screen

**Files:** Create `lib/data/photos.ts`, `app/profile/journal.tsx`; Test: `lib/data/__tests__/photos.test.ts`, `app/__tests__/journal-screen.test.tsx`

> Prerequisite (manual, once): create a public Storage bucket named `user-photos` in the Supabase dashboard (Storage → New bucket → public).

- [ ] **Step 1: Write the failing tests**

`lib/data/__tests__/photos.test.ts`:
```ts
const order = jest.fn();
const eq = jest.fn(() => ({ order }));
const select = jest.fn(() => ({ eq }));
const insert = jest.fn();
const from = jest.fn(() => ({ select, insert }));
const uploadFn = jest.fn();
const getPublicUrl = jest.fn(() => ({ data: { publicUrl: 'https://cdn/x.jpg' } }));
const storageFrom = jest.fn(() => ({ upload: uploadFn, getPublicUrl }));
jest.mock('../../supabase', () => ({ supabase: { from, storage: { from: storageFrom } } }));

import { getUserPhotos, uploadUserPhoto } from '../photos';

beforeEach(() => jest.clearAllMocks());

it('getUserPhotos returns the user photos', async () => {
  order.mockResolvedValue({ data: [{ id: 'p1', photo_url: 'u' }], error: null });
  const rows = await getUserPhotos('u1');
  expect(eq).toHaveBeenCalledWith('user_id', 'u1');
  expect(rows[0].photo_url).toBe('u');
});

it('uploadUserPhoto uploads then inserts a row with the public url', async () => {
  uploadFn.mockResolvedValue({ data: { path: 'u1/s1/123.jpg' }, error: null });
  insert.mockResolvedValue({ error: null });
  const blob = {} as any;
  await uploadUserPhoto('u1', 's1', blob, '123.jpg');
  expect(storageFrom).toHaveBeenCalledWith('user-photos');
  expect(uploadFn).toHaveBeenCalledWith('u1/s1/123.jpg', blob, { contentType: 'image/jpeg' });
  expect(insert).toHaveBeenCalledWith({ user_id: 'u1', sight_id: 's1', photo_url: 'https://cdn/x.jpg' });
});
```

`app/__tests__/journal-screen.test.tsx`:
```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getUserPhotos } from '../../lib/data/photos';
import Journal from '../profile/journal';

beforeEach(() => jest.clearAllMocks());

it('shows a photo count', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([{ id: 'p1', photo_url: 'u', sight_id: 's1' }]);
  renderWithTheme(<Journal />);
  await waitFor(() => expect(screen.getByText('1 photo')).toBeOnTheScreen());
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- photos` then `npm test -- journal-screen`
Expected: FAIL — modules missing.

- [ ] **Step 3: Implement**

Create `lib/data/photos.ts`:
```ts
import { supabase } from '../supabase';

export type UserPhoto = { id: string; sight_id: string; photo_url: string };

export async function getUserPhotos(userId: string): Promise<UserPhoto[]> {
  const { data, error } = await supabase
    .from('user_photos')
    .select('id, sight_id, photo_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as UserPhoto[];
}

export async function uploadUserPhoto(userId: string, sightId: string, blob: Blob, fileName: string): Promise<void> {
  const path = `${userId}/${sightId}/${fileName}`;
  const { error: upErr } = await supabase.storage.from('user-photos').upload(path, blob, { contentType: 'image/jpeg' });
  if (upErr) throw new Error(upErr.message);
  const { data } = supabase.storage.from('user-photos').getPublicUrl(path);
  const { error } = await supabase.from('user_photos').insert({ user_id: userId, sight_id: sightId, photo_url: data.publicUrl });
  if (error) throw new Error(error.message);
}
```

Create `app/profile/journal.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getUserPhotos, UserPhoto } from '../../lib/data/photos';

export default function Journal() {
  const t = useTheme();
  const { session } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    if (session?.user) getUserPhotos(session.user.id).then(setPhotos);
  }, [session?.user?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.caption, { color: t.colors.text2, padding: t.spacing.s5 }]}>{`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}</Text>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <Image source={{ uri: item.photo_url }} style={{ width: '33%', aspectRatio: 1, margin: 1 }} />}
      />
    </View>
  );
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npm test -- photos` then `npm test -- journal-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add photos data-access and journal screen"
```

---

### Task 8: Add-photo to a sight (Your Photos)

**Files:** Create `components/YourPhotos.tsx`; Modify `app/sight/[id].tsx`; Test: `components/__tests__/YourPhotos.test.tsx`

- [ ] **Step 1: Install image picker**

```bash
npx expo install expo-image-picker
```

- [ ] **Step 2: Write the failing test**

```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn(), uploadUserPhoto: jest.fn() }));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import * as Picker from 'expo-image-picker';
import { uploadUserPhoto, getUserPhotos } from '../../lib/data/photos';
import { YourPhotos } from '../YourPhotos';

beforeEach(() => jest.clearAllMocks());

it('picks an image and uploads it for the sight', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([]);
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false, assets: [{ uri: 'file://photo.jpg', fileName: 'photo.jpg' }],
  });
  // mock global fetch → blob
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve({} as Blob) });
  (uploadUserPhoto as jest.Mock).mockResolvedValue(undefined);

  renderWithTheme(<YourPhotos sightId="s1" />);
  fireEvent.press(screen.getByText('+ Add photo'));
  await waitFor(() => expect(uploadUserPhoto).toHaveBeenCalledWith('u1', 's1', expect.anything(), 'photo.jpg'));
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- YourPhotos`
Expected: FAIL — cannot find module `../YourPhotos`.

- [ ] **Step 4: Implement**

Create `components/YourPhotos.tsx`:
```tsx
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme';
import { useAuth } from '../context/AuthProvider';
import { getUserPhotos, uploadUserPhoto, UserPhoto } from '../lib/data/photos';

export function YourPhotos({ sightId }: { sightId: string }) {
  const t = useTheme();
  const { session } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const refresh = useCallback(async () => {
    if (session?.user) setPhotos((await getUserPhotos(session.user.id)).filter(p => p.sight_id === sightId));
  }, [session?.user?.id, sightId]);

  useEffect(() => { refresh(); }, [refresh]);

  async function add() {
    if (!session?.user) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (res.canceled) return;
    const asset = res.assets[0];
    const blob = await (await fetch(asset.uri)).blob();
    await uploadUserPhoto(session.user.id, sightId, blob, asset.fileName ?? `${Date.now()}.jpg`);
    await refresh();
  }

  return (
    <View>
      <Text style={[t.type.label, { color: t.colors.text3, marginBottom: t.spacing.s2 }]}>Your photos</Text>
      <ScrollView horizontal>
        {photos.map(p => <Image key={p.id} source={{ uri: p.photo_url }} style={{ width: 64, height: 64, borderRadius: t.radii.xs, marginRight: t.spacing.s2 }} />)}
        <Pressable onPress={add} style={{ width: 64, height: 64, borderRadius: t.radii.xs, backgroundColor: t.colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[t.type.caption, { color: t.colors.text3 }]}>+ Add photo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
```

Modify `app/sight/[id].tsx` — add the import and render it under the About section (single insertion):
```tsx
import { YourPhotos } from '../../components/YourPhotos';
// ...inside the content View, after the about Text:
{found && <YourPhotos sightId={sight.id} />}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- YourPhotos`
Expected: PASS. Then `npm test -- sight-detail-screen` still PASS (the added element renders only when `found`, which is false in that test).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Your Photos upload on sight detail"
```

---

### Task 9: Settings screen + delete-account function

**Files:** Create `app/profile/settings.tsx`, `supabase/functions/delete-account/index.ts`; Test: `app/__tests__/settings-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const replace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace }) }));
const signOut = jest.fn(() => Promise.resolve());
const invoke = jest.fn(() => Promise.resolve({ error: null }));
jest.mock('../../lib/supabase', () => ({ supabase: { auth: { signOut }, functions: { invoke } } }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import Settings from '../profile/settings';

beforeEach(() => jest.clearAllMocks());

it('signs out', async () => {
  renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Sign out'));
  await waitFor(() => expect(signOut).toHaveBeenCalled());
});

it('deletes the account via the edge function', async () => {
  renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Delete account'));
  await waitFor(() => expect(invoke).toHaveBeenCalledWith('delete-account'));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- settings-screen`
Expected: FAIL — cannot find module `profile/settings`.

- [ ] **Step 3: Implement**

Create `app/profile/settings.tsx`:
```tsx
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/theme';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const t = useTheme();
  const [locationOn, setLocationOn] = useState(false);

  async function toggleLocation(next: boolean) {
    if (next) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationOn(status === 'granted');
    } else {
      setLocationOn(false); // OS-level revoke happens in Settings app; we just stop using it
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, padding: t.spacing.s5, gap: t.spacing.s5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[t.type.body, { color: t.colors.text1 }]}>Use location</Text>
        <Switch value={locationOn} onValueChange={toggleLocation} />
      </View>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text style={[t.type.body, { color: t.colors.info }]}>Sign out</Text>
      </Pressable>
      <Pressable onPress={() => supabase.functions.invoke('delete-account')}>
        <Text style={[t.type.body, { color: t.colors.danger }]}>Delete account</Text>
      </Pressable>
    </View>
  );
}
```

Create `supabase/functions/delete-account/index.ts`:
```ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData.user) return new Response('unauthorized', { status: 401 });

  await admin.auth.admin.deleteUser(userData.user.id); // cascades via FKs
  return new Response('ok');
});
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- settings-screen`
Expected: PASS — 2 tests.

- [ ] **Step 5: Full suite + manual smoke**

Run: `npm test`
Expected: ALL suites pass.
Run: `npx expo start --ios` → sign in, log a find, open Profile → stats update, a badge appears; open Settings → sign out works. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Settings screen and delete-account function"
```

---

## Phase 7 Done — Definition of Done

- `npm test` green across the whole app.
- Profile shows live stats; badges auto-award on load (find path untouched); badges screen shows earned/locked; photo journal + per-sight photo upload work; settings handle location toggle, sign out, and account deletion.
- **All 7 phases complete → Travidex MVP per the spec.**
```
