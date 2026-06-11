import type { Progress } from './data/progress';
import { isClaimed } from './claim';

export type Stats = { totalFinds: number; citiesClaimed: number; countriesExplored: number; worldFound: number; worldTotal: number };

export function computeStats(city: Map<string, Progress>, country: Map<string, Progress>, totalFinds: number): Stats {
  let citiesClaimed = 0;
  for (const p of city.values()) if (isClaimed(p.found, p.total)) citiesClaimed++;
  let countriesExplored = 0;
  let worldFound = 0;
  let worldTotal = 0;
  for (const p of country.values()) {
    if (p.found > 0) countriesExplored++;
    worldFound += p.found;
    worldTotal += p.total;
  }
  return { totalFinds, citiesClaimed, countriesExplored, worldFound, worldTotal };
}
