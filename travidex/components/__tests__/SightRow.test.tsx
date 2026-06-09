import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { SightRow } from '../SightRow';

const sight = { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: true } as any;

it('shows name and dex number and a found indicator', async () => {
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('#001')).toBeOnTheScreen();
  expect(screen.getByTestId('found-check')).toBeOnTheScreen();
});

it('fires onPress with the sight id', async () => {
  const onPress = jest.fn();
  await renderWithTheme(<SightRow sight={sight} onPress={onPress} />);
  fireEvent.press(screen.getByText('Eiffel Tower'));
  expect(onPress).toHaveBeenCalledWith('s1');
});
