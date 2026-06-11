import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { Medallion } from '../Medallion';

it('earned: renders icon and badge chip text', async () => {
  await renderWithTheme(
    <Medallion icon="walk-outline" tone="green" earned badge={7} testID="med" />
  );
  // testID wrapper is present
  expect(screen.getByTestId('med')).toBeOnTheScreen();
  // badge chip shows the number
  expect(screen.getByText('7')).toBeOnTheScreen();
});

it('locked: renders without badge chip', async () => {
  await renderWithTheme(
    <Medallion icon="earth-outline" tone="blue" earned={false} badge={3} testID="med-locked" />
  );
  expect(screen.getByTestId('med-locked')).toBeOnTheScreen();
  // badge is NOT rendered when locked
  expect(screen.queryByText('3')).toBeNull();
});

it('testID passthrough reaches the outer View', async () => {
  await renderWithTheme(
    <Medallion icon="flame-outline" tone="amber" earned testID="my-medallion" />
  );
  expect(screen.getByTestId('my-medallion')).toBeOnTheScreen();
});
