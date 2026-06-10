import type { CustomerInfo } from 'react-native-purchases';

export const PREMIUM_ENTITLEMENT = 'premium';

export function hasPremium(info: CustomerInfo | null): boolean {
  return !!info?.entitlements?.active?.[PREMIUM_ENTITLEMENT];
}
