const mockBack = jest.fn();
const mockSetCityId = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1', setCityId: mockSetCityId }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({ city: { id: 'c1', country_id: 'k1', name: 'Paris', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' } }),
}));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn(), getCountryProgress: jest.fn() }));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress, getCountryProgress } from '../../lib/data/progress';
import LocationScreen from '../location';

// Reuse the same fixtures as LocationPicker.test.tsx
const COUNTRIES = [
  { id: 'k1', name: 'France', code: 'FR', created_at: '' },
  { id: 'k2', name: 'Japan', code: 'JP', created_at: '' },
];
const FR_CITIES = [
  { id: 'c1', country_id: 'k1', name: 'Paris', region: 'Île-de-France', lat: 48.85, lng: 2.35 },
  { id: 'c2', country_id: 'k1', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', lat: 45.76, lng: 4.83 },
  { id: 'c4', country_id: 'k1', name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', lat: 43.71, lng: 7.26 },
];
const JP_CITIES = [{ id: 'c3', country_id: 'k2', name: 'Kyoto', region: 'Kansai', lat: 35.0, lng: 135.77 }];

beforeEach(() => {
  jest.clearAllMocks();
  (getCountries as jest.Mock).mockResolvedValue(COUNTRIES);
  (getCitiesForCountry as jest.Mock).mockImplementation((id: string) =>
    Promise.resolve(id === 'k1' ? FR_CITIES : JP_CITIES),
  );
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([
    ['c1', { found: 3, total: 8 }],
    ['c2', { found: 0, total: 5 }],
    ['c4', { found: 5, total: 5 }],
  ]));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([
    ['k1', { found: 3, total: 13 }],
    ['k2', { found: 0, total: 8 }],
  ]));
});

it('renders header with title and back button', async () => {
  await renderWithTheme(<LocationScreen />);
  expect(screen.getByText('Change location')).toBeOnTheScreen();
  expect(screen.getByTestId('back-btn')).toBeOnTheScreen();
});

it('back-btn calls router.back()', async () => {
  await renderWithTheme(<LocationScreen />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('renders current country card and city rows', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  expect(screen.getByText('France')).toBeOnTheScreen();
  expect(screen.getByText('Lyon')).toBeOnTheScreen();
});

it('in-progress city shows amber fraction', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  // c1=Paris: 3/8 in-progress
  const fraction = screen.getByText('3/8');
  expect(fraction.props.style).toEqual(
    expect.objectContaining({ color: expect.stringMatching(/^#(bd7d12|e0a23c)$/i) }),
  );
});

it('claimed city (found===total>0) shows green fraction', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('Nice')).toBeOnTheScreen());
  // c4=Nice: 5/5 claimed
  const fraction = screen.getByText('5/5');
  expect(fraction.props.style).toEqual(
    expect.objectContaining({ color: expect.stringMatching(/green|#[0-9a-fA-F]{6}/i) }),
  );
});

it('search filters city rows', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  await act(async () => {
    fireEvent.changeText(screen.getByPlaceholderText('Search cities in France'), 'ly');
  });
  expect(screen.queryByText('Paris')).toBeNull();
  expect(screen.getByText('Lyon')).toBeOnTheScreen();
});

it('pressing Change chip navigates to countries view', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('France')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Change'));
  await waitFor(() => expect(screen.getByText('Choose a country')).toBeOnTheScreen());
});

it('picking a country in countries view switches back to cities for that country', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('France')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Change'));
  await waitFor(() => expect(screen.getByText('Choose a country')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Japan'));
  await waitFor(() => expect(screen.getByText('Kyoto')).toBeOnTheScreen());
});

it('picking a city calls setCityId and router.back()', async () => {
  await renderWithTheme(<LocationScreen />);
  await waitFor(() => expect(screen.getByText('Lyon')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Lyon'));
  expect(mockSetCityId).toHaveBeenCalledWith('c2');
  expect(mockBack).toHaveBeenCalled();
});
