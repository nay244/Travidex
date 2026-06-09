import { BADGES, evaluateBadges } from '../badges';

it('catalog has stable codes and labels', () => {
  expect(BADGES.map(b => b.code)).toEqual(['first_find', 'finds_10', 'finds_50', 'city_claimed', 'countries_5']);
});

it('awards first_find and city_claimed appropriately', () => {
  const earned = evaluateBadges({ totalFinds: 3, citiesClaimed: 1, countriesExplored: 1 });
  expect(earned).toContain('first_find');
  expect(earned).toContain('city_claimed');
  expect(earned).not.toContain('finds_10');
});

it('awards find milestones', () => {
  expect(evaluateBadges({ totalFinds: 50, citiesClaimed: 0, countriesExplored: 0 }))
    .toEqual(expect.arrayContaining(['first_find', 'finds_10', 'finds_50']));
});

it('awards countries_5 only at 5 explored countries', () => {
  expect(evaluateBadges({ totalFinds: 0, citiesClaimed: 0, countriesExplored: 5 })).toContain('countries_5');
  expect(evaluateBadges({ totalFinds: 0, citiesClaimed: 0, countriesExplored: 4 })).not.toContain('countries_5');
});
