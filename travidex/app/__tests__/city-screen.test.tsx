const mockReplace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }), useLocalSearchParams: () => ({ id: 'c1' }) }));
const mockSetCityId = jest.fn();
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ setCityId: mockSetCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import City from '../city/[id]';

beforeEach(() => jest.clearAllMocks());

it('shows completion and opens the city map', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({ sights: [], completion: { found: 2, total: 5 }, loading: false });
  await renderWithTheme(<City />);
  expect(screen.getByText('2 of 5 found')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Open map'));
  expect(mockSetCityId).toHaveBeenCalledWith('c1');
  expect(mockReplace).toHaveBeenCalledWith('/(tabs)/map');
});
