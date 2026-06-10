// Mocks must precede imports
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

jest.mock('../../lib/data/gems', () => ({
  getGemsForCity: jest.fn(),
  setGemFavorite: jest.fn(),
  reportGem: jest.fn(),
}));

const mockUseCity = jest.fn(() => ({ cityId: 'city1', setCityId: jest.fn() }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => mockUseCity() }));

const mockUseAuth = jest.fn(() => ({ session: { user: { id: 'u1' } } }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => mockUseAuth() }));

const mockUseActiveCity = jest.fn((_id?: string) => ({ city: { id: 'city1', name: 'Paris', country_code: 'FR', lat: 48.85, lng: 2.35 } }));
jest.mock('../../hooks/useActiveCity', () => ({ useActiveCity: (id: string) => mockUseActiveCity(id) }));

jest.mock('../../lib/relativeTime', () => ({ relativeTime: (_iso: string) => '2d ago' }));

import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { renderWithTheme } from '../../test-utils';
import { getGemsForCity, setGemFavorite, reportGem } from '../../lib/data/gems';
import { GemsTab } from '../GemsTab';

const GEM_A = {
  id: 'g1', author_id: 'u2', author_name: 'Alice', name: 'Secret Passage',
  note: 'Hidden alley', photo_url: 'https://img/g1.jpg', lat: 48.85, lng: 2.35,
  status: 'approved' as const, favs_count: 10, created_at: '2026-01-01T00:00:00Z',
  approved_at: '2026-01-02T00:00:00Z', faved: false, distance_m: 500,
};

const GEM_B = {
  id: 'g2', author_id: 'u3', author_name: 'Bob', name: 'Rooftop Garden',
  note: null, photo_url: 'https://img/g2.jpg', lat: 48.86, lng: 2.36,
  status: 'approved' as const, favs_count: 3, created_at: '2026-02-01T00:00:00Z',
  approved_at: '2026-02-02T00:00:00Z', faved: true, distance_m: 200,
};

const GEM_PENDING = {
  id: 'g3', author_id: 'u1', author_name: 'Me', name: 'My Draft Gem',
  note: null, photo_url: '', lat: 48.85, lng: 2.35,
  status: 'pending' as const, favs_count: 0, created_at: '2026-06-01T00:00:00Z',
  approved_at: null, faved: false, distance_m: 0,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ session: { user: { id: 'u1' } } });
  mockUseCity.mockReturnValue({ cityId: 'city1', setCityId: jest.fn() });
  mockUseActiveCity.mockReturnValue({ city: { id: 'city1', name: 'Paris', country_code: 'FR', lat: 48.85, lng: 2.35 } });
  (getGemsForCity as jest.Mock).mockResolvedValue([GEM_A, GEM_B, GEM_PENDING]);
  (setGemFavorite as jest.Mock).mockResolvedValue(undefined);
  (reportGem as jest.Mock).mockResolvedValue(undefined);
});

it('renders approved gem cards', async () => {
  const { findByText } = await renderWithTheme(<GemsTab />);
  expect(await findByText('Secret Passage')).toBeTruthy();
  expect(await findByText('Rooftop Garden')).toBeTruthy();
});

it('pending own gem pins to top with IN REVIEW badge and no star chip', async () => {
  const { findByText, queryByTestId } = await renderWithTheme(<GemsTab />);
  expect(await findByText('My Draft Gem')).toBeTruthy();
  expect(await findByText('IN REVIEW')).toBeTruthy();
  expect(queryByTestId('star-g3')).toBeNull();
});

it('default sort (Most favorited) shows higher-favs gem first', async () => {
  const { findAllByText } = await renderWithTheme(<GemsTab />);
  const cards = await findAllByText(/Secret Passage|Rooftop Garden/);
  // GEM_A (favs=10) should come before GEM_B (favs=3)
  expect(cards[0].props.children).toBe('Secret Passage');
});

it('sort-newest reorders to newest approved_at first', async () => {
  const { findByTestId, findAllByText } = await renderWithTheme(<GemsTab />);
  fireEvent.press(await findByTestId('sort-newest'));
  // GEM_B approved 2026-02-02 > GEM_A approved 2026-01-02
  await waitFor(async () => {
    const cards = await findAllByText(/Secret Passage|Rooftop Garden/);
    expect(cards[0].props.children).toBe('Rooftop Garden');
  });
});

it('sort-nearest reorders to closest distance first', async () => {
  const { findByTestId, findAllByText } = await renderWithTheme(<GemsTab />);
  fireEvent.press(await findByTestId('sort-nearest'));
  // GEM_B distance=200 < GEM_A distance=500
  await waitFor(async () => {
    const cards = await findAllByText(/Secret Passage|Rooftop Garden/);
    expect(cards[0].props.children).toBe('Rooftop Garden');
  });
});

it('star toggle calls setGemFavorite and optimistically updates count', async () => {
  const { findByTestId } = await renderWithTheme(<GemsTab />);
  const starBtn = await findByTestId('star-g1');
  // GEM_A faved=false, favs_count=10 → pressing should fave it → count becomes 11
  fireEvent.press(starBtn);
  expect(setGemFavorite).toHaveBeenCalledWith('u1', 'g1', true);
  await waitFor(async () => expect(await findByTestId('star-g1')).toHaveTextContent('★ 11'));
});

it('star toggle reverts on error', async () => {
  (setGemFavorite as jest.Mock).mockRejectedValue(new Error('network error'));
  const { findByTestId } = await renderWithTheme(<GemsTab />);
  fireEvent.press(await findByTestId('star-g1'));
  await waitFor(async () => expect(await findByTestId('star-g1')).toHaveTextContent('★ 10'));
});

it('report flow calls reportGem and swaps card to Reported state', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert');
  const { findByTestId, findByText } = await renderWithTheme(<GemsTab />);
  fireEvent.press(await findByTestId('report-g1'));
  expect(alertSpy).toHaveBeenCalledWith('Report this gem?', undefined, expect.arrayContaining([
    expect.objectContaining({ text: 'Report', style: 'destructive' }),
  ]));
  const [, , buttons] = alertSpy.mock.calls[0] as any;
  const reportBtn = buttons.find((b: any) => b.text === 'Report');
  reportBtn.onPress();
  expect(reportGem).toHaveBeenCalledWith('u1', 'g1');
  expect(await findByText('Reported · under review')).toBeTruthy();
});

it('share-gem button routes to /community/share-gem', async () => {
  const { findByTestId } = await renderWithTheme(<GemsTab />);
  fireEvent.press(await findByTestId('share-gem-btn'));
  expect(mockPush).toHaveBeenCalledWith('/community/share-gem');
});

it('shows empty state when no gems', async () => {
  (getGemsForCity as jest.Mock).mockResolvedValue([]);
  const { findByText } = await renderWithTheme(<GemsTab />);
  expect(await findByText(/No gems near Paris yet/)).toBeTruthy();
});
