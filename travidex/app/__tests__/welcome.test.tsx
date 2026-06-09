import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../lib/auth', () => ({ signInWithApple: jest.fn() }));

import Welcome from '../(auth)/welcome';

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
