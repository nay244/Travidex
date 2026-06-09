# Travidex Phase 1 — Foundation & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a runnable Expo (iOS) app with test infrastructure, a Supabase client, working Sign in with Apple + email/password auth, profile creation, and a 5-tab skeleton gated behind auth.

**Architecture:** Expo + expo-router (file-based routing). A thin, fully-unit-tested service layer (`lib/`) wraps `supabase-js` and `expo-apple-authentication`; an `AuthProvider` exposes session state; the root layout routes signed-in users to the tab navigator and signed-out users to the auth stack. Pure logic (validation, services) is TDD'd against a mocked Supabase client; screens get smoke/wiring tests.

**Tech Stack:** Expo SDK 52, TypeScript, expo-router, @supabase/supabase-js, @react-native-async-storage/async-storage, expo-apple-authentication, Jest (jest-expo), @testing-library/react-native.

---

## Theming (REQUIRED)

All color/type/spacing/elevation/motion comes from the RN theme via `useTheme()` — **never hardcode hex**. See `2026-06-08-travidex-theming-contract.md` for setup + the hex→token mapping. In every component below add `const t = useTheme();` and read tokens (`t.colors.*`, `t.type.*`, `t.spacing.*`, `t.radii.*`, `t.shadow.*`). Literal hex shown in snippets is illustrative — implement it as the mapped token. **Found = full color; unfound = hollow** (outline, no fill) — never an opacity dim. This phase also installs the theme (Task 1b).

---

## File Structure

```
travidex/
├─ app/                         # expo-router routes
│  ├─ _layout.tsx               # root: AuthProvider + auth gate
│  ├─ (auth)/welcome.tsx
│  ├─ (auth)/sign-up.tsx
│  ├─ (auth)/login.tsx
│  ├─ (auth)/verify.tsx
│  ├─ (auth)/forgot.tsx
│  ├─ (auth)/profile-setup.tsx
│  └─ (tabs)/_layout.tsx        # 5-tab navigator
│     ├─ map.tsx  explore.tsx  find.tsx  community.tsx  profile.tsx
├─ lib/
│  ├─ supabase.ts               # configured client
│  ├─ validation.ts             # pure form validators
│  ├─ auth.ts                   # email + apple auth service
│  ├─ profiles.ts               # username check + create profile
│  └─ __tests__/                # co-located unit tests
├─ context/
│  ├─ AuthProvider.tsx
│  └─ __tests__/
├─ jest.setup.env.js            # sets test env vars
├─ jest.setup.tsx               # testing-library + mocks
├─ .env                         # EXPO_PUBLIC_SUPABASE_* (gitignored)
└─ package.json / tsconfig.json / babel.config.js / app.json
```

**Responsibilities:** `lib/*` = pure/IO logic (no React). `context/AuthProvider` = session state. `app/*` = screens & routing only (delegate logic to `lib`).

---

### Task 1: Initialize the Expo app

**Files:**
- Create: `travidex/` (Expo project), `app/`, `lib/`, `context/`

- [ ] **Step 1: Scaffold the project**

Run from `C:/Users/naaay/Documents/ClaudeProjects/WorldIndex_App`:
```bash
npx create-expo-app@latest travidex --template blank-typescript
cd travidex
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

- [ ] **Step 2: Switch entry point to expo-router**

In `package.json` set:
```json
"main": "expo-router/entry"
```
In `app.json` add under `expo`:
```json
"scheme": "travidex",
"ios": { "supportsTablet": false, "bundleIdentifier": "com.nay244.travidex" },
"plugins": ["expo-router"]
```

- [ ] **Step 3: Create a minimal root route**

Create `app/_layout.tsx`:
```tsx
import { Stack } from 'expo-router';
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```
Create `app/index.tsx`:
```tsx
import { Text, View } from 'react-native';
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Travidex</Text>
    </View>
  );
}
```
Delete the template `App.tsx` if present.

- [ ] **Step 4: Verify it runs**

Run: `npx expo start --ios` (or press `i`).
Expected: simulator boots, screen shows "Travidex". Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Travidex expo-router app"
```

