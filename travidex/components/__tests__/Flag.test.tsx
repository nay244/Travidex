import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { Flag } from '../Flag';

it('renders a known flag with the country name as label', async () => {
  await renderWithTheme(<Flag code="JP" size={22} />);
  expect(screen.getByLabelText('Japan')).toBeOnTheScreen();
});

it('renders a neutral placeholder for unknown codes', async () => {
  await renderWithTheme(<Flag code="ZZ" size={22} />);
  expect(screen.getByLabelText('ZZ')).toBeOnTheScreen();
});

it('renders the South Korea flag with the country name as label', async () => {
  await renderWithTheme(<Flag code="KR" size={22} />);
  expect(screen.getByLabelText('South Korea')).toBeOnTheScreen();
});
