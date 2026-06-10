const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
  },
}));
jest.mock('../../context/EntitlementProvider', () => ({
  useEntitlement: () => ({ refresh: jest.fn(), restore: jest.fn() }),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Purchases from 'react-native-purchases';
import { ThemeProvider } from '@/theme';
import Paywall from '../paywall';

const mockPurchases = Purchases as jest.Mocked<typeof Purchases>;

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

beforeEach(() => jest.clearAllMocks());

it('shows an offering package and purchases it', async () => {
  const pkg = { product: { priceString: '$3.99', title: 'Travidex+ Monthly' } };
  (mockPurchases.getOfferings as jest.Mock).mockResolvedValue({
    current: { availablePackages: [pkg] },
  });
  (mockPurchases.purchasePackage as jest.Mock).mockResolvedValue({});
  wrap(<Paywall />);
  await waitFor(() => expect(screen.getByText('$3.99')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('$3.99'));
  await waitFor(() => expect(Purchases.purchasePackage).toHaveBeenCalledWith(pkg));
});

it('user-cancel purchase does not show error text', async () => {
  const pkg = { product: { priceString: '$3.99', title: 'Travidex+ Monthly' } };
  (mockPurchases.getOfferings as jest.Mock).mockResolvedValue({
    current: { availablePackages: [pkg] },
  });
  (mockPurchases.purchasePackage as jest.Mock).mockRejectedValue({ userCancelled: true });
  wrap(<Paywall />);
  await waitFor(() => expect(screen.getByText('$3.99')).toBeOnTheScreen());
  fireEvent.press(screen.getByText('$3.99'));
  await waitFor(() => expect(mockPurchases.purchasePackage).toHaveBeenCalled());
  expect(screen.queryByText('Could not complete the purchase.')).toBeNull();
});

it('offerings failure still renders benefits', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  (mockPurchases.getOfferings as jest.Mock).mockRejectedValue(new Error('network'));
  wrap(<Paywall />);
  await waitFor(() =>
    expect(screen.getByText(/Dark theme/)).toBeOnTheScreen(),
  );
});
