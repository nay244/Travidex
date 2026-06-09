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
