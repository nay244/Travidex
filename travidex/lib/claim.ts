export type ProgressState = 'untouched' | 'in-progress' | 'claimed';

export function isClaimed(found: number, total: number): boolean {
  return total > 0 && found === total;
}

export function progressState(found: number, total: number): ProgressState {
  if (isClaimed(found, total)) return 'claimed';
  if (found > 0) return 'in-progress';
  return 'untouched';
}
