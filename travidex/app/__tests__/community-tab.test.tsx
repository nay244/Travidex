const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/data/feed', () => ({ getFeed: jest.fn() }));
jest.mock('../../lib/relativeTime', () => ({ relativeTime: (_iso: string) => '5m ago' }));

const mockUseAuth = jest.fn<{ session: { user: { id: string } } | null }, []>(() => ({ session: { user: { id: 'u1' } } }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => mockUseAuth() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFeed } from '../../lib/data/feed';
import Community from '../(tabs)/community';

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ session: { user: { id: 'u1' } } });
});

it('renders the feed with city and relative time', async () => {
  (getFeed as jest.Mock).mockResolvedValue([
    { id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay', found_at: '2026-06-09T11:55:00Z', city_name: 'Paris' },
  ]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('nay found Tower in Paris')).toBeOnTheScreen());
  expect(screen.getByText('5m ago')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Submit a sight'));
  expect(mockPush).toHaveBeenCalledWith('/community/submit');
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
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('No finds yet')).toBeOnTheScreen());
  expect(getFeed).not.toHaveBeenCalled();
});
