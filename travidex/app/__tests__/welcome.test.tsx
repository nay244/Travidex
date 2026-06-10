import { Alert } from 'react-native';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/auth', () => ({ signInWithApple: jest.fn() }));

import Welcome from '../(auth)/welcome';
import { signInWithApple } from '../../lib/auth';

beforeEach(() => jest.clearAllMocks());

it('shows the three entry actions', async () => {
  await renderWithTheme(<Welcome />);
  expect(screen.getByText('Sign in with Apple')).toBeOnTheScreen();
  expect(screen.getByText('Continue with Email')).toBeOnTheScreen();
  expect(screen.getByText('Log in')).toBeOnTheScreen();
});

it('navigates to sign-up on Continue with Email', async () => {
  await renderWithTheme(<Welcome />);
  fireEvent.press(screen.getByText('Continue with Email'));
  expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-up');
});

it('shows an alert when Apple sign-in fails with a non-cancel error', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert');
  (signInWithApple as jest.Mock).mockRejectedValueOnce(new Error('network error'));
  await renderWithTheme(<Welcome />);
  fireEvent.press(screen.getByText('Sign in with Apple'));
  await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Sign in failed', 'Please try again.'));
});

it('does not show an alert when the user cancels Apple sign-in', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert');
  const cancelError = Object.assign(new Error('canceled'), { code: 'ERR_REQUEST_CANCELED' });
  (signInWithApple as jest.Mock).mockRejectedValueOnce(cancelError);
  await renderWithTheme(<Welcome />);
  fireEvent.press(screen.getByText('Sign in with Apple'));
  await waitFor(() => expect(signInWithApple).toHaveBeenCalled());
  expect(alertSpy).not.toHaveBeenCalled();
});
