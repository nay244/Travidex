const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/data/feed', () => ({ getFeed: jest.fn() }));
jest.mock('../../lib/data/friends', () => ({ getFriendsOverview: jest.fn() }));
jest.mock('../../lib/relativeTime', () => ({ relativeTime: (_iso: string) => '5m ago' }));
// Stub GemsTab so community-tab tests remain focused on the Friends tab and tab switching
jest.mock('../../components/GemsTab', () => ({
  GemsTab: () => null,
}));

const mockUseAuth = jest.fn<{ session: { user: { id: string } } | null }, []>(() => ({ session: { user: { id: 'u1' } } }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => mockUseAuth() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFeed } from '../../lib/data/feed';
import { getFriendsOverview } from '../../lib/data/friends';
import Community from '../(tabs)/community';

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ session: { user: { id: 'u1' } } });
  (getFriendsOverview as jest.Mock).mockResolvedValue([
    { friend_id: 'f1', username: 'alice', sights_count: 5, last_find: null },
    { friend_id: 'f2', username: 'bob', sights_count: 3, last_find: null },
  ]);
});

it('renders both tabs', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByTestId('tab-friends')).toBeOnTheScreen());
  expect(screen.getByTestId('tab-gems')).toBeOnTheScreen();
});

it('default Friends tab shows feed and your-friends row with count', async () => {
  (getFeed as jest.Mock).mockResolvedValue([
    { id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay', found_at: '2026-06-09T11:55:00Z', city_name: 'Paris' },
  ]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('nay found Tower in Paris')).toBeOnTheScreen());
  expect(screen.getByTestId('your-friends-row')).toBeOnTheScreen();
  // Count rendered as mono text
  expect(screen.getByText('2')).toBeOnTheScreen();
});

it('pressing tab-gems shows gems-tab placeholder and hides the feed', async () => {
  (getFeed as jest.Mock).mockResolvedValue([
    { id: 'f1', comment: null, sight_name: 'Tower', username: 'nay', found_at: '2026-06-09T11:55:00Z', city_name: 'Paris' },
  ]);
  renderWithTheme(<Community />);
  await waitFor(() => screen.getByTestId('your-friends-row'));

  fireEvent.press(screen.getByTestId('tab-gems'));

  await waitFor(() => expect(screen.getByTestId('gems-tab')).toBeOnTheScreen());
  expect(screen.queryByText('nay found Tower in Paris')).toBeNull();
});

it('pressing your-friends-row pushes /community/friends', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => screen.getByTestId('your-friends-row'));
  fireEvent.press(screen.getByTestId('your-friends-row'));
  expect(mockPush).toHaveBeenCalledWith('/community/friends');
});

it('Submit-a-sight button is gone', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => screen.getByTestId('your-friends-row'));
  expect(screen.queryByText('Submit a sight')).toBeNull();
});

it('renders the feed with city and relative time', async () => {
  (getFeed as jest.Mock).mockResolvedValue([
    { id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay', found_at: '2026-06-09T11:55:00Z', city_name: 'Paris' },
  ]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('nay found Tower in Paris')).toBeOnTheScreen());
  expect(screen.getByText('5m ago')).toBeOnTheScreen();
});

it('shows an empty state when the feed is empty', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('No finds yet')).toBeOnTheScreen());
});

it('renders without city_name gracefully', async () => {
  (getFeed as jest.Mock).mockResolvedValue([
    { id: 'f2', comment: null, sight_name: 'Museum', username: 'bob', found_at: '2026-06-09T11:00:00Z', city_name: null },
  ]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('bob found Museum')).toBeOnTheScreen());
});

it('calls getFeed with the session user id', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(getFeed).toHaveBeenCalledWith('u1'));
});

it('shows empty state and does not call getFeed when no session', async () => {
  mockUseAuth.mockReturnValue({ session: null });
  (getFeed as jest.Mock).mockResolvedValue([]);
  (getFriendsOverview as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('No finds yet')).toBeOnTheScreen());
  expect(getFeed).not.toHaveBeenCalled();
});
