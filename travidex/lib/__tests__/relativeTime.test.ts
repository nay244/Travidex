import { relativeTime } from '../relativeTime';

const NOW = new Date('2026-06-09T12:00:00Z');

it('returns "just now" for 30 seconds ago', () => {
  expect(relativeTime('2026-06-09T11:59:30Z', NOW)).toBe('just now');
});

it('returns minutes for 5 minutes ago', () => {
  expect(relativeTime('2026-06-09T11:55:00Z', NOW)).toBe('5m ago');
});

it('returns hours for 3 hours ago', () => {
  expect(relativeTime('2026-06-09T09:00:00Z', NOW)).toBe('3h ago');
});

it('returns days for 2 days ago', () => {
  expect(relativeTime('2026-06-07T12:00:00Z', NOW)).toBe('2d ago');
});

it('returns locale date for 30 days ago', () => {
  const result = relativeTime('2026-05-10T12:00:00Z', NOW);
  // Should be a locale date string, not a relative unit
  expect(result).not.toMatch(/ago|just now/);
  expect(result).toBe(new Date('2026-05-10T12:00:00Z').toLocaleDateString());
});
