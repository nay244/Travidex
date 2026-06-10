# Travidex Phase 8 — Travidex+ Premium (In-App Subscription) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Run last** — only after Phases 1–7 are built and fine-tuned, as a pre–App-Store release step.

**Goal:** Add a **Travidex+** in-app subscription and an entitlement layer that gates premium aspects of the app — starting with the **dark theme/Appearance** — behind it.

**Architecture:** RevenueCat (`react-native-purchases`) wraps StoreKit. A pure `hasPremium` mapper reads the active entitlement; an `EntitlementProvider` exposes `isPremium` + `refresh`/`restore`. A Paywall screen presents offerings and purchases. Premium-gated entry points (first: switching to dark theme) check `isPremium` and route to the Paywall when locked. Phases 1–7 are untouched except for adding gate checks at the specific premium entry points.

**Tech Stack:** react-native-purchases (RevenueCat), StoreKit, expo-router, Jest/RNTL, the Phase-1 ThemeProvider.

**CLAUDE.md compliance:** entitlement logic is a pure, tested mapper; gating is added only at the exact premium entry points (surgical); no speculative tiers — one `premium` entitlement; the premium feature set is confirmed with the user before this phase (see Task 7).

**Theming:** follow `2026-06-08-travidex-theming-contract.md` — `useTheme()` tokens only.

> **Prerequisite (manual, once):** create a RevenueCat project, a `premium` entitlement, and an auto-renewing subscription product in App Store Connect; put the RevenueCat iOS public SDK key in `.env` as `EXPO_PUBLIC_RC_IOS_KEY`.

---

## File Structure

```
travidex/
├─ lib/premium/entitlement.ts        # pure hasPremium(customerInfo)
├─ context/EntitlementProvider.tsx    # isPremium, refresh, restore
├─ hooks/useRequirePremium.ts         # gate helper → routes to paywall
├─ app/paywall.tsx                    # Travidex+ paywall screen
└─ app/profile/appearance.tsx         # theme switch, gated
```

---

### Task 1: Install + configure RevenueCat

- [ ] **Step 1: Install**

```bash
cd travidex
npx expo install react-native-purchases
```
Add the config plugin to `app.json` plugins if required by the SDK version, then rebuild the dev client.

- [ ] **Step 2: Initialize at app start**

In `app/_layout.tsx`, before rendering, configure Purchases:
```tsx
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
// inside RootLayout, in a useEffect that runs once:
if (Platform.OS === 'ios') {
  Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS_KEY as string });
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: add and configure RevenueCat"
```

---

### Task 2: Pure entitlement mapper

**Files:** Create `lib/premium/entitlement.ts`; Test: `lib/premium/__tests__/entitlement.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { hasPremium } from '../entitlement';

it('true when the premium entitlement is active', () => {
  expect(hasPremium({ entitlements: { active: { premium: { isActive: true } } } } as any)).toBe(true);
});
it('false when absent', () => {
  expect(hasPremium({ entitlements: { active: {} } } as any)).toBe(false);
});
it('false for null customer info', () => {
  expect(hasPremium(null)).toBe(false);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- entitlement`
Expected: FAIL — cannot find module `../entitlement`.

- [ ] **Step 3: Implement**

Create `lib/premium/entitlement.ts`:
```ts
import type { CustomerInfo } from 'react-native-purchases';

export const PREMIUM_ENTITLEMENT = 'premium';

export function hasPremium(info: CustomerInfo | null): boolean {
  return !!info?.entitlements?.active?.[PREMIUM_ENTITLEMENT];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- entitlement`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add premium entitlement mapper"
```

---

### Task 3: EntitlementProvider

**Files:** Create `context/EntitlementProvider.tsx`; Test: `context/__tests__/EntitlementProvider.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const getCustomerInfo = jest.fn();
const restorePurchases = jest.fn();
jest.mock('react-native-purchases', () => ({ __esModule: true, default: { getCustomerInfo, restorePurchases } }));

import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { EntitlementProvider, useEntitlement } from '../EntitlementProvider';

function Probe() {
  const { isPremium, loading } = useEntitlement();
  return <Text>{loading ? 'loading' : isPremium ? 'premium' : 'free'}</Text>;
}

beforeEach(() => jest.clearAllMocks());

it('reflects an active premium entitlement', async () => {
  getCustomerInfo.mockResolvedValue({ entitlements: { active: { premium: { isActive: true } } } });
  render(<EntitlementProvider><Probe /></EntitlementProvider>);
  await waitFor(() => expect(screen.getByText('premium')).toBeOnTheScreen());
});

