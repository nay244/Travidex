const mockSetCityId = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1', setCityId: mockSetCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: () => ({ sights: [], completion: { found: 0, total: 0 }, loading: false, reload: jest.fn() }) }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({ city: { id: 'c1', country_id: 'k1', name: 'Paris', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' } }),
}));
// Stub the picker — its own behavior is covered by LocationPicker.test.tsx.
// When visible it renders a probe that exercises the onPick wiring.
jest.mock('../../components/LocationPicker', () => ({
  LocationPicker: ({ visible, onPick }: any) => {
    const { Text } = require('react-native');
    return visible ? <Text onPress={() => onPick('c9')}>PICKER-OPEN</Text> : null;
  },
}));

import { screen, fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import MapScreen from '../(tabs)/map';

beforeEach(() => jest.clearAllMocks());

it('shows the location pill and opens the picker', async () => {
  await renderWithTheme(<MapScreen />);
  const allParis = screen.getAllByText('Paris');
  expect(allParis.length).toBeGreaterThanOrEqual(1);          // pill city name
  expect(screen.getByLabelText('France')).toBeOnTheScreen();  // pill flag
  await act(async () => {
    fireEvent.press(screen.getByTestId('location-pill'));
  });
  expect(screen.getByText('PICKER-OPEN')).toBeOnTheScreen();
});

it('picking a city updates the provider and closes the picker', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByTestId('location-pill'));
  });
  await act(async () => {
    fireEvent.press(screen.getByText('PICKER-OPEN'));         // stub calls onPick('c9')
  });
  expect(mockSetCityId).toHaveBeenCalledWith('c9');
  expect(screen.queryByText('PICKER-OPEN')).toBeNull();        // picker closed
});
