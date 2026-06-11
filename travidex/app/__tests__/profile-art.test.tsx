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

// Stats: totalFinds=30, citiesClaimed=1, countriesExplored=1
// trailhead  → always unlocked
// city-amber → unlocked (citiesClaimed=1 >= 1)
// wayfarer   → LOCKED  (countriesExplored=1 < 3)
// collector  → unlocked (totalFinds=30 >= 25)
const STATS = { totalFinds: 30, citiesClaimed: 1, countriesExplored: 1 };

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
    expect(screen.getByTestId('art-city-amber-unlocked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-wayfarer-locked')).toBeOnTheScreen();
    expect(screen.getByTestId('art-collector-unlocked')).toBeOnTheScreen();
  });

  it('selected art shows check disc', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-selected-trailhead')).toBeOnTheScreen());
  });
});

describe('ArtPicker interaction', () => {
  it('pressing unlocked card calls setArtId', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-city-amber-unlocked')).toBeOnTheScreen());
    fireEvent.press(screen.getByTestId('art-city-amber-unlocked'));
    expect(setArtId).toHaveBeenCalledWith('u1', 'city-amber');
  });

  it('pressing locked card does NOT call setArtId', async () => {
    await renderWithTheme(<ArtPicker />);
    await waitFor(() => expect(screen.getByTestId('art-wayfarer-locked')).toBeOnTheScreen());
    fireEvent.press(screen.getByTestId('art-wayfarer-locked'));
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
