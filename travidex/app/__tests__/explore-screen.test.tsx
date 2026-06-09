const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/countries', () => ({ getCountries: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCountryProgress: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCountries } from '../../lib/data/countries';
import { getCountryProgress } from '../../lib/data/progress';
import Explore from '../(tabs)/explore';

beforeEach(() => jest.clearAllMocks());

it('lists countries with progress and opens one', async () => {
  (getCountries as jest.Mock).mockResolvedValue([{ id: 'k1', name: 'France', code: 'FR', created_at: '' }]);
  (getCountryProgress as jest.Mock).mockResolvedValue(new Map([['k1', { found: 1, total: 3 }]]));
  renderWithTheme(<Explore />);
  await waitFor(() => expect(screen.getByText('France')).toBeOnTheScreen());
  expect(screen.getByText('1 / 3 sights')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('France'));
  expect(mockPush).toHaveBeenCalledWith('/country/k1');
});
