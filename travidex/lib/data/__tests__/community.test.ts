const mockInsert = jest.fn();
const mockOrder = jest.fn();
const mockEq = jest.fn(() => ({ order: mockOrder }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
jest.mock('../../supabase', () => ({
  supabase: { from: jest.fn(() => ({ insert: mockInsert, select: mockSelect })) },
}));

import { supabase } from '../../supabase';
import { submitSight, getMySubmissions } from '../community';

const mockFrom = supabase.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('submitSight inserts a pending submission with EWKT location', async () => {
  mockInsert.mockResolvedValue({ error: null });
  await submitSight('u1', { name: 'Hidden Cafe', cityId: 'c1', typeTags: ['Food'], about: null, hint: null, lat: 48.85, lng: 2.29 });
  expect(mockFrom).toHaveBeenCalledWith('community_submissions');
  expect(mockInsert).toHaveBeenCalledWith({
    user_id: 'u1', city_id: 'c1', name: 'Hidden Cafe', type_tags: ['Food'],
    about: null, hint: null, location: 'SRID=4326;POINT(2.29 48.85)',
  });
});

it('getMySubmissions returns the user rows newest first', async () => {
  mockOrder.mockResolvedValue({ data: [{ id: 'sub1', status: 'pending' }], error: null });
  const rows = await getMySubmissions('u1');
  expect(mockEq).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
  expect(rows[0].status).toBe('pending');
});
