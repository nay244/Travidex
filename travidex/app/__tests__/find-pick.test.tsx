const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
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

it('lists nearby sights and logs the chosen one', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [{ id: 's1', dex_no: 1, name: 'Tower', found: false }], loading: false, reload: jest.fn(),
  });
  (logFind as jest.Mock).mockResolvedValue(undefined);
  await renderWithTheme(<Pick />);
  await act(async () => {
    fireEvent.press(screen.getByText('Tower'));        // select sight
  });
  fireEvent.press(screen.getByText('Log find'));      // confirm in composer
  await waitFor(() => expect(logFind).toHaveBeenCalledWith('u1', 's1', 'Found!'));
  expect(mockPush).toHaveBeenCalledWith('/find/success');
});
