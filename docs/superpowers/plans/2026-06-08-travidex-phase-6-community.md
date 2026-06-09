# Travidex Phase 6 — Community & Moderation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users submit new sights (moderated) and browse a finds feed. Submissions land as `pending`, an admin-run Edge Function approves them into the curated `sights` table, and users see their submission status.

**Architecture:** A `get_feed` RPC joins finds→sights→profiles for the activity feed. A `community` data module inserts submissions (RLS forces `pending`) and reads the user's submissions. The Submit screen captures fields + a map-pin location (defaulting to the active city center). Approval is a Supabase Edge Function running with the service role (admin-invoked) — outside the consumer app surface, matching the spec's "moderated."

**Tech Stack:** Postgres RPC, Supabase Edge Functions (Deno), react-native-maps, TypeScript, Jest/RNTL.

**CLAUDE.md compliance:** only submit + feed + status (no in-app admin UI, no likes/comments — not in v1 spec); RLS is the security boundary; moderation logic kept server-side; test-first for all client logic.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for the hex→token mapping. Submission status uses tokens: approved `t.colors.green`, rejected `t.colors.danger`, pending `t.colors.progress`. Read all other colors from tokens.

---

## File Structure

```
travidex/
├─ supabase/migrations/0008_feed_rpc.sql
├─ supabase/functions/moderate/index.ts     # admin approve/reject (service role)
├─ lib/data/community.ts                     # submitSight, getMySubmissions
├─ lib/data/feed.ts                          # getFeed
├─ app/(tabs)/community.tsx                  # feed + links
├─ app/community/submit.tsx
└─ app/community/mine.tsx
```

---

### Task 1: Feed RPC

**Files:** Create `supabase/migrations/0008_feed_rpc.sql`

- [ ] **Step 1: Write the migration**

```sql
create or replace function get_feed(p_limit int default 30)
returns table(id uuid, comment text, found_at timestamptz, sight_name text, username text)
language sql stable as $$
  select f.id, f.comment, f.found_at, s.name as sight_name, p.username
  from finds f
  join sights s on s.id = f.sight_id
  left join profiles p on p.user_id = f.user_id
  order by f.found_at desc
  limit p_limit;
$$;
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db reset`
Run: `npx supabase db query "select * from get_feed(5);"`
Expected: runs without error (0 rows until finds exist).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(db): get_feed rpc"
```

---

### Task 2: Community data-access

**Files:** Create `lib/data/community.ts`; Test: `lib/data/__tests__/community.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const insert = jest.fn();
const order = jest.fn();
const eq = jest.fn(() => ({ order }));
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ insert, select }));
jest.mock('../../supabase', () => ({ supabase: { from } }));

import { submitSight, getMySubmissions } from '../community';

beforeEach(() => jest.clearAllMocks());

it('submitSight inserts a pending submission with EWKT location', async () => {
  insert.mockResolvedValue({ error: null });
  await submitSight('u1', { name: 'Hidden Cafe', cityId: 'c1', typeTags: ['Food'], about: null, hint: null, lat: 48.85, lng: 2.29 });
  expect(from).toHaveBeenCalledWith('community_submissions');
  expect(insert).toHaveBeenCalledWith({
    user_id: 'u1', city_id: 'c1', name: 'Hidden Cafe', type_tags: ['Food'],
    about: null, hint: null, location: 'SRID=4326;POINT(2.29 48.85)',
  });
});

