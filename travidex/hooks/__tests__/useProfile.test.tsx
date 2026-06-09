let mockSession: any = { user: { id: 'u1' } };
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: mockSession }) }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn(), getCountryProgress: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getUserFindCount: jest.fn() }));
jest.mock('../../lib/data/badges', () => ({ awardBadges: jest.fn(), getUserBadges: jest.fn() }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getCityProgress, getCountryProgress } from '../../lib/data/progress';
import { getUserFindCount } from '../../lib/data/finds';
import { awardBadges, getUserBadges } from '../../lib/data/badges';
import { useProfile } from '../useProfile';

beforeEach(() => {
  jest.clearAllMocks();
  mockSession = { user: { id: 'u1' } };
});

it('computes stats and awards newly-earned badges', async () => {
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 3, total: 3 }]]));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 3, total: 3 }]]));
  (getUserFindCount as jest.Mock).mockResolvedValue(3);
  (getUserBadges as jest.Mock).mockResolvedValue(['first_find', 'city_claimed']);
  const { result } = await renderHook(() => useProfile());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.stats.totalFinds).toBe(3);
  expect(result.current.stats.citiesClaimed).toBe(1);
  expect(awardBadges).toHaveBeenCalledWith('u1', expect.arrayContaining(['first_find', 'city_claimed']));
  expect(result.current.earnedBadges).toEqual(['first_find', 'city_claimed']);
});

it('clears loading when there is no session', async () => {
  mockSession = null;
  const { result } = await renderHook(() => useProfile());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.stats.totalFinds).toBe(0);
});

it('clears loading even if a data call rejects', async () => {
  (getCityProgress as jest.Mock).mockRejectedValue(new Error('network'));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map());
  (getUserFindCount as jest.Mock).mockResolvedValue(0);
  const { result } = await renderHook(() => useProfile());
  await waitFor(() => expect(result.current.loading).toBe(false));
});
