import type { Stats } from './stats';

export type Badge = { code: string; label: string; test: (s: Stats) => boolean };

export const BADGES: Badge[] = [
  { code: 'first_find', label: 'First Find', test: s => s.totalFinds >= 1 },
  { code: 'finds_10', label: '10 Sights', test: s => s.totalFinds >= 10 },
  { code: 'finds_50', label: '50 Sights', test: s => s.totalFinds >= 50 },
  { code: 'city_claimed', label: 'City Claimed', test: s => s.citiesClaimed >= 1 },
  { code: 'countries_5', label: '5 Countries', test: s => s.countriesExplored >= 5 },
];

export function evaluateBadges(s: Stats): string[] {
  return BADGES.filter(b => b.test(s)).map(b => b.code);
}
