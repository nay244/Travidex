import type { SightWithFind as Base } from './types';
export type SightWithFind = Base;
export type SortKey = 'dex' | 'found' | 'name';

export function filterSights(list: SightWithFind[], query: string): SightWithFind[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(s => s.name.toLowerCase().includes(q));
}

export function sortSights(list: SightWithFind[], key: SortKey): SightWithFind[] {
  const copy = [...list];
  if (key === 'dex') return copy.sort((a, b) => a.dex_no - b.dex_no);
  if (key === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => Number(b.found) - Number(a.found) || a.dex_no - b.dex_no);
}

export function completion(list: SightWithFind[]): { found: number; total: number } {
  return { found: list.filter(s => s.found).length, total: list.length };
}
