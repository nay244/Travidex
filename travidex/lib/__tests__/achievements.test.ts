import { ACHIEVEMENTS, achievementProgress } from '../achievements';

it('catalog has stable ids in order', () => {
  expect(ACHIEVEMENTS.map(a => a.id)).toEqual([
    'first_steps',
    'ten_sights',
    'fifty_sights',
    'city_claimer',
    'globetrotter',
  ]);
});

it('progress clamps at goal (never exceeds)', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'first_steps')!;
  const result = achievementProgress(a, { totalFinds: 99, citiesClaimed: 0, countriesExplored: 0 });
  expect(result.value).toBe(1); // clamped to goal=1
});

it('done flag is true exactly at goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'ten_sights')!;
  expect(achievementProgress(a, { totalFinds: 10, citiesClaimed: 0, countriesExplored: 0 }).done).toBe(true);
});

it('done flag is true over goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'ten_sights')!;
  expect(achievementProgress(a, { totalFinds: 50, citiesClaimed: 0, countriesExplored: 0 }).done).toBe(true);
});

it('done flag is false under goal', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'fifty_sights')!;
  expect(achievementProgress(a, { totalFinds: 12, citiesClaimed: 0, countriesExplored: 0 }).done).toBe(false);
});

it('city_claimer uses citiesClaimed', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'city_claimer')!;
  expect(achievementProgress(a, { totalFinds: 0, citiesClaimed: 1, countriesExplored: 0 }).done).toBe(true);
  expect(achievementProgress(a, { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0 }).done).toBe(false);
});

it('globetrotter uses countriesExplored', () => {
  const a = ACHIEVEMENTS.find(a => a.id === 'globetrotter')!;
  expect(achievementProgress(a, { totalFinds: 0, citiesClaimed: 0, countriesExplored: 5 }).done).toBe(true);
  expect(achievementProgress(a, { totalFinds: 0, citiesClaimed: 0, countriesExplored: 3 }).done).toBe(false);
});
