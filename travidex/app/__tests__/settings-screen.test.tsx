jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { signOut: jest.fn(() => Promise.resolve()) },
    functions: { invoke: jest.fn(() => Promise.resolve({ error: null })) },
  },
}));

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

it('deletes the account via the edge function', async () => {
  await renderWithTheme(<Settings />);
  fireEvent.press(screen.getByText('Delete account'));
  await waitFor(() => expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account'));
});
