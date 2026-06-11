const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack, push: mockPush }) }));
jest.mock('../../context/EntitlementProvider', () => ({ useEntitlement: jest.fn() }));

import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useEntitlement } from '../../context/EntitlementProvider';
import Appearance from '../profile/appearance';

beforeEach(() => jest.clearAllMocks());

it('routes free users to the paywall when enabling dark', async () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: false });
  await renderWithTheme(<Appearance />);
  fireEvent.press(screen.getByTestId('option-dark'));
  expect(mockPush).toHaveBeenCalledWith('/paywall');
});

it('lets premium users switch to dark without paywall redirect', async () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: true });
  await renderWithTheme(<Appearance />);

  // Before pressing dark, light is selected and dark is not
  expect(screen.getByTestId('option-light')).toBeSelected();
  expect(screen.getByTestId('option-dark')).not.toBeSelected();

  fireEvent.press(screen.getByTestId('option-dark'));

  expect(mockPush).not.toHaveBeenCalled();
  // After pressing dark, dark is selected and light is not
  await waitFor(() => {
    expect(screen.getByTestId('option-dark')).toBeSelected();
    expect(screen.getByTestId('option-light')).not.toBeSelected();
  });
});

it('renders without crash', async () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: true });
  await renderWithTheme(<Appearance />);
  expect(screen.getByText('Appearance')).toBeTruthy();
});

it('back-btn calls router.back()', async () => {
  (useEntitlement as jest.Mock).mockReturnValue({ isPremium: false });
  await renderWithTheme(<Appearance />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});
