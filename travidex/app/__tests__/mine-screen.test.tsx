jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/community', () => ({ getMySubmissions: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getMySubmissions } from '../../lib/data/community';
import Mine from '../community/mine';

beforeEach(() => jest.clearAllMocks());

it('lists submissions with their status', async () => {
  (getMySubmissions as jest.Mock).mockResolvedValue([
    { id: 's1', name: 'Hidden Cafe', status: 'pending', reject_reason: null },
  ]);
  renderWithTheme(<Mine />);
  await waitFor(() => expect(screen.getByText('Hidden Cafe')).toBeOnTheScreen());
  expect(screen.getByText('pending')).toBeOnTheScreen();
});

it('shows an empty state when there are no submissions', async () => {
  (getMySubmissions as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Mine />);
  await waitFor(() => expect(screen.getByText('No submissions yet')).toBeOnTheScreen());
});
