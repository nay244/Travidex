const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/data/feed', () => ({ getFeed: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFeed } from '../../lib/data/feed';
import Community from '../(tabs)/community';

beforeEach(() => jest.clearAllMocks());

it('renders the feed and links to submit', async () => {
  (getFeed as jest.Mock).mockResolvedValue([{ id: 'f1', comment: 'Found!', sight_name: 'Tower', username: 'nay', found_at: 'now' }]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('nay found Tower')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('Submit a sight'));
  expect(mockPush).toHaveBeenCalledWith('/community/submit');
});

it('shows an empty state when the feed is empty', async () => {
  (getFeed as jest.Mock).mockResolvedValue([]);
  renderWithTheme(<Community />);
  await waitFor(() => expect(screen.getByText('No finds yet')).toBeOnTheScreen());
});
