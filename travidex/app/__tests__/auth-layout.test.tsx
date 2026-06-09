import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text>{`redirect:${href}`}</Text>,
    Stack: () => <Text>auth-stack</Text>,
  };
});
jest.mock('../../context/AuthProvider', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../../context/AuthProvider';
import AuthLayout from '../(auth)/_layout';
const mockUseAuth = useAuth as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('renders the auth stack when signed out', async () => {
  mockUseAuth.mockReturnValue({ session: null, loading: false });
  await renderWithTheme(<AuthLayout />);
  expect(screen.getByText('auth-stack')).toBeOnTheScreen();
});

it('redirects to the tabs when a session exists', async () => {
  mockUseAuth.mockReturnValue({ session: { user: { id: 'u1' } }, loading: false });
  await renderWithTheme(<AuthLayout />);
  expect(screen.getByText('redirect:/(tabs)/map')).toBeOnTheScreen();
});
