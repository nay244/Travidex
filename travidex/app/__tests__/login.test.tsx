import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/auth', () => ({ signInWithEmail: jest.fn() }));
import { signInWithEmail } from '../../lib/auth';
import Login from '../(auth)/login';

beforeEach(() => jest.clearAllMocks());

it('calls signInWithEmail with entered credentials', async () => {
  (signInWithEmail as jest.Mock).mockResolvedValue({ session: {} });
  await renderWithTheme(<Login />);
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abcd1234');
  await fireEvent.press(screen.getByText('Log in'));
  await waitFor(() => expect(signInWithEmail).toHaveBeenCalledWith('a@b.com', 'abcd1234'));
});

it('shows an error on failed login', async () => {
  (signInWithEmail as jest.Mock).mockRejectedValue(new Error('Invalid login credentials'));
  await renderWithTheme(<Login />);
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrongpass');
  await fireEvent.press(screen.getByText('Log in'));
  await waitFor(() => expect(screen.getByText('Invalid login credentials')).toBeOnTheScreen());
});
