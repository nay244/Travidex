import type { Stats } from './stats';

export type Badge = { code: string; label: string; icon: string; tone: 'green' | 'amber' | 'blue'; test: (s: Stats) => boolean };

export const BADGES: Badge[] = [
  { code: 'first_find',  label: 'First Find',  icon: 'walk-outline',    tone: 'green', test: s => s.totalFinds >= 1 },
  { code: 'finds_10',   label: '10 Sights',   icon: 'eye-outline',     tone: 'amber', test: s => s.totalFinds >= 10 },
  { code: 'finds_50',   label: '50 Sights',   icon: 'flame-outline',   tone: 'amber', test: s => s.totalFinds >= 50 },
  { code: 'city_claimed', label: 'City Claimed', icon: 'trophy-outline', tone: 'green', test: s => s.citiesClaimed >= 1 },
  { code: 'countries_5', label: '5 Countries', icon: 'earth-outline',   tone: 'blue',  test: s => s.countriesExplored >= 5 },
];

export function evaluateBadges(s: Stats): string[] {
  return BADGES.filter(b => b.test(s)).map(b => b.code);
}
