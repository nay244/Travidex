jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/badges', () => ({ getUserBadges: jest.fn() }));
const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getUserBadges } from '../../lib/data/badges';
import Badges from '../profile/badges';

beforeEach(() => jest.clearAllMocks());

it('marks earned vs locked from the catalog', async () => {
  (getUserBadges as jest.Mock).mockResolvedValue(['first_find']);
  await renderWithTheme(<Badges />);
  await waitFor(() => expect(screen.getByText('First Find')).toBeOnTheScreen());
  expect(screen.getByTestId('badge-first_find-earned')).toBeOnTheScreen();
  expect(screen.getByTestId('badge-finds_50-locked')).toBeOnTheScreen();
});

it('back-btn calls router.back()', async () => {
  (getUserBadges as jest.Mock).mockResolvedValue([]);
  await renderWithTheme(<Badges />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});
