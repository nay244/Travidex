const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
jest.mock('../../context/EntitlementProvider', () => ({
  useEntitlement: jest.fn(),
}));
jest.mock('../../lib/data/profile', () => ({
  getArtId: jest.fn(() => Promise.resolve('trailhead')),
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import { useEntitlement } from '../../context/EntitlementProvider';
import Profile from '../(tabs)/profile';

beforeEach(() => {
  jest.clearAllMocks();
  (useProfile as jest.Mock).mockReturnValue({
    stats: {
      totalFinds: 12,
      citiesClaimed: 2,
      countriesExplored: 1,
      worldFound: 62,
      worldTotal: 400,
    },
    earnedBadges: ['first_find'],
    loading: false,
  });
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: false });
});

it('renders stat values', async () => {
  await renderWithTheme(<Profile />);
  expect(screen.getByText('12')).toBeOnTheScreen();
  expect(screen.getByText('Sights found')).toBeOnTheScreen();
  expect(screen.getByText('2')).toBeOnTheScreen();
  expect(screen.getByText('Cities claimed')).toBeOnTheScreen();
  expect(screen.getByText('1')).toBeOnTheScreen();
  expect(screen.getByText('Countries')).toBeOnTheScreen();
});

it('settings-chip routes to /profile/settings', async () => {
  await renderWithTheme(<Profile />);
  fireEvent.press(screen.getByTestId('settings-chip'));
  expect(mockPush).toHaveBeenCalledWith('/profile/settings');
});

it('badges rail shows 1 earned + 3 lock placeholders', async () => {
  await renderWithTheme(<Profile />);
  // earnedBadges = ['first_find'] → rail-badge-0 earned, rail-badge-1/2/3 locked
  const b0 = screen.getByTestId('rail-badge-0');
  expect(b0).toBeOnTheScreen();
  expect(screen.getByTestId('rail-badge-1')).toBeOnTheScreen();
  expect(screen.getByTestId('rail-badge-2')).toBeOnTheScreen();
  expect(screen.getByTestId('rail-badge-3')).toBeOnTheScreen();
});

it('badges-page-btn routes to /profile/badges', async () => {
  await renderWithTheme(<Profile />);
  fireEvent.press(screen.getByTestId('badges-page-btn'));
  expect(mockPush).toHaveBeenCalledWith('/profile/badges');
});

it('achievements-page-btn routes to /profile/achievements', async () => {
  await renderWithTheme(<Profile />);
  fireEvent.press(screen.getByTestId('achievements-page-btn'));
  expect(mockPush).toHaveBeenCalledWith('/profile/achievements');
});

it('nav-appearance routes to /profile/appearance', async () => {
  await renderWithTheme(<Profile />);
  fireEvent.press(screen.getByTestId('nav-appearance'));
  expect(mockPush).toHaveBeenCalledWith('/profile/appearance');
});

it('nav-profile-art routes to /profile/art', async () => {
  await renderWithTheme(<Profile />);
  fireEvent.press(screen.getByTestId('nav-profile-art'));
  expect(mockPush).toHaveBeenCalledWith('/profile/art');
});

it('shows TRAVIDEX+ tag when not premium', async () => {
  await renderWithTheme(<Profile />);
  expect(screen.getByText('TRAVIDEX+')).toBeOnTheScreen();
});

it('hides TRAVIDEX+ tag when premium', async () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: true });
  await renderWithTheme(<Profile />);
  expect(screen.queryByText('TRAVIDEX+')).toBeNull();
});

it('does not show Photo journal on profile screen', async () => {
  await renderWithTheme(<Profile />);
  expect(screen.queryByText('Photo journal')).toBeNull();
});
