jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn() }));
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getUserPhotos } from '../../lib/data/photos';
import Journal from '../profile/journal';

beforeEach(() => jest.clearAllMocks());

it('shows a photo count', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([{ id: 'p1', photo_url: 'u', sight_id: 's1' }]);
  await renderWithTheme(<Journal />);
  await waitFor(() => expect(screen.getByText('1 photo')).toBeOnTheScreen());
});
