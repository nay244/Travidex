import { buildDirectionsUrl } from '../externalMaps';

const dest = { lat: 48.8584, lng: 2.2945 };

it('apple url', () => {
  expect(buildDirectionsUrl('apple', dest)).toBe('http://maps.apple.com/?daddr=48.8584,2.2945&dirflg=d');
});
it('google url', () => {
  expect(buildDirectionsUrl('google', dest)).toBe('https://www.google.com/maps/dir/?api=1&destination=48.8584,2.2945&travelmode=driving');
});
it('waze url', () => {
  expect(buildDirectionsUrl('waze', dest)).toBe('https://waze.com/ul?ll=48.8584,2.2945&navigate=yes');
});