---

### Task 1b: Design tokens & fonts (theming foundation)

**Files:**
- Copy: `design/Travidex/react-native/theme/` → `travidex/theme/`
- Modify: `tsconfig.json`, `babel.config.js`, `package.json` (jest), `app/_layout.tsx`
- Create: `test-utils.tsx`

- [ ] **Step 1: Install fonts + module resolver**

```bash
npx expo install @expo-google-fonts/space-grotesk @expo-google-fonts/space-mono expo-font
npm i -D babel-plugin-module-resolver
```

- [ ] **Step 2: Copy the generated theme into the app**

```bash
cp -r ../design/Travidex/react-native/theme ./theme
```

- [ ] **Step 3: Add the `@/` path alias**

`tsconfig.json` → `compilerOptions`:
```json
"baseUrl": ".",
"paths": { "@/*": ["./*"] }
```
`babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { root: ['./'], alias: { '@': './' } }],
      // 'react-native-reanimated/plugin' is added (kept LAST) in Phase 3
    ],
  };
};
```
`package.json` jest config → add:
```json
"moduleNameMapper": { "^@/(.*)$": "<rootDir>/$1" }
```

- [ ] **Step 4: Load fonts + ThemeProvider at the root**

Replace `app/_layout.tsx`:
```tsx
import { Slot } from 'expo-router';
import {
  useFonts,
  SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
    SpaceMono_400Regular, SpaceMono_700Bold,
  });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
```
> Task 9 nests `AuthProvider` + `AuthGate` **inside** this `ThemeProvider`, keeping the font gate.

- [ ] **Step 5: Add a themed test renderer**

Create `test-utils.tsx`:
```tsx
import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';

// Wrap any component under test in the real ThemeProvider so useTheme() works.
export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

export * from '@testing-library/react-native';
```
> Component/screen tests that render a component using `useTheme()` import `renderWithTheme` from `../../test-utils` instead of RNTL's `render`.

- [ ] **Step 6: Verify**

Run: `npm test` (existing smoke test still passes) and `npx expo start --ios` (app boots with fonts loaded). Stop the server.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add design-token theme, fonts, and @/ alias"
```

---

### Task 2: Test infrastructure

**Files:**
- Create: `jest.setup.env.js`, `jest.setup.tsx`, `lib/__tests__/smoke.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install test deps**

```bash
npx expo install jest-expo jest
npm i -D @testing-library/react-native @types/jest react-test-renderer
```

- [ ] **Step 2: Configure Jest**

Add to `package.json`:
```json
"scripts": { "test": "jest", "test:watch": "jest --watch" },
"jest": {
  "preset": "jest-expo",
  "setupFiles": ["<rootDir>/jest.setup.env.js"],
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.tsx"],
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@supabase/.*))"
  ]
}
```

Create `jest.setup.env.js`:
```js
process.env.EXPO_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
```

Create `jest.setup.tsx`:
```tsx
import '@testing-library/react-native/extend-expect';
```

- [ ] **Step 3: Write a smoke test**

Create `lib/__tests__/smoke.test.ts`:
```ts
describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run it**

Run: `npm test`
Expected: PASS — 1 test passed.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: add jest test infrastructure"
```

---

### Task 3: Form validation utilities (pure TDD)

**Files:**
- Create: `lib/validation.ts`
- Test: `lib/__tests__/validation.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/validation.test.ts`:
```ts
import { isValidEmail, validatePassword, passwordsMatch } from '../validation';

describe('isValidEmail', () => {
  it('accepts a normal email', () => expect(isValidEmail('a@b.com')).toBe(true));
  it('rejects missing @', () => expect(isValidEmail('ab.com')).toBe(false));
  it('rejects empty', () => expect(isValidEmail('')).toBe(false));
});

describe('validatePassword', () => {
  it('accepts 8+ chars', () => expect(validatePassword('abcd1234')).toBeNull());
  it('rejects short', () => expect(validatePassword('abc')).toBe('Password must be at least 8 characters'));
});

describe('passwordsMatch', () => {
  it('true when equal', () => expect(passwordsMatch('abc', 'abc')).toBe(true));
  it('false when different', () => expect(passwordsMatch('abc', 'abd')).toBe(false));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- validation`
