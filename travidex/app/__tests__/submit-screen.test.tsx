const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1' }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/community', () => ({ submitSight: jest.fn() }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: (id: string) => ({
    city: id === 'c1'
      ? { id: 'c1', country_id: 'k1', name: 'Paris', region: null, lat: 48.8566, lng: 2.3522, country_code: 'FR', country_name: 'France' }
      : { id: 'c9', country_id: 'k2', name: 'Berlin', region: null, lat: 52.52, lng: 13.405, country_code: 'DE', country_name: 'Germany' },
  }),
}));
// Stub LocationPicker: when visible, renders a pressable that fires onPick with a new city id
jest.mock('../../components/LocationPicker', () => ({
  LocationPicker: ({ visible, onPick }: any) => {
    const { Text } = require('react-native');
    return visible ? <Text onPress={() => onPick('c9')}>PICKER-OPEN</Text> : null;
  },
}));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { submitSight } from '../../lib/data/community';
import Submit from '../community/submit';

beforeEach(() => jest.clearAllMocks());

it('back-btn calls router.back()', async () => {
  await renderWithTheme(<Submit />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('requires a name', async () => {
  await renderWithTheme(<Submit />);
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(screen.getByText('Name is required')).toBeOnTheScreen());
  expect(submitSight).not.toHaveBeenCalled();
});

it('shows the current city name', async () => {
  await renderWithTheme(<Submit />);
  expect(screen.getByText('City: Paris')).toBeOnTheScreen();
});

it('submits with the active city', async () => {
  (submitSight as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Submit />);
  await act(async () => {
    fireEvent.changeText(screen.getByPlaceholderText('Sight name'), 'Hidden Cafe');
  });
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(submitSight).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'Hidden Cafe', cityId: 'c1' })));
});

it('picking a different city updates the submit city_id', async () => {
  (submitSight as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Submit />);
  // Open picker
  await act(async () => {
    fireEvent.press(screen.getByTestId('city-picker-row'));
  });
  expect(screen.getByText('PICKER-OPEN')).toBeOnTheScreen();
  // Pick city c9
  await act(async () => {
    fireEvent.press(screen.getByText('PICKER-OPEN'));
  });
  // Picker closed, city changed to Berlin
  expect(screen.queryByText('PICKER-OPEN')).toBeNull();
  expect(screen.getByText('City: Berlin')).toBeOnTheScreen();
  // Submit uses the new city id
  await act(async () => {
    fireEvent.changeText(screen.getByPlaceholderText('Sight name'), 'Brandenburg Gate');
  });
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(submitSight).toHaveBeenCalledWith('u1', expect.objectContaining({ cityId: 'c9' })));
});
