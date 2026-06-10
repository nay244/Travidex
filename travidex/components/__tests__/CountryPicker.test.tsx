import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { CountryPicker } from '../CountryPicker';
import type { Country } from '../../lib/types';
import type { Progress } from '../../lib/data/progress';

const COUNTRIES: Country[] = [
  { id: 'fr', name: 'France', code: 'FR', tier: 'cities', created_at: '' },
  { id: 'us', name: 'United States', code: 'US', tier: 'states', created_at: '' },
];

const PROGRESS: Map<string, Progress> = new Map([
  ['fr', { found: 2, total: 5 }],
  ['us', { found: 0, total: 10 }],
]);

it('renders rows with name and progress', async () => {
  await renderWithTheme(
    <CountryPicker
      visible
      countries={COUNTRIES}
      progress={PROGRESS}
      currentId="fr"
      onPick={jest.fn()}
      onClose={jest.fn()}
    />,
  );

  expect(screen.getByText('France')).toBeOnTheScreen();
  expect(screen.getByText('2/5 sights')).toBeOnTheScreen();
  expect(screen.getByText('United States')).toBeOnTheScreen();
  expect(screen.getByText('0/10 sights')).toBeOnTheScreen();
});

it('calls onPick with the country id when a row is pressed', async () => {
  const onPick = jest.fn();
  await renderWithTheme(
    <CountryPicker
      visible
      countries={COUNTRIES}
      progress={PROGRESS}
      currentId="fr"
      onPick={onPick}
      onClose={jest.fn()}
    />,
  );

  fireEvent.press(screen.getByText('United States'));
  expect(onPick).toHaveBeenCalledWith('us');
});
