const mockOrder = jest.fn();
const mockEq = jest.fn(() => ({ order: mockOrder }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockInsert = jest.fn();
const mockUploadFn = jest.fn();
const mockGetPublicUrl = jest.fn(() => ({ data: { publicUrl: 'https://cdn/x.jpg' } }));
jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({ select: mockSelect, insert: mockInsert })),
    storage: { from: jest.fn(() => ({ upload: mockUploadFn, getPublicUrl: mockGetPublicUrl })) },
  },
}));

import { supabase } from '../../supabase';
import { getUserPhotos, uploadUserPhoto } from '../photos';

const mockFrom = supabase.from as jest.Mock;
const mockStorageFrom = supabase.storage.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('getUserPhotos returns the user photos', async () => {
  mockOrder.mockResolvedValue({ data: [{ id: 'p1', photo_url: 'u' }], error: null });
  const rows = await getUserPhotos('u1');
  expect(mockEq).toHaveBeenCalledWith('user_id', 'u1');
  expect(rows[0].photo_url).toBe('u');
});

it('uploadUserPhoto uploads then inserts a row with the public url', async () => {
  mockUploadFn.mockResolvedValue({ data: { path: 'u1/s1/123.jpg' }, error: null });
  mockInsert.mockResolvedValue({ error: null });
  const blob = {} as any;
  await uploadUserPhoto('u1', 's1', blob, '123.jpg');
  expect(mockStorageFrom).toHaveBeenCalledWith('user-photos');
  expect(mockUploadFn).toHaveBeenCalledWith('u1/s1/123.jpg', blob, { contentType: 'image/jpeg' });
  expect(mockInsert).toHaveBeenCalledWith({ user_id: 'u1', sight_id: 's1', photo_url: 'https://cdn/x.jpg' });
});
