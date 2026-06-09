jest.mock('../../lib/data/catalog', () => ({ getSightById: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn(), getRecentFinds: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getSightById } from '../../lib/data/catalog';
import { getFoundSightIds, getRecentFinds } from '../../lib/data/finds';
import { useSight } from '../useSight';

beforeEach(() => jest.clearAllMocks());

it('loads sight, found flag, and recent finds', async () => {
  (getSightById as jest.Mock).mockResolvedValue({ id: 's1', name: 'Tower' });
  (getFoundSightIds as jest.Mock).mockResolvedValue(new Set(['s1']));
  (getRecentFinds as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
  const { result } = await renderHook(() => useSight('s1'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.sight!.name).toBe('Tower');
  expect(result.current.found).toBe(true);
  expect(result.current.recentFinds).toHaveLength(1);
});
