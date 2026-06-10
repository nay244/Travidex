jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn(), getCountryProgress: jest.fn() }));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress, getCountryProgress } from '../../lib/data/progress';
import { LocationPicker } from '../LocationPicker';

const COUNTRIES = [
  { id: 'k1', name: 'France', code: 'FR', created_at: '' },
  { id: 'k2', name: 'Japan', code: 'JP', created_at: '' },
];
const FR_CITIES = [
  { id: 'c1', country_id: 'k1', name: 'Paris', region: 'Île-de-France', lat: 48.85, lng: 2.35 },
  { id: 'c2', country_id: 'k1', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', lat: 45.76, lng: 4.83 },
];
const JP_CITIES = [{ id: 'c3', country_id: 'k2', name: 'Kyoto', region: 'Kansai', lat: 35.0, lng: 135.77 }];

beforeEach(() => {
  jest.clearAllMocks();
  (getCountries as jest.Mock).mockResolvedValue(COUNTRIES);
  (getCitiesForCountry as jest.Mock).mockImplementation((id: string) => Promise.resolve(id === 'k1' ? FR_CITIES : JP_CITIES));
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 3, total: 8 }], ['c2', { found: 0, total: 5 }]]));
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 3, total: 13 }], ['k2', { found: 0, total: 8 }]]));
});

it('lists cities with progress and picks one', async () => {
  const onPick = jest.fn();
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={onPick} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  expect(screen.getByText('3/8')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Lyon'));
  expect(onPick).toHaveBeenCalledWith('c2');
});

it('filters cities by search', async () => {
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={jest.fn()} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  await act(async () => { fireEvent.changeText(screen.getByPlaceholderText('Search cities in France'), 'ly'); });
  expect(screen.queryByText('Paris')).toBeNull();
  expect(screen.getByText('Lyon')).toBeOnTheScreen();
});

it('switches country via the countries view', async () => {
  await renderWithTheme(<LocationPicker visible currentCityId="c1" initialCountryId="k1" onPick={jest.fn()} onClose={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Change'));
  await waitFor(() => expect(screen.getByText('Choose a country')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Japan'));
  await waitFor(() => expect(screen.getByText('Kyoto')).toBeOnTheScreen());
});