it('defaults to free', async () => {
  getCustomerInfo.mockResolvedValue({ entitlements: { active: {} } });
  render(<EntitlementProvider><Probe /></EntitlementProvider>);
  await waitFor(() => expect(screen.getByText('free')).toBeOnTheScreen());
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- EntitlementProvider`
Expected: FAIL — cannot find module `../EntitlementProvider`.

- [ ] **Step 3: Implement**

Create `context/EntitlementProvider.tsx`:
```tsx
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import Purchases from 'react-native-purchases';
import { hasPremium } from '../lib/premium/entitlement';

type EntitlementState = { isPremium: boolean; loading: boolean; refresh: () => Promise<void>; restore: () => Promise<void> };
const EntitlementContext = createContext<EntitlementState>({ isPremium: false, loading: true, refresh: async () => {}, restore: async () => {} });

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const info = await Purchases.getCustomerInfo();
    setIsPremium(hasPremium(info));
    setLoading(false);
  }, []);

  const restore = useCallback(async () => {
    const info = await Purchases.restorePurchases();
    setIsPremium(hasPremium(info));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <EntitlementContext.Provider value={{ isPremium, loading, refresh, restore }}>{children}</EntitlementContext.Provider>;
}

export const useEntitlement = () => useContext(EntitlementContext);
```

Wrap the app: in `app/_layout.tsx`, nest `<EntitlementProvider>` inside `<ThemeProvider>`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- EntitlementProvider`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add EntitlementProvider"
```

---

### Task 4: Paywall screen

**Files:** Create `app/paywall.tsx`; Test: `app/__tests__/paywall.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const back = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back }) }));
const getOfferings = jest.fn();
const purchasePackage = jest.fn();
jest.mock('react-native-purchases', () => ({ __esModule: true, default: { getOfferings, purchasePackage } }));
jest.mock('../../context/EntitlementProvider', () => ({ useEntitlement: () => ({ refresh: jest.fn() }) }));

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Purchases from 'react-native-purchases';
import { ThemeProvider } from '@/theme';
import Paywall from '../paywall';

const wrap = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>);
beforeEach(() => jest.clearAllMocks());

