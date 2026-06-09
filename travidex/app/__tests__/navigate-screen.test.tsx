jest.mock('expo-router', () => ({ useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
import { screen, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { renderWithTheme } from '../../test-utils';
import { useSight } from '../../hooks/useSight';
import Navigate from '../sight/[id]/navigate';

beforeEach(() => jest.clearAllMocks());

it('opens Google Maps directions on Driving → Google', async () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  (useSight as jest.Mock).mockReturnValue({ sight: { id: 's1', name: 'Tower', lat: 48.8584, lng: 2.2945 }, loading: false });
  await renderWithTheme(<Navigate />);
  fireEvent.press(screen.getByText('Driving'));
  expect(await screen.findByText('Google Maps')).toBeTruthy();
  fireEvent.press(screen.getByText('Google Maps'));
  expect(openURL).toHaveBeenCalledWith('https://www.google.com/maps/dir/?api=1&destination=48.8584,2.2945&travelmode=driving');
});
