// Regression test: routes in the ROOT stack (e.g. /location, /city/[id],
// /find/*) must receive a working CityProvider. When the provider lived only
// in (tabs)/_layout, those screens got the default no-op setCityId — picking
// a city in the location screen silently did nothing.

// Fonts + react-native-purchases are globally mocked via moduleNameMapper.
jest.mock('../../context/AuthProvider', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({ session: { user: { id: 'u1' } }, loading: false }),
}));
jest.mock('../../context/EntitlementProvider', () => ({
  EntitlementProvider: ({ children }: any) => children,
}));

// Stand in for the root <Stack/>: render a probe screen that consumes the
// REAL city context, exactly like app/location.tsx does.
jest.mock('expo-router', () => {
  const { Pressable, Text } = require('react-native');
  const { useCity } = require('../../context/CityProvider');
  function RootStackProbe() {
    const { cityId, setCityId } = useCity();
    return (
      <Pressable testID="pick-city" onPress={() => setCityId('picked-city')}>
        <Text testID="city-id">{cityId}</Text>
      </Pressable>
    );
  }
  return { Stack: RootStackProbe };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RootLayout from '../_layout';

it('root-stack screens get a functional setCityId (location screen relies on this)', async () => {
  await render(<RootLayout />);
  fireEvent.press(screen.getByTestId('pick-city'));
  await waitFor(() => expect(screen.getByTestId('city-id')).toHaveTextContent('picked-city'));
});
