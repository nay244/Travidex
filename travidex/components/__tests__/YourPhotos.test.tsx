jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn(), uploadUserPhoto: jest.fn() }));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import * as Picker from 'expo-image-picker';
import { uploadUserPhoto, getUserPhotos } from '../../lib/data/photos';
import { YourPhotos } from '../YourPhotos';

beforeEach(() => jest.clearAllMocks());

it('picks an image and uploads it for the sight', async () => {
  (getUserPhotos as jest.Mock).mockResolvedValue([]);
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false, assets: [{ uri: 'file://photo.jpg', fileName: 'photo.jpg' }],
  });
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve({} as Blob) });
  (uploadUserPhoto as jest.Mock).mockResolvedValue(undefined);

  await renderWithTheme(<YourPhotos sightId="s1" />);
  fireEvent.press(screen.getByText('+ Add photo'));
  await waitFor(() => expect(uploadUserPhoto).toHaveBeenCalledWith('u1', 's1', expect.anything(), 'photo.jpg'));
});