Expected: FAIL — cannot find module `../validation`.

- [ ] **Step 3: Implement**

Create `lib/validation.ts`:
```ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function passwordsMatch(a: string, b: string): boolean {
  return a === b;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- validation`
Expected: PASS — all assertions green.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add form validation utilities"
```

---

### Task 4: Supabase client

**Files:**
- Create: `lib/supabase.ts`, `.env`
- Test: `lib/__tests__/supabase.test.ts`
- Modify: `.gitignore` (ensure `.env` ignored — already covered by root `.gitignore`)

- [ ] **Step 1: Install deps**

```bash
npx expo install @react-native-async-storage/async-storage react-native-url-polyfill
npm i @supabase/supabase-js
```

- [ ] **Step 2: Write the failing test**

Create `lib/__tests__/supabase.test.ts`:
```ts
import { supabase } from '../supabase';

describe('supabase client', () => {
  it('exposes auth and from APIs', () => {
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.from).toBe('function');
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- supabase`
Expected: FAIL — cannot find module `../supabase`.

- [ ] **Step 4: Implement**

Create `lib/supabase.ts`:
```ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Create `.env` (fill real values from the Supabase dashboard before running the app):
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- supabase`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A lib/supabase.ts lib/__tests__/supabase.test.ts && git commit -m "feat: add configured supabase client"
```

---

### Task 5: Auth service — email

**Files:**
- Create: `lib/auth.ts`
- Test: `lib/__tests__/auth.email.test.ts`

- [ ] **Step 1: Write the failing test (mock supabase)**

Create `lib/__tests__/auth.email.test.ts`:
```ts
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

import { supabase } from '../supabase';
import { signUpWithEmail, signInWithEmail, signOut, sendPasswordReset } from '../auth';

const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;

beforeEach(() => jest.clearAllMocks());

it('signUpWithEmail returns data on success', async () => {
  mockAuth.signUp.mockResolvedValue({ data: { user: { id: '1' } }, error: null } as any);
  const data = await signUpWithEmail('a@b.com', 'abcd1234');
  expect(mockAuth.signUp).toHaveBeenCalledWith({ email: 'a@b.com', password: 'abcd1234' });
  expect(data.user.id).toBe('1');
});

it('signUpWithEmail throws on error', async () => {
  mockAuth.signUp.mockResolvedValue({ data: {}, error: { message: 'taken' } } as any);
  await expect(signUpWithEmail('a@b.com', 'abcd1234')).rejects.toThrow('taken');
});

it('signInWithEmail calls signInWithPassword', async () => {
  mockAuth.signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null } as any);
  await signInWithEmail('a@b.com', 'abcd1234');
  expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'abcd1234' });
});

it('signOut calls supabase signOut', async () => {
  mockAuth.signOut.mockResolvedValue({ error: null } as any);
  await signOut();
  expect(mockAuth.signOut).toHaveBeenCalled();
});

it('sendPasswordReset calls resetPasswordForEmail', async () => {
  mockAuth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null } as any);
  await sendPasswordReset('a@b.com');
  expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith('a@b.com');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- auth.email`
Expected: FAIL — cannot find module `../auth`.

- [ ] **Step 3: Implement**

Create `lib/auth.ts`:
```ts
import { supabase } from './supabase';

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- auth.email`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add -A lib/auth.ts lib/__tests__/auth.email.test.ts && git commit -m "feat: add email auth service"
```

---

### Task 6: Auth service — Sign in with Apple

**Files:**
- Modify: `lib/auth.ts`
- Test: `lib/__tests__/auth.apple.test.ts`

- [ ] **Step 1: Install**

```bash
npx expo install expo-apple-authentication
```
Add to `app.json` plugins: `"expo-apple-authentication"`, and `ios.usesAppleSignIn: true`.

- [ ] **Step 2: Write the failing test**

Create `lib/__tests__/auth.apple.test.ts`:
```ts
jest.mock('../supabase', () => ({
  supabase: { auth: { signInWithIdToken: jest.fn() } },
}));
jest.mock('expo-apple-authentication', () => ({
  signInAsync: jest.fn(),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));

import * as Apple from 'expo-apple-authentication';
import { supabase } from '../supabase';
import { signInWithApple } from '../auth';

const mockApple = Apple as jest.Mocked<typeof Apple>;
const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;

beforeEach(() => jest.clearAllMocks());

it('exchanges Apple identity token for a Supabase session', async () => {
  mockApple.signInAsync.mockResolvedValue({ identityToken: 'tok' } as any);
  mockAuth.signInWithIdToken.mockResolvedValue({ data: { session: {} }, error: null } as any);
  await signInWithApple();
  expect(mockAuth.signInWithIdToken).toHaveBeenCalledWith({ provider: 'apple', token: 'tok' });
});

it('throws when Apple returns no token', async () => {
  mockApple.signInAsync.mockResolvedValue({ identityToken: null } as any);
  await expect(signInWithApple()).rejects.toThrow('No identity token');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- auth.apple`
Expected: FAIL — `signInWithApple` is not a function.

- [ ] **Step 4: Implement (append to `lib/auth.ts`)**

```ts
import * as AppleAuthentication from 'expo-apple-authentication';

export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (!credential.identityToken) throw new Error('No identity token from Apple');
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });
  if (error) throw new Error(error.message);
  return data;
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- auth.apple`
Expected: PASS — 2 tests.

- [ ] **Step 6: Commit**

```bash
git add -A lib/auth.ts lib/__tests__/auth.apple.test.ts app.json && git commit -m "feat: add Sign in with Apple"
```

---

### Task 7: Profiles service

**Files:**
- Create: `lib/profiles.ts`
- Test: `lib/__tests__/profiles.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/profiles.test.ts`:
```ts
const single = jest.fn();
const eq = jest.fn(() => ({ maybeSingle: single }));
const select = jest.fn(() => ({ eq }));
const insert = jest.fn();
jest.mock('../supabase', () => ({
  supabase: { from: jest.fn(() => ({ select, insert })) },
}));

import { isUsernameAvailable, createProfile } from '../profiles';

beforeEach(() => jest.clearAllMocks());

it('isUsernameAvailable true when no row', async () => {
  single.mockResolvedValue({ data: null, error: null });
  await expect(isUsernameAvailable('nay')).resolves.toBe(true);
});

it('isUsernameAvailable false when row exists', async () => {
  single.mockResolvedValue({ data: { id: '1' }, error: null });
  await expect(isUsernameAvailable('nay')).resolves.toBe(false);
});

it('createProfile inserts row', async () => {
  insert.mockResolvedValue({ error: null });
  await createProfile('user-1', 'nay', null);
  expect(insert).toHaveBeenCalledWith({ user_id: 'user-1', username: 'nay', avatar_url: null });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- profiles`
Expected: FAIL — cannot find module `../profiles`.

- [ ] **Step 3: Implement**

Create `lib/profiles.ts`:
```ts
import { supabase } from './supabase';

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data === null;
}

export async function createProfile(userId: string, username: string, avatarUrl: string | null) {
  const { error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, username, avatar_url: avatarUrl });
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- profiles`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A lib/profiles.ts lib/__tests__/profiles.test.ts && git commit -m "feat: add profiles service"
```

---

### Task 8: AuthProvider context

**Files:**
- Create: `context/AuthProvider.tsx`
- Test: `context/__tests__/AuthProvider.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `context/__tests__/AuthProvider.test.tsx`:
```tsx
const onAuthStateChange = jest.fn();
const getSession = jest.fn();
jest.mock('../../lib/supabase', () => ({
  supabase: { auth: { getSession, onAuthStateChange } },
}));

import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../AuthProvider';

function Probe() {
  const { session, loading } = useAuth();
  return <Text>{loading ? 'loading' : session ? 'in' : 'out'}</Text>;
}

beforeEach(() => {
  jest.clearAllMocks();
  onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
});

it('resolves to signed-out when no session', async () => {
  getSession.mockResolvedValue({ data: { session: null } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('out')).toBeOnTheScreen());
});

it('resolves to signed-in when a session exists', async () => {
  getSession.mockResolvedValue({ data: { session: { user: { id: '1' } } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('in')).toBeOnTheScreen());
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- AuthProvider`
Expected: FAIL — cannot find module `../AuthProvider`.

- [ ] **Step 3: Implement**

Create `context/AuthProvider.tsx`:
```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = { session: Session | null; loading: boolean };
const AuthContext = createContext<AuthState>({ session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- AuthProvider`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add AuthProvider session context"
```

---

### Task 9: Root layout auth gate

**Files:**
- Modify: `app/_layout.tsx`
- Create: `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx` (stub), `app/index.tsx` (redirect)
- Test: `app/__tests__/gate.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/gate.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthGate } from '../_layout';

jest.mock('../../context/AuthProvider', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../context/AuthProvider';
const mockUseAuth = useAuth as jest.Mock;

it('shows a loader while loading', () => {
  mockUseAuth.mockReturnValue({ session: null, loading: true });
  render(<AuthGate><Text>app</Text></AuthGate>);
  expect(screen.getByTestId('auth-loading')).toBeOnTheScreen();
});

it('renders children when resolved', () => {
  mockUseAuth.mockReturnValue({ session: null, loading: false });
  render(<AuthGate><Text>app</Text></AuthGate>);
  expect(screen.getByText('app')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- gate`
Expected: FAIL — `AuthGate` not exported.

- [ ] **Step 3: Implement**

Replace `app/_layout.tsx` (keeps the Task 1b font gate + ThemeProvider, nests auth inside):
```tsx
import { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot } from 'expo-router';
import {
  useFonts,
  SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { ThemeProvider } from '@/theme';
import { AuthProvider, useAuth } from '../context/AuthProvider';

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <View testID="auth-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
    SpaceMono_400Regular, SpaceMono_700Bold,
  });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

Replace `app/index.tsx` (route based on session):
```tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthProvider';

export default function Index() {
  const { session } = useAuth();
  return <Redirect href={session ? '/(tabs)/map' : '/(auth)/welcome'} />;
}
```

Create `app/(auth)/_layout.tsx`:
```tsx
import { Stack } from 'expo-router';
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Create stub `app/(tabs)/_layout.tsx` (fleshed out in Task 15):
```tsx
import { Stack } from 'expo-router';
export default function TabsStub() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- gate`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add auth gate and session-based routing"
```

---

### Task 10: Welcome screen

**Files:**
- Create: `app/(auth)/welcome.tsx`
- Test: `app/__tests__/welcome.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/welcome.test.tsx`:
```tsx
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../lib/auth', () => ({ signInWithApple: jest.fn() }));

import Welcome from '../(auth)/welcome';

beforeEach(() => jest.clearAllMocks());

it('shows the three entry actions', () => {
  renderWithTheme(<Welcome />);
  expect(screen.getByText('Sign in with Apple')).toBeOnTheScreen();
  expect(screen.getByText('Continue with Email')).toBeOnTheScreen();
  expect(screen.getByText('Log in')).toBeOnTheScreen();
});

it('navigates to sign-up on Continue with Email', () => {
  renderWithTheme(<Welcome />);
  fireEvent.press(screen.getByText('Continue with Email'));
  expect(push).toHaveBeenCalledWith('/(auth)/sign-up');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- welcome`
Expected: FAIL — cannot find module `welcome`.

- [ ] **Step 3: Implement**

Create `app/(auth)/welcome.tsx` — **canonical token usage; mirror this pattern in every other screen** (`const t = useTheme()`, no hex):
```tsx
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { signInWithApple } from '../../lib/auth';

export default function Welcome() {
  const t = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: t.spacing.s7, gap: t.spacing.s4, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.display, { color: t.colors.text1 }]}>Travidex</Text>
      <Text style={[t.type.body, { color: t.colors.text2, marginBottom: t.spacing.s5 }]}>Find the world, one sight at a time.</Text>

      {/* Apple button: text1-on-bg adapts (black on light, white on dark) per Apple's HIG */}
      <Pressable onPress={() => signInWithApple()} style={{ backgroundColor: t.colors.text1, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.bg }]}>Sign in with Apple</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/sign-up')} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Continue with Email</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/login')} style={{ padding: t.spacing.s4 }}>
        <Text style={[t.type.body, { textAlign: 'center', color: t.colors.text2 }]}>Log in</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- welcome`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Welcome screen"
```

---

### Task 11: Sign Up screen

**Files:**
- Create: `app/(auth)/sign-up.tsx`
- Test: `app/__tests__/sign-up.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/sign-up.test.tsx`:
```tsx
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../lib/auth', () => ({ signUpWithEmail: jest.fn() }));
import { signUpWithEmail } from '../../lib/auth';
import SignUp from '../(auth)/sign-up';

beforeEach(() => jest.clearAllMocks());

it('shows a validation error for a short password', async () => {
  renderWithTheme(<SignUp />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abc');
  fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), 'abc');
  fireEvent.press(screen.getByText('Create account'));
  await waitFor(() => expect(screen.getByText('Password must be at least 8 characters')).toBeOnTheScreen());
  expect(signUpWithEmail).not.toHaveBeenCalled();
});

it('calls signUpWithEmail and routes to verify on valid input', async () => {
  (signUpWithEmail as jest.Mock).mockResolvedValue({ user: { id: '1' } });
  renderWithTheme(<SignUp />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abcd1234');
  fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), 'abcd1234');
  fireEvent.press(screen.getByText('Create account'));
  await waitFor(() => expect(signUpWithEmail).toHaveBeenCalledWith('a@b.com', 'abcd1234'));
  expect(push).toHaveBeenCalledWith('/(auth)/verify');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- sign-up`
Expected: FAIL — cannot find module `sign-up`.

- [ ] **Step 3: Implement**

Create `app/(auth)/sign-up.tsx`:
```tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { signUpWithEmail } from '../../lib/auth';
import { isValidEmail, validatePassword, passwordsMatch } from '../../lib/validation';

export default function SignUp() {
  const t = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!isValidEmail(email)) return setError('Enter a valid email');
    const pwError = validatePassword(pw);
    if (pwError) return setError(pwError);
    if (!passwordsMatch(pw, confirm)) return setError('Passwords do not match');
    setError(null);
    setBusy(true);
    try {
      await signUpWithEmail(email, pw);
      router.push('/(auth)/verify');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Create account</Text>
      <TextInput placeholder="Email" placeholderTextColor={t.colors.text3} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={input} />
      <TextInput placeholder="Password" placeholderTextColor={t.colors.text3} secureTextEntry value={pw} onChangeText={setPw} style={input} />
      <TextInput placeholder="Confirm password" placeholderTextColor={t.colors.text3} secureTextEntry value={confirm} onChangeText={setConfirm} style={input} />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Create account</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- sign-up`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Sign Up screen with validation"
```

---

### Task 12: Login screen

**Files:**
- Create: `app/(auth)/login.tsx`
- Test: `app/__tests__/login.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/login.test.tsx`:
```tsx
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const push = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push }) }));
jest.mock('../../lib/auth', () => ({ signInWithEmail: jest.fn() }));
import { signInWithEmail } from '../../lib/auth';
import Login from '../(auth)/login';

beforeEach(() => jest.clearAllMocks());

it('calls signInWithEmail with entered credentials', async () => {
  (signInWithEmail as jest.Mock).mockResolvedValue({ session: {} });
  renderWithTheme(<Login />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abcd1234');
  fireEvent.press(screen.getByText('Log in'));
  await waitFor(() => expect(signInWithEmail).toHaveBeenCalledWith('a@b.com', 'abcd1234'));
});

it('shows an error on failed login', async () => {
  (signInWithEmail as jest.Mock).mockRejectedValue(new Error('Invalid login credentials'));
  renderWithTheme(<Login />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrongpass');
  fireEvent.press(screen.getByText('Log in'));
  await waitFor(() => expect(screen.getByText('Invalid login credentials')).toBeOnTheScreen());
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- login`
Expected: FAIL — cannot find module `login`.

- [ ] **Step 3: Implement**

Create `app/(auth)/login.tsx`:
```tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { signInWithEmail } from '../../lib/auth';

export default function Login() {
  const t = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email, pw);
      // Session change is observed by AuthProvider; index route redirects to tabs.
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Log in</Text>
      <TextInput placeholder="Email" placeholderTextColor={t.colors.text3} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={input} />
      <TextInput placeholder="Password" placeholderTextColor={t.colors.text3} secureTextEntry value={pw} onChangeText={setPw} style={input} />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Log in</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/forgot')} style={{ padding: t.spacing.s4 }}>
        <Text style={[t.type.body, { textAlign: 'center', color: t.colors.text2 }]}>Forgot password?</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- login`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Login screen"
```

---

### Task 13: Verify Email & Forgot Password screens

**Files:**
- Create: `app/(auth)/verify.tsx`, `app/(auth)/forgot.tsx`
- Test: `app/__tests__/forgot.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/forgot.test.tsx`:
```tsx
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../lib/auth', () => ({ sendPasswordReset: jest.fn() }));
import { sendPasswordReset } from '../../lib/auth';
import Forgot from '../(auth)/forgot';

beforeEach(() => jest.clearAllMocks());

it('sends a reset link and confirms', async () => {
  (sendPasswordReset as jest.Mock).mockResolvedValue(undefined);
  renderWithTheme(<Forgot />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  fireEvent.press(screen.getByText('Send reset link'));
  await waitFor(() => expect(sendPasswordReset).toHaveBeenCalledWith('a@b.com'));
  expect(screen.getByText('Check your inbox for a reset link.')).toBeOnTheScreen();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- forgot`
Expected: FAIL — cannot find module `forgot`.

- [ ] **Step 3: Implement**

Create `app/(auth)/forgot.tsx`:
```tsx
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { sendPasswordReset } from '../../lib/auth';

export default function Forgot() {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Reset password</Text>
      {sent ? (
        <Text style={[t.type.body, { color: t.colors.text2 }]}>Check your inbox for a reset link.</Text>
      ) : (
        <>
          <TextInput placeholder="Email" placeholderTextColor={t.colors.text3} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={input} />
          {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
          <Pressable onPress={submit} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
            <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Send reset link</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
```

Create `app/(auth)/verify.tsx`:
```tsx
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

export default function Verify() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s4 }]}>Check your inbox</Text>
      <Text style={[t.type.body, { color: t.colors.text2 }]}>
        We sent you a confirmation link. Tap it to verify your email, then return here to finish setting up your profile.
      </Text>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- forgot`
Expected: PASS — 1 test.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Verify and Forgot Password screens"
```

---

### Task 14: Profile Setup screen

**Files:**
- Create: `app/(auth)/profile-setup.tsx`
- Test: `app/__tests__/profile-setup.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/profile-setup.test.tsx`:
```tsx
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../../lib/profiles', () => ({ isUsernameAvailable: jest.fn(), createProfile: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
import { isUsernameAvailable, createProfile } from '../../lib/profiles';
import ProfileSetup from '../(auth)/profile-setup';

beforeEach(() => jest.clearAllMocks());

it('blocks a taken username', async () => {
  (isUsernameAvailable as jest.Mock).mockResolvedValue(false);
  renderWithTheme(<ProfileSetup />);
  fireEvent.changeText(screen.getByPlaceholderText('Username'), 'taken');
  fireEvent.press(screen.getByText('Continue'));
  await waitFor(() => expect(screen.getByText('That username is taken')).toBeOnTheScreen());
  expect(createProfile).not.toHaveBeenCalled();
});

it('creates the profile when username is free', async () => {
  (isUsernameAvailable as jest.Mock).mockResolvedValue(true);
  (createProfile as jest.Mock).mockResolvedValue(undefined);
  renderWithTheme(<ProfileSetup />);
  fireEvent.changeText(screen.getByPlaceholderText('Username'), 'nay');
  fireEvent.press(screen.getByText('Continue'));
  await waitFor(() => expect(createProfile).toHaveBeenCalledWith('u1', 'nay', null));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- profile-setup`
Expected: FAIL — cannot find module `profile-setup`.

- [ ] **Step 3: Implement**

Create `app/(auth)/profile-setup.tsx`:
```tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { isUsernameAvailable, createProfile } from '../../lib/profiles';
import { useAuth } from '../../context/AuthProvider';

export default function ProfileSetup() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!session?.user) return;
    setBusy(true);
    setError(null);
    try {
      const free = await isUsernameAvailable(username);
      if (!free) {
        setError('That username is taken');
        return;
      }
      await createProfile(session.user.id, username, null);
      router.replace('/(tabs)/map');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Pick a username</Text>
      <TextInput placeholder="Username" placeholderTextColor={t.colors.text3} autoCapitalize="none" value={username} onChangeText={setUsername} style={input} />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Continue</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- profile-setup`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Profile Setup screen"
```

---

### Task 15: Five-tab skeleton

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/map.tsx`, `explore.tsx`, `find.tsx`, `community.tsx`, `profile.tsx`
- Test: `app/__tests__/tabs.test.tsx`

- [ ] **Step 1: Install tabs deps**

```bash
npx expo install @expo/vector-icons
```

- [ ] **Step 2: Write the failing test**

Create `app/__tests__/tabs.test.tsx`:
```tsx
import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import Map from '../(tabs)/map';
import Profile from '../(tabs)/profile';

it('renders the Map placeholder', () => {
  renderWithTheme(<Map />);
  expect(screen.getByText('Map')).toBeOnTheScreen();
});

it('renders the Profile placeholder', () => {
  renderWithTheme(<Profile />);
  expect(screen.getByText('Profile')).toBeOnTheScreen();
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- tabs`
Expected: FAIL — cannot find module `map`.

- [ ] **Step 4: Implement**

Replace `app/(tabs)/_layout.tsx`:
```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: t.colors.green, tabBarInactiveTintColor: t.colors.text3, tabBarStyle: { backgroundColor: t.colors.surface1, borderTopColor: t.colors.divider } }}>
      <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Ionicons name="compass" color={color} size={size} /> }} />
      <Tabs.Screen name="find" options={{ title: 'Find', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size + 12} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
    </Tabs>
  );
}
```

Create each placeholder screen (`map.tsx`, `explore.tsx`, `find.tsx`, `community.tsx`, `profile.tsx`) — substitute the title per file:
```tsx
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
export default function Screen() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h2, { color: t.colors.text1 }]}>Map</Text>
    </View>
  );
}
```
(For `explore.tsx` use `Explore`, `find.tsx` use `Find`, `community.tsx` use `Community`, `profile.tsx` use `Profile`.)

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- tabs`
Expected: PASS — 2 tests.

- [ ] **Step 6: Full suite + manual smoke**

Run: `npm test`
Expected: ALL suites pass.
Run: `npx expo start --ios` → app shows Welcome; create an account (needs real `.env` Supabase values) → lands on the 5-tab navigator. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add five-tab navigator skeleton"
```

---

## Phase 1 Done — Definition of Done

- `npm test` green across all suites.
- App launches on iOS simulator, routes signed-out → Welcome, signed-in → tabs.
- Email sign-up/login, Apple sign-in, password reset, and profile creation all wired to Supabase.
- Five-tab skeleton in place for Phases 3–7 to fill in.

**Prerequisite for running (not for tests):** a Supabase project with Apple provider enabled and a `profiles` table (`user_id uuid`, `username text unique`, `avatar_url text`). The full schema + RLS is built in **Phase 2**; for Phase 1 manual testing, create the `profiles` table and enable email + Apple auth in the Supabase dashboard.
```
