const mockPush = jest.fn();
const mockSetCityId = jest.fn();
const mockReload = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: (cb: () => void) => { cb(); },
}));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1', setCityId: mockSetCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({
  useCityCatalog: () => ({
    sights: [
      { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: false, lat: 48.85, lng: 2.29 },
      { id: 's2', dex_no: 2, name: 'Louvre',        found: true,  lat: 48.86, lng: 2.33 },
    ],
    completion: { found: 1, total: 2 },
    loading: false,
    reload: mockReload,
  }),
}));
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
// Stub LogFindSheet so modal tests don't need auth/data wiring
jest.mock('../../components/LogFindSheet', () => ({
  LogFindSheet: ({ sightId, onLogged }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`log-sheet-${sightId}`} onPress={onLogged}>LOG-FIND-STUB</Text>;
  },
}));

import { screen, fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import MapScreen from '../(tabs)/map';
import { mockAnimateToRegion } from '../../__mocks__/react-native-maps';

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

it('row press selects the sight and shows banner with sight name', async () => {
  await renderWithTheme(<MapScreen />);
  // No banner initially
  expect(screen.queryByTestId('selection-banner')).toBeNull();
  await act(async () => {
    fireEvent.press(screen.getByText('Eiffel Tower'));
  });
  expect(screen.getByTestId('selection-banner')).toBeOnTheScreen();
  expect(screen.getByText('Selected Eiffel Tower')).toBeOnTheScreen();
  // Should not have navigated
  expect(mockPush).not.toHaveBeenCalled();
});

it('chevron (seemore) press navigates to /sight/<id> without selecting', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByTestId('seemore-s1'));
  });
  expect(mockPush).toHaveBeenCalledWith('/sight/s1');
  // No selection banner should appear from see-more
  expect(screen.queryByTestId('selection-banner')).toBeNull();
});

it('banner for unfound sight shows TAP TO LOG and opens log modal', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Eiffel Tower'));
  });
  expect(screen.getByTestId('banner-tap-to-log')).toBeOnTheScreen();
  await act(async () => {
    fireEvent.press(screen.getByTestId('selection-banner'));
  });
  // Log sheet stub is rendered in the modal
  expect(screen.getByTestId('log-sheet-s1')).toBeOnTheScreen();
});

it('banner for found sight shows "Already in your dex" and routes to success with already:1', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Louvre'));
  });
  expect(screen.getByText('Already in your dex')).toBeOnTheScreen();
  await act(async () => {
    fireEvent.press(screen.getByTestId('selection-banner'));
  });
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/find/success', params: { sightId: 's2', already: '1' } });
});

// --- Map focus -----------------------------------------------------------

it('selecting a sight calls animateToRegion with the sight coords', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Eiffel Tower'));
  });
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    { latitude: 48.85, longitude: 2.29, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    350,
  );
});

it('selecting a found sight also calls animateToRegion with correct coords', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Louvre'));
  });
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    { latitude: 48.86, longitude: 2.33, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    350,
  );
});

// --- Search suggestions --------------------------------------------------

it('no suggestion card shown before typing', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
  });
  expect(screen.queryByTestId('suggestion-s1')).toBeNull();
});

it('typing a query while focused shows matching suggestions', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'eiff');
  });
  expect(screen.getByTestId('suggestion-s1')).toBeOnTheScreen();
  expect(screen.queryByTestId('suggestion-s2')).toBeNull();
});

it('typing a query shows no-match row when nothing matches', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'zzz');
  });
  expect(screen.getByText('No sights match')).toBeOnTheScreen();
});

it('pressing a suggestion selects the sight, shows banner, clears query, and calls animateToRegion', async () => {
  await renderWithTheme(<MapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'eiff');
  });
  await act(async () => {
    fireEvent.press(screen.getByTestId('suggestion-s1'));
  });
  // Banner visible
  expect(screen.getByTestId('selection-banner')).toBeOnTheScreen();
  // Map focused
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    { latitude: 48.85, longitude: 2.29, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    350,
  );
  // Query cleared — suggestion card gone
  expect(screen.queryByTestId('suggestion-s1')).toBeNull();
});
