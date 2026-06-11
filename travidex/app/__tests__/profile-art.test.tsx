// Mocks must be declared before imports
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/profile', () => ({
  getArtId: jest.fn(),
  setArtId: jest.fn(),
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import { getArtId, setArtId } from '../../lib/data/profile';
import ArtPicker from '../profile/art';
import Profile from '../(tabs)/profile';

// Stats: totalFinds=30, citiesClaimed=1, countriesExplored=1, worldFound=30, worldTotal=100
// trailhead   → always unlocked
// tileman     → unlocked (citiesClaimed=1 >= 1)
// aurora      → LOCKED  (citiesClaimed=1 < 2)
// passport    → LOCKED  (countriesExplored=1 < 3)
// topographic → LOCKED  (citiesClaimed=1 < 3)
// summit      → LOCKED  (totalFinds=30 < 100)
const STATS = { totalFinds: 30, citiesClaimed: 1, countriesExplored: 1, worldFound: 30, worldTotal: 100 };

beforeEach(() => {
  jest.clearAllMocks();
  (useProfile as jest.Mock).mockReturnValue({ stats: STATS, earnedBadges: [], loading: false });
  (getArtId as jest.Mock).mockResolvedValue('trailhead');
  (setArtId as jest.Mock).mockResolvedValue(undefined);
});

describe('ArtPicker testIDs', () => {
  it('unlocked/locked testIDs match stats', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-trailhead-unlocked')).toBeOnTheScreen());
    expect(screen.getByTestId('art-tileman-unlocked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-aurora-locked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-passport-locked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-topographic-locked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-summit-locked')).toBeOnTheScreen();
  });

  it('selected art (trailhead default) shows check disc', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-selected-trailhead')).toBeOnTheScreen());
  });

  it('locked tile shows progress fraction text', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-summit-locked')).toBeOnTheScreen());
    // summit progress: 30/100
    expect(screen.getByText(/30\/100/)).toBeOnTheScreen();
  });
});

describe('ArtPicker interaction', () => {
  it('pressing unlocked card calls setArtId', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-tileman-unlocked')).toBeOnTheScreen());
    fireEvent.press(screen.getByTestId('art-tileman-unlocked'));
    expect(setArtId).toHaveBeenCalledWith('u1', 'tileman');
  });

  it('pressing locked card does NOT call setArtId', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-aurora-locked')).toBeOnTheScreen());
    fireEvent.press(screen.getByTestId('art-aurora-locked'));
    expect(setArtId).not.toHaveBeenCalled();
  });
});

describe('Profile rail', () => {
  it('Profile art row routes to /profile/art', async () => {
    await renderWithTheme(<Profile />);
    fireEvent.press(screen.getByTestId('nav-profile-art'));
    expect(mockPush).toHaveBeenCalledWith('/profile/art');
  });
});
