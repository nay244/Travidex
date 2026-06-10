const mockIlike = jest.fn();
const mockNeq = jest.fn();
const mockLimit = jest.fn();
const mockSelectProfiles = jest.fn(() => ({ ilike: mockIlike }));
const mockDeleteEq2 = jest.fn();
const mockDeleteEq1 = jest.fn(() => ({ eq: mockDeleteEq2 }));
const mockDeleteFn = jest.fn(() => ({ eq: mockDeleteEq1 }));
const mockUpsert = jest.fn();

jest.mock('../../supabase', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn((t: string) => {
      if (t === 'profiles') return { select: mockSelectProfiles };
      if (t === 'friendships') return { upsert: mockUpsert, delete: mockDeleteFn };
      return {};
    }),
  },
}));

import { supabase } from '../../supabase';
import { getFriendsOverview, searchProfiles, addFriend, removeFriend } from '../friends';

const mockRpc = supabase.rpc as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockIlike.mockReturnValue({ neq: mockNeq });
  mockNeq.mockReturnValue({ limit: mockLimit });
});

it('getFriendsOverview calls rpc with correct args and coerces sights_count to number', async () => {
  mockRpc.mockResolvedValue({ data: [{ friend_id: 'f1', username: 'alice', sights_count: '5', last_find: null }], error: null });
  const rows = await getFriendsOverview('u1');
  expect(mockRpc).toHaveBeenCalledWith('friends_overview', { p_user: 'u1' });
  expect(rows[0].sights_count).toBe(5);
  expect(typeof rows[0].sights_count).toBe('number');
});

it('getFriendsOverview throws on error', async () => {
  mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc failed' } });
  await expect(getFriendsOverview('u1')).rejects.toThrow('rpc failed');
});

it('searchProfiles builds ilike/neq/limit chain correctly', async () => {
  mockLimit.mockResolvedValue({ data: [{ user_id: 'u2', username: 'bob' }], error: null });
  const results = await searchProfiles('bo', 'u1');
  expect(mockSelectProfiles).toHaveBeenCalledWith('user_id, username');
  expect(mockIlike).toHaveBeenCalledWith('username', '%bo%');
  expect(mockNeq).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockLimit).toHaveBeenCalledWith(10);
  expect(results[0].username).toBe('bob');
});

it('addFriend upserts with correct onConflict options', async () => {
  mockUpsert.mockResolvedValue({ error: null });
  await addFriend('u1', 'f1');
  expect(mockUpsert).toHaveBeenCalledWith(
    { user_id: 'u1', friend_id: 'f1' },
    { onConflict: 'user_id,friend_id', ignoreDuplicates: true },
  );
});

it('removeFriend calls delete with both eq filters', async () => {
  mockDeleteEq2.mockResolvedValue({ error: null });
  await removeFriend('u1', 'f1');
  expect(mockDeleteFn).toHaveBeenCalled();
  expect(mockDeleteEq1).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockDeleteEq2).toHaveBeenCalledWith('friend_id', 'f1');
});
