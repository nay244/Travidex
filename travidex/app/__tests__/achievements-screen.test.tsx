// Mocks must be declared before imports
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: jest.fn(),
}));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import { useLocalSearchParams } from 'expo-router';
import AchievementsGrid from '../profile/achievements/index';
import AchievementDetail from '../profile/achievements/[id]';
import Profile from '../(tabs)/profile';

// Stats: totalFinds=12, citiesClaimed=1, countriesExplored=1
// first_steps  (goal=1, value=12) → done
// ten_sights   (goal=10, value=12) → done
// fifty_sights (goal=50, value=12) → locked
// city_claimer (goal=1, value=1)  → done
// globetrotter (goal=5, value=1)  → locked
const STATS = { totalFinds: 12, citiesClaimed: 1, countriesExplored: 1 };

beforeEach(() => {
  jest.clearAllMocks();
  (useProfile as jest.Mock).mockReturnValue({ stats: STATS, earnedBadges: [], loading: false });
});

describe('AchievementsGrid', () => {
  it('renders all 5 achievements with correct done/locked testIDs', async () => {
    await renderWithTheme(<AchievementsGrid />);
    expect(screen.getByTestId('ach-first_steps-done')).toBeOnTheScreen();
    expect(screen.getByTestId('ach-ten_sights-done')).toBeOnTheScreen();
    expect(screen.getByTestId('ach-fifty_sights-locked')).toBeOnTheScreen();
    expect(screen.getByTestId('ach-city_claimer-done')).toBeOnTheScreen();
    expect(screen.getByTestId('ach-globetrotter-locked')).toBeOnTheScreen();
  });

  it('card press routes to detail', async () => {
    await renderWithTheme(<AchievementsGrid />);
    fireEvent.press(screen.getByTestId('ach-first_steps-done'));
    expect(mockPush).toHaveBeenCalledWith('/profile/achievements/first_steps');
  });
});

describe('AchievementDetail', () => {
  it('renders label, description, and progress for a done achievement', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'ten_sights' });
    await renderWithTheme(<AchievementDetail />);
    expect(screen.getByText('Ten sights')).toBeOnTheScreen();
    expect(screen.getByText('Log 10 finds anywhere in the world.')).toBeOnTheScreen();
    // value=10 (clamped), goal=10 → "10 / 10"
    expect(screen.getByText('10 / 10')).toBeOnTheScreen();
    // Note: label style has textTransform:'uppercase' visually, but getByText matches raw value
    expect(screen.getByText('Unlocked')).toBeOnTheScreen();
  });

  it('renders locked status for a not-done achievement', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'fifty_sights' });
    await renderWithTheme(<AchievementDetail />);
    expect(screen.getByText('Fifty sights')).toBeOnTheScreen();
    expect(screen.getByText('Keep going')).toBeOnTheScreen();
  });

  it('renders fallback for unknown id', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'nonexistent' });
    await renderWithTheme(<AchievementDetail />);
    expect(screen.getByText('Not found')).toBeOnTheScreen();
  });
});

describe('Profile rail', () => {
  it('Achievements row routes to /profile/achievements', async () => {
    (useProfile as jest.Mock).mockReturnValue({ stats: STATS, earnedBadges: [], loading: false });
    await renderWithTheme(<Profile />);
    fireEvent.press(screen.getByTestId('nav-achievements'));
    expect(mockPush).toHaveBeenCalledWith('/profile/achievements');
  });
});
