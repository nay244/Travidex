// Mocks before imports
const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));

jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city1', setCityId: jest.fn() }) }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({
    city: { id: 'city1', name: 'Paris', country_code: 'FR', lat: 48.8566, lng: 2.3522, country_name: 'France' },
  }),
}));
jest.mock('../../lib/data/gems', () => ({ submitGem: jest.fn() }));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock('../../components/Flag', () => ({
  Flag: () => null,
}));
jest.mock('../../components/Medallion', () => ({
  Medallion: () => null,
}));

import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import * as Picker from 'expo-image-picker';
import { submitGem } from '../../lib/data/gems';
import ShareGem from '../community/share-gem';

const MOCK_BLOB = {} as Blob;

beforeEach(() => {
  jest.clearAllMocks();
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve(MOCK_BLOB) });
});

it('back-btn calls router.back()', async () => {
  const { getByTestId } = await renderWithTheme(<ShareGem />);
  fireEvent.press(getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('submit button is disabled when no photo and no name', async () => {
  const { findByTestId } = await renderWithTheme(<ShareGem />);
  const btn = await findByTestId('submit-gem');
  const isDisabled = btn.props.accessibilityState?.disabled ?? btn.props.disabled ?? false;
  expect(isDisabled).toBe(true);
});

it('submit button is disabled when photo selected but name < 3 chars', async () => {
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://photo.jpg' }],
  });
  const { findByTestId, getByPlaceholderText } = await renderWithTheme(<ShareGem />);
  const photoBox = await findByTestId('photo-box');
  fireEvent.press(photoBox);
  await waitFor(() => expect(Picker.launchImageLibraryAsync).toHaveBeenCalled());
  fireEvent.changeText(getByPlaceholderText('Name the spot'), 'ab');
  const btn = await findByTestId('submit-gem');
  const isDisabled = btn.props.accessibilityState?.disabled ?? btn.props.disabled ?? false;
  expect(isDisabled).toBe(true);
});

it('submit button is enabled when photo selected and name >= 3 chars', async () => {
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://photo.jpg' }],
  });
  const { findByTestId, getByPlaceholderText } = await renderWithTheme(<ShareGem />);
  const photoBox = await findByTestId('photo-box');
  fireEvent.press(photoBox);
  await waitFor(() => expect(Picker.launchImageLibraryAsync).toHaveBeenCalled());
  fireEvent.changeText(getByPlaceholderText('Name the spot'), 'Cool Spot');
  const btn = await findByTestId('submit-gem');
  const isDisabled = btn.props.accessibilityState?.disabled ?? btn.props.disabled ?? false;
  expect(isDisabled).toBe(false);
});

it('canceled picker keeps photo box empty (no photo preview)', async () => {
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });
  const { findByTestId, getByText } = await renderWithTheme(<ShareGem />);
  const photoBox = await findByTestId('photo-box');
  fireEvent.press(photoBox);
  await waitFor(() => expect(Picker.launchImageLibraryAsync).toHaveBeenCalled());
  expect(getByText('Add a photo of the spot')).toBeTruthy();
});

// Full submit + success state in one test to avoid async state bleed between tests
it('full submit calls submitGem and shows Submitted for review; Done goes back', async () => {
  (Picker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://photo.jpg' }],
  });
  (submitGem as jest.Mock).mockResolvedValue(undefined);

  const { findByTestId, getByPlaceholderText, findByText } = await renderWithTheme(<ShareGem />);
  const photoBox = await findByTestId('photo-box');
  fireEvent.press(photoBox);
  await waitFor(() => expect(Picker.launchImageLibraryAsync).toHaveBeenCalled());
  fireEvent.changeText(getByPlaceholderText('Name the spot'), 'Cool Spot');
  fireEvent.changeText(getByPlaceholderText('Why is it special? What should travelers look for?'), 'Great views');
  fireEvent.press(await findByTestId('submit-gem'));

  // Verify submitGem received the correct arguments
  await waitFor(() => expect(submitGem).toHaveBeenCalledWith('u1', expect.objectContaining({
    name: 'Cool Spot',
    note: 'Great views',
    cityId: 'city1',
    lat: 48.8566,
    lng: 2.3522,
    blob: MOCK_BLOB,
  })));

  // Verify success state transition and Done navigation
  expect(await findByText('Submitted for review')).toBeTruthy();
  expect(await findByText('Automated checks passed — a moderator will review it, usually within 24 hours.')).toBeTruthy();
  fireEvent.press(await findByTestId('done-btn'));
  expect(mockBack).toHaveBeenCalled();
});
