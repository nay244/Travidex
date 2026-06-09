import type { Progress } from './data/progress';
import { isClaimed } from './claim';

export type Stats = { totalFinds: number; citiesClaimed: number; countriesExplored: number };

export function computeStats(city: Map<string, Progress>, country: Map<string, Progress>, totalFinds: number): Stats {
  let citiesClaimed = 0;
  for (const p of city.values()) if (isClaimed(p.found, p.total)) citiesClaimed++;
  let countriesExplored = 0;
  for (const p of country.values()) if (p.found > 0) countriesExplored++;
  return { totalFinds, citiesClaimed, countriesExplored };
}
