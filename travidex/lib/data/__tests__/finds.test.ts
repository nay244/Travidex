const mockInsert = jest.fn();
const mockInFn = jest.fn();
const mockEqUser = jest.fn(() => ({ in: mockInFn }));
const mockSelectFinds = jest.fn(() => ({ eq: mockEqUser }));
const mockDeleteEqSight = jest.fn();
const mockDeleteEqUser = jest.fn(() => ({ eq: mockDeleteEqSight }));
const mockDelete = jest.fn(() => ({ eq: mockDeleteEqUser }));
jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn((table: string) =>
      table === 'finds' ? { insert: mockInsert, select: mockSelectFinds, delete: mockDelete } : {}
    ),
  },
}));

import { supabase } from '../../supabase';
import { logFind, getFoundSightIds, unlogFind } from '../finds';

const mockFrom = supabase.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('logFind inserts a find row', async () => {
  mockInsert.mockResolvedValue({ error: null });
  await logFind('u1', 's1', 'Found!');
  expect(mockFrom).toHaveBeenCalledWith('finds');
  expect(mockInsert).toHaveBeenCalledWith({ user_id: 'u1', sight_id: 's1', comment: 'Found!' });
});

it('getFoundSightIds returns a set of sight ids the user found in a city', async () => {
  mockInFn.mockResolvedValue({ data: [{ sight_id: 's1' }, { sight_id: 's3' }], error: null });
  const ids = await getFoundSightIds('u1', ['s1', 's2', 's3']);
  expect(mockEqUser).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockInFn).toHaveBeenCalledWith('sight_id', ['s1', 's2', 's3']);
  expect(ids).toEqual(new Set(['s1', 's3']));
});

it('unlogFind calls delete with correct eq chain', async () => {
  mockDeleteEqSight.mockResolvedValue({ error: null });
  await unlogFind('u1', 's1');
  expect(mockDelete).toHaveBeenCalled();
  expect(mockDeleteEqUser).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockDeleteEqSight).toHaveBeenCalledWith('sight_id', 's1');
});

it('unlogFind throws when supabase returns an error', async () => {
  mockDeleteEqSight.mockResolvedValue({ error: { message: 'delete failed' } });
  await expect(unlogFind('u1', 's1')).rejects.toThrow('delete failed');
});
