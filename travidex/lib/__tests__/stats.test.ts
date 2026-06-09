import { computeStats } from '../stats';

const city = new Map([['c1', { found: 3, total: 3 }], ['c2', { found: 1, total: 4 }]]);
const country = new Map([['k1', { found: 4, total: 7 }], ['k2', { found: 0, total: 5 }]]);

it('computes finds, claimed cities, explored countries', () => {
  const s = computeStats(city, country, 4);
  expect(s.totalFinds).toBe(4);
  expect(s.citiesClaimed).toBe(1);       // c1 only
  expect(s.countriesExplored).toBe(1);   // k1 has finds
});
