jest.mock('../../supabase', () => {
  const mockMaybeSingle = jest.fn();
  const mockEqId = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelectCatalog = jest.fn(() => ({ eq: mockEqId }));

  const mockLimit = jest.fn();
  const mockOrderFinds = jest.fn(() => ({ limit: mockLimit }));
  const mockEqFinds = jest.fn(() => ({ order: mockOrderFinds }));
  const mockSelectFinds = jest.fn(() => ({ eq: mockEqFinds }));

  const mockFrom = jest.fn((t: string) =>
    t === 'sights' ? { select: mockSelectCatalog } : { select: mockSelectFinds });

  return {
    supabase: { from: mockFrom },
    __mocks: { mockMaybeSingle, mockEqId, mockSelectCatalog, mockLimit, mockOrderFinds, mockEqFinds, mockSelectFinds, mockFrom },
  };
});

import { getSightById } from '../catalog';
import { getRecentFinds } from '../finds';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const m = () => (jest.requireMock('../../supabase') as any).__mocks;

beforeEach(() => jest.clearAllMocks());

it('getSightById returns one sight', async () => {
  m().mockMaybeSingle.mockResolvedValue({ data: { id: 's1', name: 'Eiffel Tower' }, error: null });
  const s = await getSightById('s1');
  expect(m().mockEqId).toHaveBeenCalledWith('id', 's1');
  expect(s!.name).toBe('Eiffel Tower');
});

it('getRecentFinds returns latest finds for a sight', async () => {
  m().mockLimit.mockResolvedValue({ data: [{ id: 'f1', comment: 'Found!' }], error: null });
  const finds = await getRecentFinds('s1', 10);
  expect(m().mockEqFinds).toHaveBeenCalledWith('sight_id', 's1');
  expect(m().mockOrderFinds).toHaveBeenCalledWith('found_at', { ascending: false });
  expect(m().mockLimit).toHaveBeenCalledWith(10);
  expect(finds[0].comment).toBe('Found!');
});
