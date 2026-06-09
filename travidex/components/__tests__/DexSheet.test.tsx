import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { DexSheet } from '../DexSheet';

const sights = [
  { id: 'a', dex_no: 3, name: 'Cathedral', found: false },
  { id: 'b', dex_no: 1, name: 'Tower', found: true },
] as any;

it('renders completion header and rows, and filters by search', async () => {
  await renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={() => {}} />);
  expect(screen.getByText('Paris · 1 of 2')).toBeOnTheScreen();
  expect(screen.getByText('Cathedral')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByPlaceholderText('Search sights'), 'tow');
  await waitFor(() => expect(screen.queryByText('Cathedral')).toBeNull());
  expect(screen.getByText('Tower')).toBeOnTheScreen();
});

it('selecting a row calls onSelect', async () => {
  const onSelect = jest.fn();
  await renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={onSelect} />);
  fireEvent.press(screen.getByText('Tower'));
  expect(onSelect).toHaveBeenCalledWith('b');
});
