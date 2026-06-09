import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/auth', () => ({ signUpWithEmail: jest.fn() }));
import { signUpWithEmail } from '../../lib/auth';
import SignUp from '../(auth)/sign-up';

beforeEach(() => jest.clearAllMocks());

it('shows a validation error for a short password', async () => {
  await renderWithTheme(<SignUp />);
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abc');
  await fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), 'abc');
  await fireEvent.press(screen.getByText('Create account'));
  await waitFor(() => expect(screen.getByText('Password must be at least 8 characters')).toBeOnTheScreen());
  expect(signUpWithEmail).not.toHaveBeenCalled();
});

it('calls signUpWithEmail and routes to verify on valid input', async () => {
  (signUpWithEmail as jest.Mock).mockResolvedValue({ user: { id: '1' } });
  await renderWithTheme(<SignUp />);
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'abcd1234');
  await fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), 'abcd1234');
  await fireEvent.press(screen.getByText('Create account'));
  await waitFor(() => expect(signUpWithEmail).toHaveBeenCalledWith('a@b.com', 'abcd1234'));
  expect(mockPush).toHaveBeenCalledWith('/(auth)/verify');
});
