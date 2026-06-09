jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/badges', () => ({ getUserBadges: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
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
