import { filterSights, sortSights, completion, SightWithFind } from '../sightList';

const s = (id: string, dex: number, name: string, found: boolean): SightWithFind =>
  ({ id, dex_no: dex, name, found } as SightWithFind);
const list = [s('a', 3, 'Cathedral', false), s('b', 1, 'Tower', true), s('c', 2, 'Market', false)];

it('filterSights matches name case-insensitively', () => {
  expect(filterSights(list, 'tow').map(x => x.id)).toEqual(['b']);
});
it('filterSights empty query returns all', () => {
  expect(filterSights(list, '')).toHaveLength(3);
});
it('sortSights by dex', () => {
  expect(sortSights(list, 'dex').map(x => x.dex_no)).toEqual([1, 2, 3]);
});
it('sortSights by found first', () => {
  expect(sortSights(list, 'found')[0].found).toBe(true);
});
it('completion counts found/total', () => {
  expect(completion(list)).toEqual({ found: 1, total: 3 });
});
