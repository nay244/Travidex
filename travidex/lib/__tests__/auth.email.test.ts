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
  expect(data.user?.id).toBe('1');
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
