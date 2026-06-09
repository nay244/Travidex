jest.mock('../../supabase', () => ({ supabase: { rpc: jest.fn() } }));

import { supabase } from '../../supabase';
import { getFeed } from '../feed';

const mockRpc = supabase.rpc as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('returns feed rows from the rpc', async () => {
  mockRpc.mockResolvedValue({ data: [{ id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay' }], error: null });
  const rows = await getFeed(20);
  expect(mockRpc).toHaveBeenCalledWith('get_feed', { p_limit: 20 });
  expect(rows[0].sight_name).toBe('Tower');
});
