jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { supabase } from '../../lib/supabase';
import { AuthProvider, useAuth } from '../AuthProvider';

const mockAuth = supabase.auth as {
  getSession: jest.Mock;
  onAuthStateChange: jest.Mock;
};

function Probe() {
  const { session, loading } = useAuth();
  return <Text>{loading ? 'loading' : session ? 'in' : 'out'}</Text>;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
});

it('resolves to signed-out when no session', async () => {
  mockAuth.getSession.mockResolvedValue({ data: { session: null } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('out')).toBeOnTheScreen());
});

it('resolves to signed-in when a session exists', async () => {
  mockAuth.getSession.mockResolvedValue({ data: { session: { user: { id: '1' } } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('in')).toBeOnTheScreen());
});
