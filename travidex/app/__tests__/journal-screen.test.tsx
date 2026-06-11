jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn() }));
const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getUserPhotos } from '../../lib/data/photos';
import Journal from '../profile/journal';

beforeEach(() => jest.clearAllMocks());

it('shows a photo count', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([{ id: 'p1', photo_url: 'u', sight_id: 's1' }]);
  await renderWithTheme(<Journal />);
  await waitFor(() => expect(screen.getByText('1 photo')).toBeOnTheScreen());
});

it('back-btn calls router.back()', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([]);
  await renderWithTheme(<Journal />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});
