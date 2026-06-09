import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthGate } from '../_layout';

jest.mock('../../context/AuthProvider', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../context/AuthProvider';
const mockUseAuth = useAuth as jest.Mock;

it('shows a loader while loading', async () => {
  mockUseAuth.mockReturnValue({ session: null, loading: true });
  await render(<AuthGate><Text>app</Text></AuthGate>);
  expect(screen.getByTestId('auth-loading')).toBeOnTheScreen();
});

it('renders children when resolved', async () => {
  mockUseAuth.mockReturnValue({ session: null, loading: false });
  await render(<AuthGate><Text>app</Text></AuthGate>);
  expect(screen.getByText('app')).toBeOnTheScreen();
});
