const mockOrder = jest.fn();
const mockEq = jest.fn(() => ({ order: mockOrder }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
jest.mock('../../supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: mockSelect })) },
}));

import { supabase } from '../../supabase';
import { getSightsForCity } from '../catalog';

const mockFrom = supabase.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('queries sights for a city ordered by dex_no', async () => {
  mockOrder.mockResolvedValue({ data: [{ id: 's1', dex_no: 1, name: 'Eiffel Tower' }], error: null });
  const rows = await getSightsForCity('22222222-2222-2222-2222-222222222222');
  expect(mockFrom).toHaveBeenCalledWith('sights');
  expect(mockEq).toHaveBeenCalledWith('city_id', '22222222-2222-2222-2222-222222222222');
  expect(mockOrder).toHaveBeenCalledWith('dex_no', { ascending: true });
  expect(rows[0].name).toBe('Eiffel Tower');
});

it('throws on error', async () => {
  mockOrder.mockResolvedValue({ data: null, error: { message: 'boom' } });
  await expect(getSightsForCity('x')).rejects.toThrow('boom');
});
