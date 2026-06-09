import type { Sight, City, Country, Find } from '../../types';

it('Sight shape compiles with required fields', () => {
  const s: Sight = {
    id: '1', city_id: 'c', dex_no: 1, name: 'X', type_tags: [], reference_photo: null,
    about: null, hint: null, access: null, size: null, busyness: null,
    lat: 0, lng: 0, source: 'curated', created_at: 'now',
  };
  expect(s.name).toBe('X');
});
