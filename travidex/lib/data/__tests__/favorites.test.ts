const mockUpsert = jest.fn();
const mockDelete = jest.fn();
const mockEqUserId = jest.fn();
const mockEqSightId = jest.fn();
const mockSelectFav = jest.fn();
const mockEqSelect = jest.fn();

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn((t: string) => {
      if (t === 'favorites') {
        return {
          select: mockSelectFav,
          upsert: mockUpsert,
          delete: mockDelete,
        };
      }
      return {};
    }),
  },
}));

import { supabase } from '../../supabase';
import { getFavoriteSightIds, setFavorite } from '../favorites';

const mockFrom = supabase.from as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Wire select chain: .select('sight_id').eq('user_id', userId)
  mockEqSelect.mockResolvedValue({ data: [], error: null });
  mockSelectFav.mockReturnValue({ eq: mockEqSelect });
  // Wire delete chain: .delete().eq('user_id', ...).eq('sight_id', ...)
  mockEqSightId.mockResolvedValue({ error: null });
  mockEqUserId.mockReturnValue({ eq: mockEqSightId });
  mockDelete.mockReturnValue({ eq: mockEqUserId });
});

it('getFavoriteSightIds returns a Set of sight ids', async () => {
  mockEqSelect.mockResolvedValue({
    data: [{ sight_id: 's1' }, { sight_id: 's2' }],
    error: null,
  });
  const result = await getFavoriteSightIds('u1');
  expect(mockSelectFav).toHaveBeenCalledWith('sight_id');
  expect(mockEqSelect).toHaveBeenCalledWith('user_id', 'u1');
  expect(result).toEqual(new Set(['s1', 's2']));
});

it('getFavoriteSightIds returns empty Set when no rows', async () => {
  mockEqSelect.mockResolvedValue({ data: null, error: null });
  const result = await getFavoriteSightIds('u1');
  expect(result).toEqual(new Set());
});

it('getFavoriteSightIds throws on error', async () => {
  mockEqSelect.mockResolvedValue({ data: null, error: { message: 'db fail' } });
  await expect(getFavoriteSightIds('u1')).rejects.toThrow('db fail');
});

it('setFavorite(on=true) calls upsert with onConflict', async () => {
  mockUpsert.mockResolvedValue({ error: null });
  await setFavorite('u1', 's1', true);
  expect(mockUpsert).toHaveBeenCalledWith(
    { user_id: 'u1', sight_id: 's1' },
    { onConflict: 'user_id,sight_id', ignoreDuplicates: true },
  );
});

it('setFavorite(on=true) throws on error', async () => {
  mockUpsert.mockResolvedValue({ error: { message: 'upsert fail' } });
  await expect(setFavorite('u1', 's1', true)).rejects.toThrow('upsert fail');
});

it('setFavorite(on=false) calls delete with correct eq args', async () => {
  await setFavorite('u1', 's1', false);
  expect(mockDelete).toHaveBeenCalled();
  expect(mockEqUserId).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockEqSightId).toHaveBeenCalledWith('sight_id', 's1');
});

it('setFavorite(on=false) throws on error', async () => {
  mockEqSightId.mockResolvedValue({ error: { message: 'delete fail' } });
  await expect(setFavorite('u1', 's1', false)).rejects.toThrow('delete fail');
});
