const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush, back: jest.fn() }),
  useLocalSearchParams: () => ({ id: 'c1' }),
}));
const mockSetCityId = jest.fn();
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ setCityId: mockSetCityId }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../hooks/useActiveCity', () => ({ useActiveCity: () => ({ city: { id: 'c1', name: 'Kyoto', region: 'Kansai', country_code: 'JP', country_name: 'Japan' } }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

const mockGetFavoriteSightIds = jest.fn();
const mockSetFavorite = jest.fn();
jest.mock('../../lib/data/favorites', () => ({
  getFavoriteSightIds: (...args: any[]) => mockGetFavoriteSightIds(...args),
  setFavorite: (...args: any[]) => mockSetFavorite(...args),
}));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import City from '../city/[id]';

const sights = [
  { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: false, type_tags: [] },
  { id: 's2', dex_no: 2, name: 'Louvre',        found: true,  type_tags: [] },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockGetFavoriteSightIds.mockResolvedValue(new Set<string>());
  mockSetFavorite.mockResolvedValue(undefined);
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights,
    completion: { found: 2, total: 5 },
    loading: false,
  });
});

it('shows completion and opens the city map', async () => {
  await renderWithTheme(<City />);
  expect(screen.getByText('2/5 FOUND')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Open map'));
  expect(mockSetCityId).toHaveBeenCalledWith('c1');
  expect(mockReplace).toHaveBeenCalledWith('/(tabs)/map');
});

it('search input filters the sight rows', async () => {
  await renderWithTheme(<City />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('Louvre')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByPlaceholderText('Search Kyoto'), 'Louvre');
  await waitFor(() => expect(screen.queryByText('Eiffel Tower')).toBeNull());
  expect(screen.getByText('Louvre')).toBeOnTheScreen();
});

it('favorite toggle calls setFavorite with (uid, id, true) and flips glyph', async () => {
  // Start with s1 unfavorited
  mockGetFavoriteSightIds.mockResolvedValue(new Set<string>());
  await renderWithTheme(<City />);

  // Wait for favorites to load
  await waitFor(() => expect(mockGetFavoriteSightIds).toHaveBeenCalledWith('u1'));

  // Check s1 shows unfavorited heart
  expect(screen.getAllByText('♡').length).toBeGreaterThanOrEqual(1);

  // Toggle s1's favorite
  await act(async () => {
    fireEvent.press(screen.getByTestId('fav-s1'));
  });

  // setFavorite called with on=true
  expect(mockSetFavorite).toHaveBeenCalledWith('u1', 's1', true);

  // After toggle, s1 shows favorited heart
  await waitFor(() => expect(screen.getAllByText('♥').length).toBeGreaterThanOrEqual(1));
});

it('highlights-btn pushes /highlights/<cityId>', async () => {
  await renderWithTheme(<City />);
  fireEvent.press(screen.getByTestId('highlights-btn'));
  expect(mockPush).toHaveBeenCalledWith('/highlights/c1');
});
