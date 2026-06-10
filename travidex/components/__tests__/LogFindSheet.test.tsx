jest.mock('../../lib/data/finds', () => ({ logFind: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { logFind } from '../../lib/data/finds';
import { LogFindSheet } from '../LogFindSheet';

beforeEach(() => jest.clearAllMocks());

it('logs with default "Found!" when comment empty', async () => {
  (logFind as jest.Mock).mockResolvedValue(undefined);
  const onLogged = jest.fn();
  await renderWithTheme(<LogFindSheet sightId="s1" onLogged={onLogged} />);
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Found!'));
  expect(onLogged).toHaveBeenCalled();
});

it('logs with the typed comment', async () => {
  (logFind as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<LogFindSheet sightId="s1" onLogged={jest.fn()} />);
  await act(async () => {
    fireEvent.changeText(screen.getByPlaceholderText('Add a note (optional)'), 'Amazing at sunset');
  });
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Amazing at sunset'));
});

it('shows friendly message on duplicate-key error and hides raw message', async () => {
  (logFind as jest.Mock).mockRejectedValue(
    new Error('duplicate key value violates unique constraint "finds_user_id_sight_id_key"'),
  );
  await renderWithTheme(<LogFindSheet sightId="s1" onLogged={jest.fn()} />);
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(screen.getByText('Already in your dex.')).toBeTruthy());
  expect(screen.queryByText(/duplicate key/)).toBeNull();
  expect(screen.queryByText(/finds_user_id_sight_id_key/)).toBeNull();
});

it('shows generic message on non-duplicate error', async () => {
  (logFind as jest.Mock).mockRejectedValue(new Error('Network request failed'));
  await renderWithTheme(<LogFindSheet sightId="s1" onLogged={jest.fn()} />);
  fireEvent.press(screen.getByText('Log find'));
  await waitFor(() => expect(screen.getByText('Could not log this find. Try again.')).toBeTruthy());
  expect(screen.queryByText('Network request failed')).toBeNull();
});
