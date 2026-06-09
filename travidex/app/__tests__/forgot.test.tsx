import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../lib/auth', () => ({ sendPasswordReset: jest.fn() }));
import { sendPasswordReset } from '../../lib/auth';
import Forgot from '../(auth)/forgot';

beforeEach(() => jest.clearAllMocks());

it('sends a reset link and confirms', async () => {
  (sendPasswordReset as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Forgot />);
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
  await fireEvent.press(screen.getByText('Send reset link'));
  await waitFor(() => expect(sendPasswordReset).toHaveBeenCalledWith('a@b.com'));
  expect(screen.getByText('Check your inbox for a reset link.')).toBeOnTheScreen();
});
