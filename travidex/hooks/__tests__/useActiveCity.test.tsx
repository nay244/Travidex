jest.mock('../../lib/data/citiesByCountry', () => ({ getCityWithCountry: jest.fn() }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { getCityWithCountry } from '../../lib/data/citiesByCountry';
import { useActiveCity } from '../useActiveCity';

beforeEach(() => jest.clearAllMocks());

it('loads the active city record', async () => {
  (getCityWithCountry as jest.Mock).mockResolvedValue({ id: 'c1', name: 'Paris', country_code: 'FR' });
  const { result } = await renderHook(() => useActiveCity('c1'));
  await waitFor(() => expect(result.current.city?.name).toBe('Paris'));
});
