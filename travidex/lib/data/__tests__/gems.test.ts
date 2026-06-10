// gem_favorites chains
const mockFavDeleteEq2 = jest.fn();
const mockFavDeleteEq1 = jest.fn(() => ({ eq: mockFavDeleteEq2 }));
const mockFavDelete = jest.fn(() => ({ eq: mockFavDeleteEq1 }));
const mockFavUpsert = jest.fn();

// gem_reports upsert
const mockReportUpsert = jest.fn();

// gems insert
const mockGemsInsert = jest.fn();

// storage
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn(() => ({ data: { publicUrl: 'https://cdn/gem.jpg' } }));

jest.mock('../../supabase', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn((t: string) => {
      if (t === 'gem_favorites') return { upsert: mockFavUpsert, delete: mockFavDelete };
      if (t === 'gem_reports') return { upsert: mockReportUpsert };
      if (t === 'gems') return { insert: mockGemsInsert };
      return {};
    }),
    storage: {
      from: jest.fn(() => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl })),
    },
  },
}));

import { supabase } from '../../supabase';
import { getGemsForCity, setGemFavorite, reportGem, submitGem } from '../gems';

const mockRpc = supabase.rpc as jest.Mock;
const mockStorageFrom = supabase.storage.from as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('getGemsForCity calls rpc with city and user args', async () => {
  mockRpc.mockResolvedValue({ data: [{ id: 'g1', name: 'Hidden Arch' }], error: null });
  const gems = await getGemsForCity('c1', 'u1');
  expect(mockRpc).toHaveBeenCalledWith('gems_for_city', { p_city: 'c1', p_user: 'u1' });
  expect(gems[0].id).toBe('g1');
});

it('getGemsForCity throws on error', async () => {
  mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc error' } });
  await expect(getGemsForCity('c1', 'u1')).rejects.toThrow('rpc error');
});

it('setGemFavorite(on=true) upserts to gem_favorites', async () => {
  mockFavUpsert.mockResolvedValue({ error: null });
  await setGemFavorite('u1', 'g1', true);
  expect(mockFavUpsert).toHaveBeenCalledWith(
    { user_id: 'u1', gem_id: 'g1' },
    { onConflict: 'user_id,gem_id', ignoreDuplicates: true },
  );
  expect(mockFavDelete).not.toHaveBeenCalled();
});

it('setGemFavorite(on=false) deletes from gem_favorites', async () => {
  mockFavDeleteEq2.mockResolvedValue({ error: null });
  await setGemFavorite('u1', 'g1', false);
  expect(mockFavDelete).toHaveBeenCalled();
  expect(mockFavDeleteEq1).toHaveBeenCalledWith('user_id', 'u1');
  expect(mockFavDeleteEq2).toHaveBeenCalledWith('gem_id', 'g1');
  expect(mockFavUpsert).not.toHaveBeenCalled();
});

it('reportGem upserts to gem_reports with reason', async () => {
  mockReportUpsert.mockResolvedValue({ error: null });
  await reportGem('u1', 'g1', 'spam');
  expect(mockReportUpsert).toHaveBeenCalledWith(
    { user_id: 'u1', gem_id: 'g1', reason: 'spam' },
    { onConflict: 'user_id,gem_id', ignoreDuplicates: true },
  );
});

it('reportGem defaults reason to null when omitted', async () => {
  mockReportUpsert.mockResolvedValue({ error: null });
  await reportGem('u1', 'g1');
  expect(mockReportUpsert).toHaveBeenCalledWith(
    { user_id: 'u1', gem_id: 'g1', reason: null },
    { onConflict: 'user_id,gem_id', ignoreDuplicates: true },
  );
});

it('submitGem uploads to gem-photos with correct path shape and inserts row without status', async () => {
  mockUpload.mockResolvedValue({ data: { path: 'u1/c1/123-x.jpg' }, error: null });
  mockGemsInsert.mockResolvedValue({ error: null });
  const blob = {} as Blob;
  await submitGem('u1', { name: 'Hidden Arch', note: 'cool', cityId: 'c1', lat: 48.85, lng: 2.29, blob, fileName: 'x.jpg' });
  expect(mockStorageFrom).toHaveBeenCalledWith('gem-photos');
  expect(mockUpload).toHaveBeenCalledWith(
    expect.stringMatching(/^u1\/c1\/\d+-x\.jpg$/),
    blob,
    { contentType: 'image/jpeg' },
  );
  expect(mockGetPublicUrl).toHaveBeenCalledWith(expect.stringMatching(/^u1\/c1\/\d+-x\.jpg$/));
  expect(mockGemsInsert).toHaveBeenCalledWith(
    expect.not.objectContaining({ status: expect.anything() }),
  );
  expect(mockGemsInsert).toHaveBeenCalledWith(
    expect.objectContaining({
      author_id: 'u1',
      name: 'Hidden Arch',
      note: 'cool',
      photo_url: 'https://cdn/gem.jpg',
      city_id: 'c1',
      location: 'SRID=4326;POINT(2.29 48.85)',
    }),
  );
});

it('submitGem strips path segments from fileName and uses correct content type', async () => {
  mockUpload.mockResolvedValue({ data: { path: 'u1/c1/123-photo.png' }, error: null });
  mockGemsInsert.mockResolvedValue({ error: null });
  const blob = {} as Blob;
  await submitGem('u1', { name: 'Arch', note: null, cityId: 'c1', lat: 1, lng: 2, blob, fileName: 'some/path/photo.png' });
  expect(mockUpload).toHaveBeenCalledWith(
    expect.stringMatching(/^u1\/c1\/\d+-photo\.png$/),
    blob,
    { contentType: 'image/png' },
  );
});
