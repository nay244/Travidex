import { ACHIEVEMENTS, achievementProgress } from '../achievements';

const S0 = { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0, worldFound: 0, worldTotal: 0 };

it('catalog has stable ids in order', () => {
  expect(ACHIEVEMENTS.map(a => a.id)).toEqual([
    'first_steps',
    'ten_sights',
    'fifty_sights',
    'city_claimer',
    'globetrotter',
  ]);
});

it('each entry has tone and level', () => {
  for (const a of ACHIEVEMENTS) {
    expect(['green', 'amber', 'blue']).toContain(a.tone);
    expect(typeof a.level).toBe('number');
  }
  expect(ACHIEVEMENTS.find(a => a.id === 'first_steps')!.tone).toBe('green');
  expect(ACHIEVEMENTS.find(a => a.id === 'ten_sights')!.tone).toBe('amber');
  expect(ACHIEVEMENTS.find(a => a.id === 'fifty_sights')!.tone).toBe('amber');
  expect(ACHIEVEMENTS.find(a => a.id === 'city_claimer')!.tone).toBe('green');
  expect(ACHIEVEMENTS.find(a => a.id === 'globetrotter')!.tone).toBe('blue');
});

it('progress clamps at goal (never exceeds)', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'first_steps')!;
  const result = achievementProgress(a, { ...S0, totalFinds: 99 });
  expect(result.value).toBe(1); // clamped to goal=1
});

it('done flag is true exactly at goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'ten_sights')!;
  expect(achievementProgress(a, { ...S0, totalFinds: 10 }).done).toBe(true);
});

it('done flag is true over goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'ten_sights')!;
  expect(achievementProgress(a, { ...S0, totalFinds: 50 }).done).toBe(true);
});

it('done flag is false under goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'fifty_sights')!;
  expect(achievementProgress(a, { ...S0, totalFinds: 12 }).done).toBe(false);
});

it('city_claimer uses citiesClaimed', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'city_claimer')!;
  expect(achievementProgress(a, { ...S0, citiesClaimed: 1 }).done).toBe(true);
  expect(achievementProgress(a, { ...S0 }).done).toBe(false);
});

it('globetrotter uses countriesExplored', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'globetrotter')!;
  expect(achievementProgress(a, { ...S0, countriesExplored: 5 }).done).toBe(true);
  expect(achievementProgress(a, { ...S0, countriesExplored: 3 }).done).toBe(false);
});
