const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'c1' }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/community', () => ({ submitSight: jest.fn() }));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { submitSight } from '../../lib/data/community';
import Submit from '../community/submit';

beforeEach(() => jest.clearAllMocks());

it('requires a name', async () => {
  await renderWithTheme(<Submit />);
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(screen.getByText('Name is required')).toBeOnTheScreen());
  expect(submitSight).not.toHaveBeenCalled();
});

it('submits with the active city and default center coords', async () => {
  (submitSight as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Submit />);
  await act(async () => {
    fireEvent.changeText(screen.getByPlaceholderText('Sight name'), 'Hidden Cafe');
  });
  fireEvent.press(screen.getByText('Submit for review'));
  await waitFor(() => expect(submitSight).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'Hidden Cafe', cityId: 'c1' })));
});
