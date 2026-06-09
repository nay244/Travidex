const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../hooks/useProfile', () => ({ useProfile: jest.fn() }));
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useProfile } from '../../hooks/useProfile';
import Profile from '../(tabs)/profile';

beforeEach(() => jest.clearAllMocks());

it('shows stats and links to settings', async () => {
  (useProfile as jest.Mock).mockReturnValue({ stats: { totalFinds: 12, citiesClaimed: 2, countriesExplored: 1 }, earnedBadges: ['first_find'], loading: false });
  await renderWithTheme(<Profile />);
  expect(screen.getByText('12')).toBeOnTheScreen();   // finds
  expect(screen.getByText('Sights found')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Settings'));
  expect(mockPush).toHaveBeenCalledWith('/profile/settings');
});
