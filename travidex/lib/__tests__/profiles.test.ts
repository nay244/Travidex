const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ maybeSingle: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockInsert = jest.fn();
jest.mock('../supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: mockSelect, insert: mockInsert })) },
}));

import { isUsernameAvailable, createProfile } from '../profiles';

beforeEach(() => jest.clearAllMocks());

it('isUsernameAvailable true when no row', async () => {
  mockSingle.mockResolvedValue({ data: null, error: null });
  await expect(isUsernameAvailable('nay')).resolves.toBe(true);
});

it('isUsernameAvailable false when row exists', async () => {
  mockSingle.mockResolvedValue({ data: { id: '1' }, error: null });
  await expect(isUsernameAvailable('nay')).resolves.toBe(false);
});

it('createProfile inserts row', async () => {
  mockInsert.mockResolvedValue({ error: null });
  await createProfile('user-1', 'nay', null);
  expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1', username: 'nay', avatar_url: null });
});