it('shows an offering package and purchases it', async () => {
  const pkg = { product: { priceString: '$3.99', title: 'Travidex+ Monthly' } };
  (getOfferings as jest.Mock).mockResolvedValue({ current: { availablePackages: [pkg] } });
  (purchasePackage as jest.Mock).mockResolvedValue({});
  wrap(<Paywall />);
  await waitFor(() => expect(screen.getByText('$3.99')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('$3.99'));
  await waitFor(() => expect(Purchases.purchasePackage).toHaveBeenCalledWith(pkg));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- paywall`
Expected: FAIL — cannot find module `paywall`.

- [ ] **Step 3: Implement**

Create `app/paywall.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useTheme } from '@/theme';
import { useEntitlement } from '../context/EntitlementProvider';

const BENEFITS = ['Dark theme (Travidex+ Appearance)', 'More premium perks coming before launch'];

export default function Paywall() {
  const t = useTheme();
  const router = useRouter();
  const { refresh } = useEntitlement();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    Purchases.getOfferings().then(o => setPackages(o.current?.availablePackages ?? []));
  }, []);

  async function buy(pkg: PurchasesPackage) {
    await Purchases.purchasePackage(pkg);
    await refresh();
    router.back();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: t.spacing.s7, gap: t.spacing.s5 }}>
      <Text style={[t.type.h1, { color: t.colors.text1 }]}>Travidex+</Text>
      {BENEFITS.map(b => <Text key={b} style={[t.type.body, { color: t.colors.text2 }]}>• {b}</Text>)}
      {packages.map((p, i) => (
        <Pressable key={i} onPress={() => buy(p)} style={{ backgroundColor: t.colors.actionPrimary, padding: t.spacing.s5, borderRadius: t.radii.md }}>
          <Text style={[t.type.h3, { color: t.colors.textOnAccent, textAlign: 'center' }]}>{p.product.priceString}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- paywall`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Travidex+ paywall screen"
```

---

### Task 5: Gate dark theme behind premium (Appearance)

**Files:** Create `app/profile/appearance.tsx`; Modify `app/profile/settings.tsx` (link to Appearance); Test: `app/__tests__/appearance.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../context/EntitlementProvider', () => ({ useEntitlement: jest.fn() }));
jest.mock('@/theme', () => ({
  useTheme: () => ({ colors: { bg: '#000', text1: '#fff', text2: '#aaa' }, spacing: { s5: 16, s7: 24 }, type: { h2: {}, body: {} } }),
  useThemeMode: () => ({ scheme: 'light', setScheme: jest.fn() }),
}));

import { render, screen, fireEvent } from '@testing-library/react-native';
import { useEntitlement } from '../../context/EntitlementProvider';
import Appearance from '../profile/appearance';

beforeEach(() => jest.clearAllMocks());

it('routes free users to the paywall when enabling dark', () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: false });
  render(<Appearance />);
  fireEvent.press(screen.getByText('Dark'));
  expect(push).toHaveBeenCalledWith('/paywall');
});

it('lets premium users switch to dark', () => {
  const setScheme = jest.fn();
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: true });
  jest.spyOn(require('@/theme'), 'useThemeMode').mockReturnValue({ scheme: 'light', setScheme });
  render(<Appearance />);
  fireEvent.press(screen.getByText('Dark'));
  expect(push).not.toHaveBeenCalled();
  expect(setScheme).toHaveBeenCalledWith('dark');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- appearance`
Expected: FAIL — cannot find module `profile/appearance`.

- [ ] **Step 3: Implement**

Create `app/profile/appearance.tsx`:
```tsx
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useThemeMode } from '@/theme';
import { useEntitlement } from '../../context/EntitlementProvider';

export default function Appearance() {
  const t = useTheme();
  const router = useRouter();
  const { scheme, setScheme } = useThemeMode();
  const { isPremium } = useEntitlement();

  function choose(next: 'light' | 'dark') {
    if (next === 'dark' && !isPremium) {
      router.push('/paywall');
      return;
    }
    setScheme(next);
  }

  const Option = ({ label, value }: { label: string; value: 'light' | 'dark' }) => (
    <Pressable onPress={() => choose(value)} style={{ padding: t.spacing.s5, borderRadius: 12, backgroundColor: scheme === value ? t.colors.actionPrimary : t.colors.surface2 }}>
      <Text style={[t.type.body, { color: scheme === value ? t.colors.textOnAccent : t.colors.text1 }]}>{label}{value === 'dark' ? '  (Travidex+)' : ''}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, padding: t.spacing.s7, gap: t.spacing.s5 }}>
      <Text style={[t.type.h2, { color: t.colors.text1 }]}>Appearance</Text>
      <Option label="Light" value="light" />
      <Option label="Dark" value="dark" />
    </View>
  );
}
```

In `app/profile/settings.tsx`, add a row linking to Appearance: `<Pressable onPress={() => router.push('/profile/appearance')}><Text style={[t.type.body, { color: t.colors.text1 }]}>Appearance</Text></Pressable>`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- appearance`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: gate dark theme behind Travidex+"
```

---

### Task 6: Restore purchases (Settings)

**Files:** Modify `app/profile/settings.tsx`; Test: extend `app/__tests__/settings-screen.test.tsx`

- [ ] **Step 1: Add a failing test**

```tsx
// in settings-screen.test.tsx — add an EntitlementProvider mock and:
jest.mock('../../context/EntitlementProvider', () => ({ useEntitlement: () => ({ restore }) }));
const restore = jest.fn();
it('restores purchases', async () => {
  render(<Settings />);
  fireEvent.press(screen.getByText('Restore purchases'));
  await waitFor(() => expect(restore).toHaveBeenCalled());
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- settings-screen`
Expected: FAIL — no "Restore purchases" control.

- [ ] **Step 3: Implement**

In `app/profile/settings.tsx`, add: `const { restore } = useEntitlement();` and a row `<Pressable onPress={() => restore()}><Text style={[t.type.body, { color: t.colors.info }]}>Restore purchases</Text></Pressable>`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- settings-screen`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add restore purchases to settings"
```

---

### Task 7: Confirm the premium feature set (gate + docs)

> Decision task — no code beyond what Tasks 1–6 added until confirmed.

- [x] **Step 1:** Confirmed with the product owner (2026-06-10): the Travidex+ v1 feature set is **dark theme/Appearance** + **premium highlight-card frames** (gold + forest, in Region Highlights). Both gated via the standard 4-line pattern (`// premium gate — copy this pattern for new Travidex+ features`). One `premium` entitlement.
- [x] **Step 2:** Documented here; paywall BENEFITS list matches. At submission, verify App Store Connect subscription metadata lists the same two perks.

---

## Phase 8 Done — Definition of Done

- `npm test` green; entitlement mapper, provider, paywall, and dark-theme gating covered.
- Free users get the full Phases 1–7 app on light theme; **Travidex+** unlocks dark theme (and any features confirmed in Task 7) via a working StoreKit subscription with restore.
- Ready for App Store submission with a compliant in-app subscription.
```
