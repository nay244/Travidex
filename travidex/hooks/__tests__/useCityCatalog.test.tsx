jest.mock('../../lib/data/catalog', () => ({ getSightsForCity: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getSightsForCity } from '../../lib/data/catalog';
import { getFoundSightIds } from '../../lib/data/finds';
import { useCityCatalog } from '../useCityCatalog';

beforeEach(() => jest.clearAllMocks());

it('merges found flags and computes completion', async () => {
  (getSightsForCity as jest.Mock).mockResolvedValue([
    { id: 's1', dex_no: 1, name: 'Tower' }, { id: 's2', dex_no: 2, name: 'Market' },
  ]);
  (getFoundSightIds as jest.Mock).mockResolvedValue(new Set(['s1']));
  const { result } = await renderHook(() => useCityCatalog('city-1'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.sights.find(s => s.id === 's1')!.found).toBe(true);
  expect(result.current.sights.find(s => s.id === 's2')!.found).toBe(false);
  expect(result.current.completion).toEqual({ found: 1, total: 2 });
});
