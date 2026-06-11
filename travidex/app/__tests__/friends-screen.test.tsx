const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));

jest.mock('../../lib/data/friends', () => ({
  getFriendsOverview: jest.fn(),
  searchProfiles: jest.fn(),
  addFriend: jest.fn(),
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
  { friend_id: 'f1', username: 'alice', sights_count: 7, last_find: 'Tower' },
  { friend_id: 'f2', username: 'bob', sights_count: 3, last_find: null },
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
  expect(screen.getByText('alice')).toBeOnTheScreen();
  expect(screen.getByText('bob')).toBeOnTheScreen();
  // Sights counts
  expect(screen.getByText('7')).toBeOnTheScreen();
  expect(screen.getByText('3')).toBeOnTheScreen();
  // Last find
  expect(screen.getByText('Tower')).toBeOnTheScreen();
  expect(screen.getByText('No finds yet')).toBeOnTheScreen();
});

it('search >= 2 chars surfaces a non-friend profile with Add button', async () => {
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('friend-f1'));

  fireEvent.changeText(screen.getByPlaceholderText('Search friends'), 'ch');

  await waitFor(() => expect(screen.getByTestId('add-u99')).toBeOnTheScreen());
  expect(screen.getByText('charlie')).toBeOnTheScreen();
  expect(screen.getByText('Add a friend')).toBeOnTheScreen();
});

it('pressing Add calls addFriend with uid and friend id', async () => {
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('friend-f1'));

  fireEvent.changeText(screen.getByPlaceholderText('Search friends'), 'ch');
  await waitFor(() => screen.getByTestId('add-u99'));

  fireEvent.press(screen.getByTestId('add-u99'));
  await waitFor(() => expect(addFriend).toHaveBeenCalledWith('u1', 'u99'));
});

it('shows empty state when no friends', async () => {
  (getFriendsOverview as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() =>
    expect(screen.getByText('No friends yet — search to add one.')).toBeOnTheScreen()
  );
});

it('already-friend users do not appear in add results', async () => {
  // alice is already a friend; search returns alice + charlie
  (searchProfiles as jest.Mock).mockResolvedValue([
    { user_id: 'f1', username: 'alice' },
    { user_id: 'u99', username: 'charlie' },
  ]);
  renderWithTheme(<FriendsScreen />);
  await waitFor(() => screen.getByTestId('friend-f1'));

  fireEvent.changeText(screen.getByPlaceholderText('Search friends'), 'al');
  await waitFor(() => screen.getByTestId('add-u99'));

  // alice should NOT appear as an add row (she's already a friend by user_id 'f1')
  // but charlie should
  expect(screen.queryByTestId('add-f1')).toBeNull();
  expect(screen.getByTestId('add-u99')).toBeOnTheScreen();
});
