const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
jest.mock('../../supabase', () => ({ supabase: { from: jest.fn(() => ({ select: mockSelect })) } }));

import { getCityWithCountry } from '../citiesByCountry';

beforeEach(() => jest.clearAllMocks());

it('returns the city with flattened country code/name', async () => {
  mockSingle.mockResolvedValue({
    data: { id: 'c1', country_id: 'k1', name: 'Paris', region: 'Île-de-France', lat: 48.85, lng: 2.35, countries: { code: 'FR', name: 'France' } },
    error: null,
  });
  const c = await getCityWithCountry('c1');
  expect(mockEq).toHaveBeenCalledWith('id', 'c1');
  expect(c).toMatchObject({ id: 'c1', name: 'Paris', country_code: 'FR', country_name: 'France' });
});
