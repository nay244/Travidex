const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));

jest.mock('../../lib/data/friends', () => ({
  getFriendsOverview: jest.fn(),
  searchProfiles: jest.fn(),
  addFriend: jest.fn(),
}));

// relativeTime is deterministic — mock it so tests don't depend on wall-clock
jest.mock('../../lib/relativeTime', () => ({
  relativeTime: (_iso: string) => '2h ago',
}));

const mockUseAuth = jest.fn<{ session: { user: { id: string } } | null }, []>(
  () => ({ session: { user: { id: 'u1' } } })
);
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => mockUseAuth() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFriendsOverview, searchProfiles, addFriend } from '../../lib/data/friends';
import FriendsScreen from '../community/friends';

const FRIENDS = [
  { friend_id: 'f1', username: 'alice', sights_count: 7, last_find: 'Tower', last_find_at: '2024-01-01T10:00:00Z' },
  { friend_id: 'f2', username: 'bob', sights_count: 3, last_find: null, last_find_at: null },
  { friend_id: 'f3', username: 'cara', sights_count: 5, last_find: 'Louvre', last_find_at: null },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ session: { user: { id: 'u1' } } });
  (getFriendsOverview as jest.Mock).mockResolvedValue(FRIENDS);
  (searchProfiles as jest.Mock).mockResolvedValue([]);
  (addFriend as jest.Mock).mockResolvedValue(undefined);
});

it('renders friend rows with username, count, and last find', async () => {
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => expect(screen.getByTestId('friend-f1')).toBeOnTheScreen());
  expect(screen.getByTestId('friend-f2')).toBeOnTheScreen();
  // Usernames
  expect(screen.getAllByText('alice').length).toBeGreaterThan(0);
  expect(screen.getAllByText('bob').length).toBeGreaterThan(0);
  // Sights counts
  expect(screen.getByText('7')).toBeOnTheScreen();
  expect(screen.getByText('3')).toBeOnTheScreen();
  // Last find with relative time (mocked to '2h ago')
  expect(screen.getByText('TOWER · 2h ago')).toBeOnTheScreen();
  expect(screen.getByText('No finds yet')).toBeOnTheScreen();
  // Last find present but no timestamp → bare name, no separator
  expect(screen.getByText('LOUVRE')).toBeOnTheScreen();
});

it('N FRIENDS label shows correct count', async () => {
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => expect(screen.getByTestId('friend-f1')).toBeOnTheScreen());
  expect(screen.getByText('3 FRIENDS')).toBeOnTheScreen();
});

it('main search filters existing friends only — non-friend does not appear', async () => {
  // Even if searchProfiles returns 'charlie', the main search field must NOT surface them
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('friend-f1'));

  // Type in the MAIN search (not the add-panel search)
  fireEvent.changeText(screen.getByPlaceholderText('Search friends'), 'ch');

  // charlie is not a friend — must NOT appear as add-u99 in the main list
  await waitFor(() => expect(screen.queryByTestId('add-u99')).toBeNull());
  // alice + bob don't match 'ch' so filtered list is empty
  await waitFor(() => {
    expect(screen.queryByTestId('friend-f1')).toBeNull();
    expect(screen.queryByTestId('friend-f2')).toBeNull();
  });
});

it('add-friend-row toggles the add panel', async () => {
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('add-friend-row'));

  // Panel not visible yet
  expect(screen.queryByTestId('add-search-input')).toBeNull();

  // Toggle open
  fireEvent.press(screen.getByTestId('add-friend-row'));
  await waitFor(() => expect(screen.getByTestId('add-search-input')).toBeOnTheScreen());

  // Toggle closed
  fireEvent.press(screen.getByTestId('add-friend-row'));
  await waitFor(() => expect(screen.queryByTestId('add-search-input')).toBeNull());
});

it('add panel search returns profiles and Add buttons', async () => {
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('add-friend-row'));

  // Open panel
  fireEvent.press(screen.getByTestId('add-friend-row'));
  await waitFor(() => screen.getByTestId('add-search-input'));
  fireEvent.changeText(screen.getByTestId('add-search-input'), 'ch');

  await waitFor(() => expect(screen.getByTestId('add-u99')).toBeOnTheScreen());
  expect(screen.getByText('charlie')).toBeOnTheScreen();
});

it('pressing Add in panel calls addFriend and closes panel', async () => {
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('add-friend-row'));

  fireEvent.press(screen.getByTestId('add-friend-row'));
  await waitFor(() => screen.getByTestId('add-search-input'));
  fireEvent.changeText(screen.getByTestId('add-search-input'), 'ch');
  await waitFor(() => screen.getByTestId('add-u99'));

  fireEvent.press(screen.getByTestId('add-u99'));
  await waitFor(() => expect(addFriend).toHaveBeenCalledWith('u1', 'u99'));
  // Panel collapses after successful add
  await waitFor(() => expect(screen.queryByTestId('add-search-input')).toBeNull());
});

it('shows updated empty copy when no friends', async () => {
  (getFriendsOverview as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() =>
    expect(screen.getByText('No friends yet — add one to compare dexes.')).toBeOnTheScreen()
  );
});

it('back-btn calls router.back()', async () => {
  (getFriendsOverview as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => expect(screen.getByTestId('back-btn')).toBeOnTheScreen());
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('already-friend users do not appear in add panel results', async () => {
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'f1', username: 'alice' },
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('friend-f1'));

  fireEvent.press(screen.getByTestId('add-friend-row'));
  await waitFor(() => screen.getByTestId('add-search-input'));
  fireEvent.changeText(screen.getByTestId('add-search-input'), 'al');

  await waitFor(() => screen.getByTestId('add-u99'));

  // alice is already a friend — must NOT appear as an add row
  expect(screen.queryByTestId('add-f1')).toBeNull();
  expect(screen.getByTestId('add-u99')).toBeOnTheScreen();
});