it('getMySubmissions returns the user rows newest first', async () => {
  order.mockResolvedValue({ data: [{ id: 'sub1', status: 'pending' }], error: null });
  const rows = await getMySubmissions('u1');
  expect(eq).toHaveBeenCalledWith('user_id', 'u1');
  expect(order).toHaveBeenCalledWith('created_at', { ascending: false });
  expect(rows[0].status).toBe('pending');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/community`
Expected: FAIL — cannot find module `../community`.

- [ ] **Step 3: Implement**

Create `lib/data/community.ts`:
```ts
import { supabase } from '../supabase';

export type SubmitInput = {
  name: string; cityId: string; typeTags: string[];
  about: string | null; hint: string | null; lat: number; lng: number;
};
export type Submission = { id: string; name: string; status: 'pending' | 'approved' | 'rejected'; reject_reason: string | null; created_at: string };

export async function submitSight(userId: string, input: SubmitInput) {
  const { error } = await supabase.from('community_submissions').insert({
    user_id: userId,
    city_id: input.cityId,
    name: input.name,
    type_tags: input.typeTags,
    about: input.about,
    hint: input.hint,
    location: `SRID=4326;POINT(${input.lng} ${input.lat})`,
  });
  if (error) throw new Error(error.message);
}

export async function getMySubmissions(userId: string): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('community_submissions')
    .select('id, name, status, reject_reason, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Submission[];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- data/community`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add community submissions data-access"
```

---

### Task 3: Feed data-access

**Files:** Create `lib/data/feed.ts`; Test: `lib/data/__tests__/feed.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
const rpc = jest.fn();
jest.mock('../../supabase', () => ({ supabase: { rpc } }));
import { getFeed } from '../feed';

beforeEach(() => jest.clearAllMocks());

it('returns feed rows from the rpc', async () => {
  rpc.mockResolvedValue({ data: [{ id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay' }], error: null });
  const rows = await getFeed(20);
  expect(rpc).toHaveBeenCalledWith('get_feed', { p_limit: 20 });
  expect(rows[0].sight_name).toBe('Tower');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- data/feed`
Expected: FAIL — cannot find module `../feed`.

- [ ] **Step 3: Implement**

Create `lib/data/feed.ts`:
```ts
import { supabase } from '../supabase';

export type FeedItem = { id: string; comment: string | null; found_at: string; sight_name: string; username: string | null };

export async function getFeed(limit = 30): Promise<FeedItem[]> {
  const { data, error } = await supabase.rpc('get_feed', { p_limit: limit });
  if (error) throw new Error(error.message);
  return (data ?? []) as FeedItem[];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- data/feed`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add feed data-access"
```

---

### Task 4: Submit-a-sight screen (with map-pin location)

**Files:** Create `app/community/submit.tsx`; Test: `app/__tests__/submit-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const back = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1' }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/community', () => ({ submitSight: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { submitSight } from '../../lib/data/community';
import Submit from '../community/submit';

beforeEach(() => jest.clearAllMocks());

it('requires a name', async () => {
  renderWithTheme(<Submit />);
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(screen.getByText('Name is required')).toBeOnTheScreen());
  expect(submitSight).not.toHaveBeenCalled();
});

it('submits with the active city and default center coords', async () => {
  (submitSight as jest.Mock).mockResolvedValue(undefined);
  renderWithTheme(<Submit />);
  fireEvent.changeText(screen.getByPlaceholderText('Sight name'), 'Hidden Cafe');
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(submitSight).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'Hidden Cafe', cityId: 'c1' })));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- submit-screen`
Expected: FAIL — cannot find module `community/submit`.

- [ ] **Step 3: Implement**

Create `app/community/submit.tsx`:
```tsx
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useAuth } from '../../context/AuthProvider';
import { submitSight } from '../../lib/data/community';

// Default center: Paris seed center. Replaced by the map pin's region as the user drags.
const DEFAULT = { lat: 48.8566, lng: 2.3522 };

export default function Submit() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [coord, setCoord] = useState(DEFAULT);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name.trim()) return setError('Name is required');
    if (!session?.user) return;
    setError(null);
    setBusy(true);
    try {
      await submitSight(session.user.id, {
        name: name.trim(),
        cityId,
        typeTags: tags.split(',').map(t => t.trim()).filter(Boolean),
        about: null,
        hint: null,
        lat: coord.lat,
        lng: coord.lng,
      });
      router.back();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: t.spacing.s5 }}>
      <Text style={[t.type.h2, { color: t.colors.text1, marginBottom: t.spacing.s4 }]}>Submit a sight</Text>
      <TextInput placeholder="Sight name" placeholderTextColor={t.colors.text3} value={name} onChangeText={setName} style={[t.type.body, input]} />
      <TextInput placeholder="Type tags (comma separated)" placeholderTextColor={t.colors.text3} value={tags} onChangeText={setTags} style={[t.type.body, input]} />
      <MapView
        style={{ height: 180, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }}
        testID="map-view"
        onRegionChangeComplete={(r: any) => setCoord({ lat: r.latitude, lng: r.longitude })}
      />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Submit for review</Text>
      </Pressable>
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- submit-screen`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add submit-a-sight screen"
```

---

### Task 5: My Submissions screen

**Files:** Create `app/community/mine.tsx`; Test: `app/__tests__/mine-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/community', () => ({ getMySubmissions: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getMySubmissions } from '../../lib/data/community';
import Mine from '../community/mine';

beforeEach(() => jest.clearAllMocks());

it('lists submissions with their status', async () => {
  (getMySubmissions as jest.Mock).mockResolvedValue([
    { id: 's1', name: 'Hidden Cafe', status: 'pending', reject_reason: null },
  ]);
  renderWithTheme(<Mine />);
  await waitFor(() => expect(screen.getByText('Hidden Cafe')).toBeOnTheScreen());
  expect(screen.getByText('pending')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- mine-screen`
Expected: FAIL — cannot find module `community/mine`.

- [ ] **Step 3: Implement**

Create `app/community/mine.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getMySubmissions, Submission } from '../../lib/data/community';

export default function Mine() {
  const t = useTheme();
  const { session } = useAuth();
  const [rows, setRows] = useState<Submission[]>([]);

  useEffect(() => {
    if (session?.user) getMySubmissions(session.user.id).then(setRows);
  }, [session?.user?.id]);

  const statusColor = (s: Submission['status']) =>
    s === 'approved' ? t.colors.green : s === 'rejected' ? t.colors.danger : t.colors.progress;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: t.colors.bg }}
      data={rows}
      keyExtractor={s => s.id}
      renderItem={({ item }) => (
        <View style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
          <Text style={[t.type.h3, { color: t.colors.text1 }]}>{item.name}</Text>
          <Text style={[t.type.label, { color: statusColor(item.status) }]}>{item.status}</Text>
          {item.reject_reason && <Text style={[t.type.caption, { color: t.colors.text2 }]}>{item.reject_reason}</Text>}
        </View>
      )}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- mine-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add my submissions screen"
```

---

### Task 6: Community tab — feed + links

**Files:** Replace `app/(tabs)/community.tsx`; Test: `app/__tests__/community-tab.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../lib/data/feed', () => ({ getFeed: jest.fn() }));
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFeed } from '../../lib/data/feed';
import Community from '../(tabs)/community';

beforeEach(() => jest.clearAllMocks());

it('renders the feed and links to submit', async () => {
  (getFeed as jest.Mock).mockResolvedValue([{ id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay', found_at: 'now' }]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('nay found Tower')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Submit a sight'));
  expect(push).toHaveBeenCalledWith('/community/submit');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- community-tab`
Expected: FAIL — placeholder renders only "Community".

- [ ] **Step 3: Implement**

Replace `app/(tabs)/community.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { getFeed, FeedItem } from '../../lib/data/feed';

export default function Community() {
  const t = useTheme();
  const router = useRouter();
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => { getFeed().then(setFeed); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flexDirection: 'row', gap: t.spacing.s3, padding: t.spacing.s4 }}>
        <Pressable onPress={() => router.push('/community/submit')} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
          <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Submit a sight</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/community/mine')} style={{ backgroundColor: t.colors.surface2, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
          <Text style={[t.type.body, { color: t.colors.text2 }]}>My submissions</Text>
        </Pressable>
      </View>
      <FlatList
        data={feed}
        keyExtractor={f => f.id}
        renderItem={({ item }) => (
          <View style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
            <Text style={[t.type.body, { color: t.colors.text1 }]}>{`${item.username ?? 'Someone'} found ${item.sight_name}`}</Text>
            {item.comment && <Text style={[t.type.caption, { color: t.colors.text2 }]}>{item.comment}</Text>}
          </View>
        )}
      />
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- community-tab`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add community tab with feed and links"
```

---

### Task 7: Moderation Edge Function (admin, service role)

**Files:** Create `supabase/functions/moderate/index.ts`

> This is server-side admin tooling, not part of the consumer app. It is invoked by a trusted admin (e.g., via `supabase functions invoke` with the service-role key). Verified manually, not via the app's Jest suite.

- [ ] **Step 1: Write the function**

```ts
// supabase/functions/moderate/index.ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { submissionId, action, reason } = await req.json(); // action: 'approve' | 'reject'
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: sub, error: e1 } = await admin
    .from('community_submissions').select('*').eq('id', submissionId).single();
  if (e1 || !sub) return new Response('not found', { status: 404 });

  if (action === 'approve') {
    const { data: maxRow } = await admin
      .from('sights').select('dex_no').eq('city_id', sub.city_id)
      .order('dex_no', { ascending: false }).limit(1).maybeSingle();
    const nextDex = (maxRow?.dex_no ?? 0) + 1;
    await admin.from('sights').insert({
      city_id: sub.city_id, dex_no: nextDex, name: sub.name, type_tags: sub.type_tags,
      about: sub.about, hint: sub.hint, access: sub.access, size: sub.size, busyness: sub.busyness,
      reference_photo: sub.reference_photo, location: sub.location, source: 'community',
    });
    await admin.from('community_submissions').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', submissionId);
  } else {
    await admin.from('community_submissions').update({ status: 'rejected', reject_reason: reason ?? null, reviewed_at: new Date().toISOString() }).eq('id', submissionId);
  }
  return new Response('ok');
});
```

- [ ] **Step 2: Verify locally (manual)**

Run: `npx supabase functions serve moderate`
In another shell, with a real `submissionId` and the local service-role key:
```bash
curl -i -X POST http://localhost:54321/functions/v1/moderate \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" -H "Content-Type: application/json" \
  -d '{"submissionId":"<ID>","action":"approve"}'
```
Expected: `200 ok`; the submission flips to `approved` and a new `source='community'` sight appears in its city.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add moderation edge function"
```

---

## Phase 6 Done — Definition of Done

- `npm test` green; community/feed data layers and Submit/Mine/Community screens covered.
- Users submit sights (forced `pending` by RLS), see status in "My submissions," and an admin approves via the Edge Function, which inserts a `source='community'` sight findable by everyone.
- The Community tab shows a live finds feed.
