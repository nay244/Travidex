const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack, push: mockPush }) }));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ logFind: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { logFind } from '../../lib/data/finds';
import Pick from '../find/pick';

beforeEach(() => jest.clearAllMocks());

it('lists nearby sights and logs the chosen unfound one', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [{ id: 's1', dex_no: 1, name: 'Tower', found: false }], loading: false, reload: jest.fn(),
    completion: { found: 0, total: 1 },
  });
  (logFind as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Pick />);
  await act(async () => {
    fireEvent.press(screen.getByText('Tower'));        // select sight
  });
  fireEvent.press(screen.getByText('Log find'));      // confirm in composer
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Found!'));
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/find/success', params: { sightId: 's1' } });
});

it('routes to success with already:1 when pressing a found sight', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [{ id: 's2', dex_no: 2, name: 'Louvre', found: true }], loading: false, reload: jest.fn(),
    completion: { found: 1, total: 8 },
  });
  await renderWithTheme(<Pick />);
  await act(async () => {
    fireEvent.press(screen.getByText('Louvre'));
  });
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/find/success',
    params: { sightId: 's2', already: '1' },
  });
  expect(screen.queryByText('Log find')).toBeNull();
});

it('shows the log sheet for unfound sight (does not immediately navigate)', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [{ id: 's3', dex_no: 3, name: 'Notre Dame', found: false }], loading: false, reload: jest.fn(),
    completion: { found: 0, total: 8 },
  });
  await renderWithTheme(<Pick />);
  await act(async () => {
    fireEvent.press(screen.getByText('Notre Dame'));
  });
  expect(screen.getByText('Log find')).toBeTruthy();
  expect(mockPush).not.toHaveBeenCalled();
});

it('back-btn calls router.back()', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [], loading: false, reload: jest.fn(),
    completion: { found: 0, total: 0 },
  });
  await renderWithTheme(<Pick />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});
