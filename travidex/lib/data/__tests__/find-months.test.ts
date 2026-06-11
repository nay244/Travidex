// TDD: getFindMonths — months (YYYY-MM) in which the user logged at least one find.
// Copy-a-case style: add a row below to cover a new scenario.

const mockEq = jest.fn();
const mockSelect = jest.fn(() => ({ eq: mockEq }));

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({ select: mockSelect })),
  },
}));

import { getFindMonths } from '../finds';

beforeEach(() => jest.clearAllMocks());

it('returns a Set of YYYY-MM strings for months with at least one find', async () => {
  mockEq.mockResolvedValue({
    data: [
      { found_at: '2026-05-02T10:00:00Z' },
      { found_at: '2026-05-20T14:30:00Z' },
      { found_at: '2026-06-01T08:00:00Z' },
    ],
    error: null,
  });
  const result = await getFindMonths('u1');
  // Two finds in May → one entry; one find in June → one entry
  expect(result).toEqual(new Set(['2026-05', '2026-06']));
});

it('returns an empty Set when the user has no finds', async () => {
  mockEq.mockResolvedValue({ data: [], error: null });
  const result = await getFindMonths('u1');
  expect(result).toEqual(new Set());
});

it('throws when supabase returns an error', async () => {
  mockEq.mockResolvedValue({ data: null, error: { message: 'db error' } });
  await expect(getFindMonths('u1')).rejects.toThrow('db error');
});
