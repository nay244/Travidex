const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }), useLocalSearchParams: () => ({ id: 'country-1' }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/citiesByCountry', () => ({ getCitiesForCountry: jest.fn() }));
jest.mock('../../lib/data/progress', () => ({ getCityProgress: jest.fn() }));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress } from '../../lib/data/progress';
import Country from '../country/[id]';

beforeEach(() => jest.clearAllMocks());

it('renders a chunk per city with its progress and opens a city', async () => {
  (getCitiesForCountry as jest.Mock).mockResolvedValue([{ id: 'c1', name: 'Tokyo' }, { id: 'c2', name: 'Osaka' }]);
  (getCityProgress as jest.Mock).mockResolvedValue(new Map([['c1', { found: 20, total: 20 }], ['c2', { found: 5, total: 22 }]]));
  renderWithTheme(<Country />);
  await waitFor(() => expect(screen.getByText('Tokyo')).toBeOnTheScreen());
  expect(screen.getByText('20/20')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Osaka'));
  expect(mockPush).toHaveBeenCalledWith('/city/c2');
});
