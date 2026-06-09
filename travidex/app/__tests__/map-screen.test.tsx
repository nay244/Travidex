jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import MapScreen from '../(tabs)/map';

beforeEach(() => jest.clearAllMocks());

it('renders a marker per sight and navigates to detail on row select', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [
      { id: 's1', dex_no: 1, name: 'Tower', found: true, lat: 48.85, lng: 2.29 },
      { id: 's2', dex_no: 2, name: 'Market', found: false, lat: 48.86, lng: 2.35 },
    ],
    completion: { found: 1, total: 2 }, loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<MapScreen />);
  expect(screen.getByTestId('marker-s1')).toBeOnTheScreen();
  expect(screen.getByTestId('marker-s2')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Tower'));
  expect(mockPush).toHaveBeenCalledWith('/sight/s1');
});
