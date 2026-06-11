jest.mock('../../supabase', () => {
  const mockMaybeSingle = jest.fn();
  const mockEqId = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelectCatalog = jest.fn(() => ({ eq: mockEqId }));

  const mockLimit = jest.fn();
  const mockOrderFinds = jest.fn(() => ({ limit: mockLimit }));
  const mockEqFinds = jest.fn(() => ({ order: mockOrderFinds }));
  const mockSelectFinds = jest.fn(() => ({ eq: mockEqFinds }));

  const mockIn = jest.fn();
  const mockSelectProfiles = jest.fn(() => ({ in: mockIn }));

  const mockFrom = jest.fn((t: string) =>
    t === 'sights' ? { select: mockSelectCatalog }
    : t === 'profiles' ? { select: mockSelectProfiles }
    : { select: mockSelectFinds });

  return {
    supabase: { from: mockFrom },
    __mocks: { mockMaybeSingle, mockEqId, mockSelectCatalog, mockLimit, mockOrderFinds, mockEqFinds, mockSelectFinds, mockIn, mockSelectProfiles, mockFrom },
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

it('getRecentFinds returns latest finds with merged usernames', async () => {
  m().mockLimit.mockResolvedValue({ data: [{ id: 'f1', comment: 'Found!', found_at: '2026-06-11T00:00:00Z', user_id: 'u1' }], error: null });
  m().mockIn.mockResolvedValue({ data: [{ user_id: 'u1', username: 'admin' }], error: null });
  const finds = await getRecentFinds('s1', 10);
  expect(m().mockEqFinds).toHaveBeenCalledWith('sight_id', 's1');
  expect(m().mockOrderFinds).toHaveBeenCalledWith('found_at', { ascending: false });
  expect(m().mockLimit).toHaveBeenCalledWith(10);
  expect(m().mockIn).toHaveBeenCalledWith('user_id', ['u1']);
  expect(finds[0].comment).toBe('Found!');
  expect(finds[0].username).toBe('admin');
});

it('getRecentFinds skips the profile lookup when there are no finds', async () => {
  m().mockLimit.mockResolvedValue({ data: [], error: null });
  const finds = await getRecentFinds('s1', 10);
  expect(finds).toEqual([]);
  expect(m().mockIn).not.toHaveBeenCalled();
});
