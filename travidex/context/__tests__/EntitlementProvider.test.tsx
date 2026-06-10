jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    getCustomerInfo: jest.fn(),
    restorePurchases: jest.fn(),
  },
}));

import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import Purchases from 'react-native-purchases';
import { EntitlementProvider, useEntitlement } from '../EntitlementProvider';

const mockPurchases = Purchases as jest.Mocked<typeof Purchases>;

function Probe() {
  const { isPremium, loading } = useEntitlement();
  return <Text>{loading ? 'loading' : isPremium ? 'premium' : 'free'}</Text>;
}

beforeEach(() => jest.clearAllMocks());

it('reflects an active premium entitlement', async () => {
  (mockPurchases.getCustomerInfo as jest.Mock).mockResolvedValue({
    entitlements: { active: { premium: { isActive: true } } },
  });
  render(<EntitlementProvider><Probe /></EntitlementProvider>);
  await waitFor(() => expect(screen.getByText('premium')).toBeOnTheScreen());
});

it('defaults to free', async () => {
  (mockPurchases.getCustomerInfo as jest.Mock).mockResolvedValue({
    entitlements: { active: {} },
  });
  render(<EntitlementProvider><Probe /></EntitlementProvider>);
  await waitFor(() => expect(screen.getByText('free')).toBeOnTheScreen());
});

it('renders free and clears loading when getCustomerInfo rejects', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  (mockPurchases.getCustomerInfo as jest.Mock).mockRejectedValue(new Error('network error'));
  render(<EntitlementProvider><Probe /></EntitlementProvider>);
  await waitFor(() => expect(screen.getByText('free')).toBeOnTheScreen());
});
