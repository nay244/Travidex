const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack, push: mockPush }), useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCityWithCountry: jest.fn() }));
jest.mock('../../lib/data/favorites', () => ({ getFavoriteSightIds: jest.fn(), setFavorite: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'test-user-id' } }, loading: false }),
}));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn().mockResolvedValue([]), uploadUserPhoto: jest.fn() }));

import { Share } from 'react-native';
import { screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useSight } from '../../hooks/useSight';
import { getCityWithCountry } from '../../lib/data/citiesByCountry';
import { getFavoriteSightIds, setFavorite } from '../../lib/data/favorites';
import SightDetail from '../sight/[id]';

const baseSight = {
  id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'],
  about: 'Tower', hint: 'South side', access: 'Easy', size: 'Large',
  busyness: 'Busy', lat: 48.85, lng: 2.29, city_id: 'city1',
};

beforeEach(() => {
  jest.clearAllMocks();
  (getCityWithCountry as jest.Mock).mockResolvedValue({ id: 'city1', name: 'Paris', country_name: 'France', country_code: 'FR' });
  (getFavoriteSightIds as jest.Mock).mockResolvedValue(new Set<string>());
  (setFavorite as jest.Mock).mockResolvedValue(undefined);
});

it('renders the entry and routes to navigate', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('Easy')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Navigate'));
  expect(mockPush).toHaveBeenCalledWith('/sight/s1/navigate');
});

it('shows hero-unfound when not found', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { ...baseSight, hint: null },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByTestId('hero-unfound')).toBeOnTheScreen();
  expect(screen.queryByTestId('hero-found')).toBeNull();
});

it('shows hero-found when found', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { ...baseSight, hint: null },
    found: true, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByTestId('hero-found')).toBeOnTheScreen();
  expect(screen.queryByTestId('hero-unfound')).toBeNull();
});

it('back-btn calls router.back()', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { ...baseSight, hint: null, type_tags: [] },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('hint text is visible by default and hidden after pressing toggle', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  // Expanded by default
  expect(screen.getByText('South side')).toBeOnTheScreen();
  // Collapse on press
  await act(async () => { fireEvent.press(screen.getByTestId('hint-toggle')); });
  expect(screen.queryByText('South side')).toBeNull();
});

it('fav-toggle calls setFavorite with correct args', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  await act(async () => { fireEvent.press(screen.getByTestId('fav-toggle')); });
  // setFavorite may be called async; wait briefly
  await waitFor(() => expect(setFavorite).toHaveBeenCalledWith(expect.any(String), 's1', true));
});

it('share-btn calls Share.share', async () => {
  const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as any);
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  await act(async () => { fireEvent.press(screen.getByTestId('share-btn')); });
  expect(shareSpy).toHaveBeenCalledWith(
    expect.objectContaining({ message: expect.stringContaining('Eiffel Tower') })
  );
  shareSpy.mockRestore();
});

it('renders location line when city resolves', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  await waitFor(() => expect(screen.getByTestId('location-line')).toBeOnTheScreen());
  expect(screen.getByText('Paris, France')).toBeOnTheScreen();
});

it('shows photos-nudge when unfound', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByTestId('photos-nudge')).toBeOnTheScreen();
  expect(screen.getByText('Log this find to start your photo collection.')).toBeOnTheScreen();
});

it('renders recent find rows and this-week count', async () => {
  const now = new Date();
  const recentFinds = [
    { id: 'f1', comment: null, found_at: now.toISOString(), user_id: 'alice123' },
    { id: 'f2', comment: null, found_at: now.toISOString(), user_id: 'bob456' },
  ];
  (useSight as jest.Mock).mockReturnValue({
    sight: baseSight,
    found: false, recentFinds, loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  const rows = screen.getAllByTestId('recent-find-row');
  expect(rows.length).toBe(2);
  expect(screen.getByTestId('this-week-count')).toBeOnTheScreen();
});
