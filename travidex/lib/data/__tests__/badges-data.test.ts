const mockUpsert = jest.fn();
const mockOrder = jest.fn();
const mockEqBadge = jest.fn(() => ({ order: mockOrder }));
const mockSelectBadge = jest.fn(() => ({ eq: mockEqBadge }));

const mockHeadEq = jest.fn();
const mockSelectCount = jest.fn(() => ({ eq: mockHeadEq }));

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn((t: string) =>
      t === 'user_badges'
        ? { upsert: mockUpsert, select: mockSelectBadge }
        : { select: mockSelectCount },
    ),
  },
}));

import { supabase } from '../../supabase';
import { awardBadges, getUserBadges } from '../badges';
import { getUserFindCount } from '../finds';

const mockFrom = supabase.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('awardBadges upserts rows ignoring duplicates', async () => {
  mockUpsert.mockResolvedValue({ error: null });
  await awardBadges('u1', ['first_find', 'finds_10']);
  expect(mockUpsert).toHaveBeenCalledWith(
    [{ user_id: 'u1', badge_code: 'first_find' }, { user_id: 'u1', badge_code: 'finds_10' }],
    { onConflict: 'user_id,badge_code', ignoreDuplicates: true },
  );
});

it('getUserBadges returns earned codes', async () => {
  mockOrder.mockResolvedValue({ data: [{ badge_code: 'first_find' }], error: null });
  await expect(getUserBadges('u1')).resolves.toEqual(['first_find']);
});

it('getUserFindCount returns the count', async () => {
  mockHeadEq.mockResolvedValue({ count: 7, error: null });
  await expect(getUserFindCount('u1')).resolves.toBe(7);
  expect(mockSelectCount).toHaveBeenCalledWith('id', { count: 'exact', head: true });
  expect(mockHeadEq).toHaveBeenCalledWith('user_id', 'u1');
});
