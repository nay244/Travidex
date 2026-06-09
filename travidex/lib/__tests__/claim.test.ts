import { isClaimed, progressState } from '../claim';

it('claimed only at 100% with at least one sight', () => {
  expect(isClaimed(3, 3)).toBe(true);
  expect(isClaimed(2, 3)).toBe(false);
  expect(isClaimed(0, 0)).toBe(false);
});

it('progressState buckets correctly', () => {
  expect(progressState(0, 3)).toBe('untouched');
  expect(progressState(1, 3)).toBe('in-progress');
  expect(progressState(3, 3)).toBe('claimed');
});
