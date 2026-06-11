// Mocks must be declared before imports
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: jest.fn(),
}));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../context/EntitlementProvider', () => ({
  useEntitlement: () => ({ isPremium: false }),
}));
jest.mock('../../lib/data/profile', () => ({
  getArtId: jest.fn(() => Promise.resolve('trailhead')),
}));

import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import { useLocalSearchParams } from 'expo-router';
import AchievementsGrid from '../profile/achievements/index';
import AchievementDetail from '../profile/achievements/[id]';
import Profile from '../(tabs)/profile';

// Stats: totalFinds=12, citiesClaimed=1, countriesExplored=1
// first_steps  (goal=1,  value=min(12,1)=1)  → done
// ten_sights   (goal=10, value=min(12,10)=10) → done
// fifty_sights (goal=50, value=min(12,50)=12) → in-progress (not done)
// city_claimer (goal=1,  value=1)             → done
// globetrotter (goal=5,  value=1)             → in-progress (not done)
// done count = 3, total = 5 → "3/5 unlocked"
const STATS = { totalFinds: 12, citiesClaimed: 1, countriesExplored: 1, worldFound: 62, worldTotal: 400 };

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

  it('renders Awards header and unlocked count', async () => {
    await renderWithTheme(<AchievementsGrid />);
    expect(screen.getByText('Awards')).toBeOnTheScreen();
    expect(screen.getByText('3/5 unlocked')).toBeOnTheScreen();
  });

  it('renders caption for in-progress achievement', async () => {
    await renderWithTheme(<AchievementsGrid />);
    // fifty_sights: value=12, goal=50, level=1 → "LVL 1 · 12/50"
    expect(screen.getByText('LVL 1 · 12/50')).toBeOnTheScreen();
  });

  it('renders LOCKED caption for zero-progress achievement', async () => {
    // With globetrotter value=1 (countriesExplored=1 > 0), all achievements have value>0
    // Override stats to get a true zero-progress entry
    (useProfile as jest.Mock).mockReturnValue({
      stats: { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0, worldFound: 0, worldTotal: 400 },
      earnedBadges: [],
      loading: false,
    });
    await renderWithTheme(<AchievementsGrid />);
    // first_steps value=0 → LOCKED caption
    expect(screen.getAllByText('LOCKED').length).toBeGreaterThan(0);
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
    fireEvent.press(screen.getByTestId('achievements-page-btn'));
    expect(mockPush).toHaveBeenCalledWith('/profile/achievements');
  });
});
