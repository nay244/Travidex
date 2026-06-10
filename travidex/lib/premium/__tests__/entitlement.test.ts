import { hasPremium } from '../entitlement';

it('true when the premium entitlement is active', () => {
  expect(hasPremium({ entitlements: { active: { premium: { isActive: true } } } } as any)).toBe(true);
});
it('false when absent', () => {
  expect(hasPremium({ entitlements: { active: {} } } as any)).toBe(false);
});
it('false for null customer info', () => {
  expect(hasPremium(null)).toBe(false);
});
