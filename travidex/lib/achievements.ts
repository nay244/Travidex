import type { Stats } from './stats';

export type Achievement = {
  id: string;
  label: string;
  icon: string;           // Ionicons name, decorative
  tone: 'green' | 'amber' | 'blue';
  level: number;          // display level (all start at 1)
  description: string;    // "how to unlock" copy for the detail page
  goal: number;
  value: (s: Stats) => number; // current progress toward goal
};

// Add an achievement: copy a line, rename, set goal + value selector.
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps',  label: 'First steps',   icon: 'walk-outline',   tone: 'green', level: 1, description: 'Log your very first find.',          goal: 1,  value: s => s.totalFinds },
  { id: 'ten_sights',   label: 'Ten sights',    icon: 'eye-outline',    tone: 'amber', level: 1, description: 'Log 10 finds anywhere in the world.', goal: 10, value: s => s.totalFinds },
  { id: 'fifty_sights', label: 'Fifty sights',  icon: 'flame-outline',  tone: 'amber', level: 1, description: 'Log 50 finds anywhere in the world.', goal: 50, value: s => s.totalFinds },
  { id: 'city_claimer', label: 'City claimer',  icon: 'trophy-outline', tone: 'green', level: 1, description: 'Find every sight in one city.',       goal: 1,  value: s => s.citiesClaimed },
  { id: 'globetrotter', label: 'Globetrotter',  icon: 'earth-outline',  tone: 'blue',  level: 1, description: 'Log finds in 5 different countries.', goal: 5,  value: s => s.countriesExplored },
];

export function achievementProgress(a: Achievement, s: Stats): { value: number; done: boolean } {
  const value = Math.min(a.value(s), a.goal);
  return { value, done: value >= a.goal };
}
