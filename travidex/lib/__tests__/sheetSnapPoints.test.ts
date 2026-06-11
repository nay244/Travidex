import { sheetSnapPoints } from '../sheetSnapPoints';

// Window 844pt tall, 47pt status inset — iPhone-ish reference numbers.

it('peek leaves the bottom 140pt visible when nothing is selected', () => {
  expect(sheetSnapPoints(844, 47, 0).peek).toBe(844 - 140);
});

it('peek rises by the selection-banner height so the grabber stays reachable', () => {
  // Regression: with a sight selected, the banner used to fill the peek strip
  // and push the grabber below the tab bar — sheet invisible and un-draggable.
  expect(sheetSnapPoints(844, 47, 56).peek).toBe(844 - 140 - 56);
});

it('half and full are unaffected by the selection offset', () => {
  const base = sheetSnapPoints(844, 47, 0);
  const withBanner = sheetSnapPoints(844, 47, 56);
  expect(withBanner.half).toBe(base.half);
  expect(withBanner.full).toBe(base.full);
});
