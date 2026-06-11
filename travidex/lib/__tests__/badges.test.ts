import { BADGES, evaluateBadges } from '../badges';

const STATS_ZERO = { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0, worldFound: 0, worldTotal: 0 };

it('catalog has stable codes and labels', () => {
  expect(BADGES.map(b => b.code)).toEqual(['first_find', 'finds_10', 'finds_50', 'city_claimed', 'countries_5']);
});

it('each entry has icon and tone', () => {
  for (const b of BADGES) {
    expect(typeof b.icon).toBe('string');
    expect(['green', 'amber', 'blue']).toContain(b.tone);
  }
  expect(BADGES.find(b => b.code === 'first_find')!.tone).toBe('green');
  expect(BADGES.find(b => b.code === 'finds_10')!.tone).toBe('amber');
  expect(BADGES.find(b => b.code === 'finds_50')!.tone).toBe('amber');
  expect(BADGES.find(b => b.code === 'city_claimed')!.tone).toBe('green');
  expect(BADGES.find(b => b.code === 'countries_5')!.tone).toBe('blue');
});

it('awards first_find and city_claimed appropriately', () => {
  const earned = evaluateBadges({ ...STATS_ZERO, totalFinds: 3, citiesClaimed: 1, countriesExplored: 1 });
  expect(earned).toContain('first_find');
  expect(earned).toContain('city_claimed');
  expect(earned).not.toContain('finds_10');
});

it('awards find milestones', () => {
  expect(evaluateBadges({ ...STATS_ZERO, totalFinds: 50 }))
    .toEqual(expect.arrayContaining(['first_find', 'finds_10', 'finds_50']));
});

it('awards countries_5 only at 5 explored countries', () => {
  expect(evaluateBadges({ ...STATS_ZERO, countriesExplored: 5 })).toContain('countries_5');
  expect(evaluateBadges({ ...STATS_ZERO, countriesExplored: 4 })).not.toContain('countries_5');
});
