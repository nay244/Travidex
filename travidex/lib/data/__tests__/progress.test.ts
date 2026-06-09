jest.mock('../../supabase', () => ({ supabase: { rpc: jest.fn() } }));

import { supabase } from '../../supabase';
import { getCityProgress, getCountryProgress } from '../progress';

const mockRpc = supabase.rpc as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('getCityProgress returns a map of cityId → {found,total}', async () => {
  mockRpc.mockResolvedValue({ data: [{ city_id: 'c1', total: 3, found: 1 }], error: null });
  const map = await getCityProgress('u1');
  expect(mockRpc).toHaveBeenCalledWith('city_progress', { p_user: 'u1' });
  expect(map.get('c1')).toEqual({ found: 1, total: 3 });
});

it('getCountryProgress maps countryId → {found,total}', async () => {
  mockRpc.mockResolvedValue({ data: [{ country_id: 'k1', total: 10, found: 4 }], error: null });
  const map = await getCountryProgress('u1');
  expect(mockRpc).toHaveBeenCalledWith('country_progress', { p_user: 'u1' });
  expect(map.get('k1')).toEqual({ found: 4, total: 10 });
});
