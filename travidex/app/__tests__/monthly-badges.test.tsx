// Tests for the Monthly Badges screen (§3.9).
// Copy a case to add a new scenario.

jest.mock('../../context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'u1' } } }),
}));

jest.mock('../../lib/data/finds', () => ({
  getFindMonths: jest.fn(),
}));

// Stub expo-router so useRouter() doesn't throw outside a navigation context.
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn() }),
}));

import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { getFindMonths } from '../../lib/data/finds';
import MonthlyBadges from '../profile/monthly-badges';

beforeEach(() => jest.clearAllMocks());

// Fixed "now" so year-list derivation is deterministic across all test runs.
const NOW = new Date('2026-06-10T12:00:00Z');

it('shows an earned cell for a month with a find', async () => {
  (getFindMonths as jest.Mock).mockResolvedValue(new Set(['2026-05']));
  await renderWithTheme(<MonthlyBadges now={NOW} />);
  await waitFor(() => expect(screen.getByTestId('month-2026-05-earned')).toBeOnTheScreen());
});

it('shows a locked cell for an unearned month', async () => {
  (getFindMonths as jest.Mock).mockResolvedValue(new Set(['2026-05']));
  await renderWithTheme(<MonthlyBadges now={NOW} />);
  await waitFor(() => expect(screen.getByTestId('month-2026-04-locked')).toBeOnTheScreen());
});

it('renders a year section for the current year', async () => {
  (getFindMonths as jest.Mock).mockResolvedValue(new Set());
  await renderWithTheme(<MonthlyBadges now={NOW} />);
  await waitFor(() => expect(screen.getByText('2026 badges')).toBeOnTheScreen());
});
