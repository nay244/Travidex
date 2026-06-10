const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({
  getCountryProgress: jest.fn(),
  getCityProgress: jest.fn(),
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCountryProgress, getCityProgress } from '../../lib/data/progress';
import Explore from '../(tabs)/explore';

beforeEach(() => jest.clearAllMocks());

// Fixtures
const FRANCE: import('../../lib/types').Country = { id: 'fr', name: 'France', code: 'FR', tier: 'cities', created_at: '' };
const PARIS: import('../../lib/types').City = { id: 'c-paris', country_id: 'fr', name: 'Paris', region: null, lat: 0, lng: 0 };
const LYON: import('../../lib/types').City = { id: 'c-lyon', country_id: 'fr', name: 'Lyon', region: null, lat: 0, lng: 0 };

const US: import('../../lib/types').Country = { id: 'us', name: 'United States', code: 'US', tier: 'states', created_at: '' };
const LOS_ANGELES: import('../../lib/types').City = { id: 'c-la', country_id: 'us', name: 'Los Angeles', region: 'California', lat: 0, lng: 0 };
const SAN_FRANCISCO: import('../../lib/types').City = { id: 'c-sf', country_id: 'us', name: 'San Francisco', region: 'California', lat: 0, lng: 0 };
const LAS_VEGAS: import('../../lib/types').City = { id: 'c-lv', country_id: 'us', name: 'Las Vegas', region: 'Nevada', lat: 0, lng: 0 };

function setupFranceMocks() {
  (getCountries as jest.Mock).mockResolvedValue([FRANCE, US]);
  (getCitiesForCountry as jest.Mock).mockResolvedValue([PARIS, LYON]);
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([
    ['fr', { found: 1, total: 5 }],
    ['us', { found: 0, total: 10 }],
  ]));
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([
    ['c-paris', { found: 1, total: 3 }],
    ['c-lyon', { found: 0, total: 2 }],
  ]));
}

function setupUSMocks() {
  (getCountries as jest.Mock).mockResolvedValue([FRANCE, US]);
  (getCitiesForCountry as jest.Mock).mockImplementation((countryId: string) => {
    if (countryId === 'us') return Promise.resolve([LOS_ANGELES, SAN_FRANCISCO, LAS_VEGAS]);
    return Promise.resolve([PARIS, LYON]);
  });
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([
    ['fr', { found: 1, total: 5 }],
    ['us', { found: 2, total: 10 }],
  ]));
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([
    ['c-paris', { found: 1, total: 3 }],
    ['c-lyon', { found: 0, total: 2 }],
    ['c-la', { found: 2, total: 4 }],
    ['c-sf', { found: 0, total: 3 }],
    ['c-lv', { found: 1, total: 3 }],
  ]));
}

it('renders the pill with the default country code and city tiles for a cities-tier country; tapping a city tile pushes /city/<id>', async () => {
  setupFranceMocks();
  renderWithTheme(<Explore />);

  // Pill shows FR (first country)
  await waitFor(() => expect(screen.getByTestId('country-pill')).toBeOnTheScreen());
  expect(screen.getByText('FR')).toBeOnTheScreen();

  // City tiles visible
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());
  expect(screen.getByText('Lyon')).toBeOnTheScreen();

  // Tapping a city tile routes to /city/<id>
  fireEvent.press(screen.getByText('Paris'));
  expect(mockPush).toHaveBeenCalledWith('/city/c-paris');
});

it('opening the picker and picking the US switches the board to state tiles (region names visible, city names not visible)', async () => {
  setupUSMocks();
  renderWithTheme(<Explore />);

  // Wait for initial load (France cities-tier)
  await waitFor(() => expect(screen.getByText('FR')).toBeOnTheScreen());
  await waitFor(() => expect(screen.getByText('Paris')).toBeOnTheScreen());

  // Open picker
  fireEvent.press(screen.getByTestId('country-pill'));
  await waitFor(() => expect(screen.getByText('United States')).toBeOnTheScreen());

  // Pick US
  fireEvent.press(screen.getByText('United States'));

  // Board switches to state tiles
  await waitFor(() => expect(screen.getByText('California')).toBeOnTheScreen());
  expect(screen.getByText('Nevada')).toBeOnTheScreen();

  // Individual city names should NOT appear (they're grouped under state tiles)
  expect(screen.queryByText('Los Angeles')).toBeNull();
  expect(screen.queryByText('San Francisco')).toBeNull();
  expect(screen.queryByText('Las Vegas')).toBeNull();
});

it('tapping a state tile shows that state\'s city tiles plus breadcrumb; breadcrumb returns to states', async () => {
  setupUSMocks();
  // Default first country is France; we need to start with US selected
  (getCountries as jest.Mock).mockResolvedValue([US, FRANCE]);
  (getCitiesForCountry as jest.Mock).mockResolvedValue([LOS_ANGELES, SAN_FRANCISCO, LAS_VEGAS]);

  renderWithTheme(<Explore />);

  // Wait for US state tiles
  await waitFor(() => expect(screen.getByText('California')).toBeOnTheScreen());

  // Tap California state tile
  fireEvent.press(screen.getByText('California'));

  // City tiles for California appear
  await waitFor(() => expect(screen.getByText('Los Angeles')).toBeOnTheScreen());
  expect(screen.getByText('San Francisco')).toBeOnTheScreen();
  expect(screen.queryByText('Las Vegas')).toBeNull();

  // Breadcrumb is visible
  expect(screen.getByTestId('breadcrumb')).toBeOnTheScreen();
  expect(screen.getByText('‹ United States · all states')).toBeOnTheScreen();

  // Press breadcrumb → returns to states
  fireEvent.press(screen.getByTestId('breadcrumb'));
  await waitFor(() => expect(screen.getByText('California')).toBeOnTheScreen());
  expect(screen.queryByText('Los Angeles')).toBeNull();
});

it('state tile aggregation: state found/total = sum of its cities', async () => {
  setupUSMocks();
  (getCountries as jest.Mock).mockResolvedValue([US, FRANCE]);
  (getCitiesForCountry as jest.Mock).mockResolvedValue([LOS_ANGELES, SAN_FRANCISCO, LAS_VEGAS]);

  renderWithTheme(<Explore />);

  // California: LA (2/4) + SF (0/3) = 2/7
  await waitFor(() => expect(screen.getByText('California')).toBeOnTheScreen());
  expect(screen.getByText('2/7')).toBeOnTheScreen();

  // Nevada: LV (1/3) = 1/3
  expect(screen.getByText('Nevada')).toBeOnTheScreen();
  expect(screen.getByText('1/3')).toBeOnTheScreen();
});
