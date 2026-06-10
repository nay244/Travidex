jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace, push: mockPush }) }));

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { signOut: jest.fn(() => Promise.resolve()) },
    functions: { invoke: jest.fn(() => Promise.resolve({ error: null })) },
  },
}));

const mockRestore = jest.fn();
jest.mock('../../context/EntitlementProvider', () => ({
  useEntitlement: () => ({ restore: mockRestore }),
}));

import { Alert } from 'react-native';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import Settings from '../profile/settings';
import { supabase } from '../../lib/supabase';

beforeEach(() => jest.clearAllMocks());

it('signs out', async () => {
  await renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Sign out'));
  await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalled());
});

it('delete account shows confirmation alert then invokes edge function, signs out, and navigates', async () => {
  const alertSpy = jest.spyOn(Alert, 'alert');
  await renderWithTheme(<Settings />);

  // First tap opens the confirmation dialog — invoke/signOut must NOT be called yet
  fireEvent.press(screen.getByText('Delete account'));
  expect(alertSpy).toHaveBeenCalledWith(
    'Delete account?',
    'This permanently deletes your account, finds, photos, and badges.',
    expect.any(Array),
  );
  expect(supabase.functions.invoke).not.toHaveBeenCalled();

  // Simulate pressing the destructive 'Delete' button from the alert buttons array
  const [, , buttons] = alertSpy.mock.lastCall!;
  const deleteButton = (buttons as any[]).find((b: any) => b.style === 'destructive');
  await deleteButton.onPress();

  await waitFor(() => {
    expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account');
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/welcome');
  });
});

it('shows error alert and does not navigate when delete-account returns an error', async () => {
  (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({ error: new Error('server error') });
  const alertSpy = jest.spyOn(Alert, 'alert');
  await renderWithTheme(<Settings />);

  fireEvent.press(screen.getByText('Delete account'));
  const [, , buttons] = alertSpy.mock.lastCall!;
  const deleteButton = (buttons as any[]).find((b: any) => b.style === 'destructive');
  await deleteButton.onPress();

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Could not delete account', 'Try again later.');
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

it('navigates to Appearance screen', async () => {
  await renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Appearance'));
  expect(mockPush).toHaveBeenCalledWith('/profile/appearance');
});

it('restores purchases', async () => {
  await renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Restore purchases'));
  await waitFor(() => expect(mockRestore).toHaveBeenCalled());
});
