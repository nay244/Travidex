import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../../lib/profiles', () => ({ isUsernameAvailable: jest.fn(), createProfile: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
import { isUsernameAvailable, createProfile } from '../../lib/profiles';
import ProfileSetup from '../(auth)/profile-setup';

beforeEach(() => jest.clearAllMocks());

it('blocks a taken username', async () => {
  (isUsernameAvailable as jest.Mock).mockResolvedValue(false);
  await renderWithTheme(<ProfileSetup />);
  await fireEvent.changeText(screen.getByPlaceholderText('Username'), 'taken');
  await fireEvent.press(screen.getByText('Continue'));
  await waitFor(() => expect(screen.getByText('That username is taken')).toBeOnTheScreen());
  expect(createProfile).not.toHaveBeenCalled();
});

it('creates the profile when username is free', async () => {
  (isUsernameAvailable as jest.Mock).mockResolvedValue(true);
  (createProfile as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<ProfileSetup />);
  await fireEvent.changeText(screen.getByPlaceholderText('Username'), 'nay');
  await fireEvent.press(screen.getByText('Continue'));
  await waitFor(() => expect(createProfile).toHaveBeenCalledWith('u1', 'nay', null));
});
