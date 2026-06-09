import { lightTheme, darkTheme } from '@/theme';
it('exposes light and dark themes with identical color keys', () => {
  expect(Object.keys(lightTheme.colors).sort()).toEqual(Object.keys(darkTheme.colors).sort());
  expect(lightTheme.colors.bg).toBeDefined();
});
