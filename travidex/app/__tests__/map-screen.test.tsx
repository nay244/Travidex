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
const PARIS = { id: 'c1', country_id: 'k1', name: 'Paris', region: null as string | null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' };
const mockUseActiveCity = jest.fn(() => ({ city: PARIS }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => mockUseActiveCity(),
}));
// LocationPicker is no longer used by map (modal stays for submit). Stub harmlessly.
jest.mock('../../components/LocationPicker', () => ({ LocationPicker: () => null }));
// Stub LogFindSheet so modal tests don't need auth/data wiring
jest.mock('../../components/LogFindSheet', () => ({
  LogFindSheet: ({ sightId, onLogged }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`log-sheet-${sightId}`} onPress={onLogged}>LOG-FIND-STUB</Text>;
  },
}));

import React from 'react';
import { Pressable, Text } from 'react-native';
import { screen, fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import MapScreen from '../(tabs)/map';
import { SelectionProvider, useSelection } from '../../context/SelectionProvider';
import { mockAnimateToRegion } from '../../__mocks__/react-native-maps';

// Expose a requestLog button accessible in tests
function RequestLogButton() {
  const { requestLog } = useSelection();
  return <Pressable testID="log-request-probe" onPress={requestLog}><Text>trigger-log</Text></Pressable>;
}

// Wrap MapScreen with the real SelectionProvider + probe button
function WrappedMapScreen() {
  return (
    <SelectionProvider>
      <RequestLogButton />
      <MapScreen />
    </SelectionProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseActiveCity.mockReturnValue({ city: PARIS });
});

it('shows the location pill and pressing it pushes /location', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  const allParis = screen.getAllByText('Paris');
  expect(allParis.length).toBeGreaterThanOrEqual(1);          // pill city name
  expect(screen.getByLabelText('France')).toBeOnTheScreen();  // pill flag
  await act(async () => {
    fireEvent.press(screen.getByTestId('location-pill'));
  });
  expect(mockPush).toHaveBeenCalledWith('/location');
});

it('row press selects the sight and shows banner with sight name', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  // No banner initially
  expect(screen.queryByTestId('selection-banner')).toBeNull();
  await act(async () => {
    fireEvent.press(screen.getByText('Eiffel Tower'));
  });
  expect(screen.getByTestId('selection-banner')).toBeOnTheScreen();
  expect(screen.getByText('Selected: Eiffel Tower')).toBeOnTheScreen();
  // Should not have navigated
  expect(mockPush).not.toHaveBeenCalled();
});

it('chevron (seemore) press navigates to /sight/<id> without selecting', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByTestId('seemore-s1'));
  });
  expect(mockPush).toHaveBeenCalledWith('/sight/s1');
  // No selection banner should appear from see-more
  expect(screen.queryByTestId('selection-banner')).toBeNull();
});

it('banner for unfound sight shows TAP TO LOG and opens log modal', async () => {
  await renderWithTheme(<WrappedMapScreen />);
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
  await renderWithTheme(<WrappedMapScreen />);
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
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Eiffel Tower'));
  });
  // Center is shifted south by 20% of the delta so the pin sits in the
  // visible area above the sheet.
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    {
      latitude: expect.closeTo(48.85 - 0.012 * 0.2, 5),
      longitude: 2.29,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    },
    350,
  );
});

it('selecting a found sight also calls animateToRegion with correct coords', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent.press(screen.getByText('Louvre'));
  });
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    {
      latitude: expect.closeTo(48.86 - 0.012 * 0.2, 5),
      longitude: 2.33,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    },
    350,
  );
});

it('changing the active city recenters the map (regression: map showed the previous city)', async () => {
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  const { ThemeProvider } = require('@/theme');
  const METRICS = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };
  const tree = () => (
    <SafeAreaProvider initialMetrics={METRICS}>
      <ThemeProvider><WrappedMapScreen /></ThemeProvider>
    </SafeAreaProvider>
  );
  const { rerender } = await renderWithTheme(tree());
  mockAnimateToRegion.mockClear();

  // Location screen picks Tokyo → useActiveCity resolves the new city
  mockUseActiveCity.mockReturnValue({
    city: { id: 'c9', country_id: 'k2', name: 'Tokyo', region: 'Kanto', lat: 35.6895, lng: 139.6917, country_code: 'JP', country_name: 'Japan' },
  });
  await act(async () => { rerender(tree()); });

  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    { latitude: 35.6895, longitude: 139.6917, latitudeDelta: 0.08, longitudeDelta: 0.08 },
    350,
  );
});

// --- Search suggestions --------------------------------------------------

it('no suggestion card shown before typing', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
  });
  expect(screen.queryByTestId('suggestion-s1')).toBeNull();
});

it('typing a query while focused shows matching suggestions', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'eiff');
  });
  expect(screen.getByTestId('suggestion-s1')).toBeOnTheScreen();
  expect(screen.queryByTestId('suggestion-s2')).toBeNull();
});

it('typing a query shows no-match row when nothing matches', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'zzz');
  });
  expect(screen.getByText('No sights match')).toBeOnTheScreen();
});

it('pressing a suggestion selects the sight, shows banner, clears query, and calls animateToRegion', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => {
    fireEvent(screen.getByTestId('map-search'), 'focus');
    fireEvent.changeText(screen.getByTestId('map-search'), 'eiff');
  });
  await act(async () => {
    fireEvent.press(screen.getByTestId('suggestion-s1'));
  });
  // Banner visible
  expect(screen.getByTestId('selection-banner')).toBeOnTheScreen();
  // Map focused (center shifted south so the pin clears the sheet)
  expect(mockAnimateToRegion).toHaveBeenCalledWith(
    {
      latitude: expect.closeTo(48.85 - 0.012 * 0.2, 5),
      longitude: 2.29,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    },
    350,
  );
  // Query cleared — suggestion card gone
  expect(screen.queryByTestId('suggestion-s1')).toBeNull();
});

// --- logRequested (stamp FAB) flow --------------------------------------
// Drive context state via user interactions on the DexSheet rows then trigger
// requestLog directly via a probe button — this is cleaner than mount-time effects
// and avoids batching ordering issues.

it('logRequested=true with unfound selection opens the log modal', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  // First select an unfound sight via row press (same as other tests)
  await act(async () => { fireEvent.press(screen.getByText('Eiffel Tower')); });
  // Then simulate the stamp FAB calling requestLog
  await act(async () => { fireEvent.press(screen.getByTestId('log-request-probe')); });
  expect(screen.getByTestId('log-sheet-s1')).toBeOnTheScreen();
});

it('logRequested=true with found selection navigates to success with already:1', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  await act(async () => { fireEvent.press(screen.getByText('Louvre')); });
  await act(async () => { fireEvent.press(screen.getByTestId('log-request-probe')); });
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/find/success', params: { sightId: 's2', already: '1' } });
});

it('logRequested=true with no selection does nothing', async () => {
  await renderWithTheme(<WrappedMapScreen />);
  // No selection — just trigger requestLog
  await act(async () => { fireEvent.press(screen.getByTestId('log-request-probe')); });
  expect(mockPush).not.toHaveBeenCalled();
  expect(screen.queryByTestId('log-sheet-s1')).toBeNull();
});
