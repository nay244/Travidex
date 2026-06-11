import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { DexSheet } from '../DexSheet';

const sights = [
  { id: 'a', dex_no: 3, name: 'Cathedral', found: false },
  { id: 'b', dex_no: 1, name: 'Tower', found: true },
] as any;

// ---- Uncontrolled mode (existing behaviour for city/[id], find/pick, etc.) ----

it('renders completion header and rows, and filters by search (uncontrolled)', async () => {
  await renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={() => {}} />);
  // Header shows city name and found/total
  expect(screen.getByText('Paris')).toBeOnTheScreen();
  expect(screen.getByText('Cathedral')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByPlaceholderText('Search sights'), 'tow');
  await waitFor(() => expect(screen.queryByText('Cathedral')).toBeNull());
  expect(screen.getByText('Tower')).toBeOnTheScreen();
});

it('selecting a row calls onSelect (uncontrolled)', async () => {
  const onSelect = jest.fn();
  await renderWithTheme(<DexSheet cityName="Paris" sights={sights} onSelect={onSelect} />);
  fireEvent.press(screen.getByText('Tower'));
  expect(onSelect).toHaveBeenCalledWith('b');
});

// ---- Controlled mode (map overlay drives the query) ----

it('controlled mode: filters by external query and hides the internal TextInput', async () => {
  await renderWithTheme(
    <DexSheet cityName="Tokyo" sights={sights} onSelect={() => {}} query="tow" />,
  );
  // Only Tower matches
  expect(screen.getByText('Tower')).toBeOnTheScreen();
  expect(screen.queryByText('Cathedral')).toBeNull();
  // Internal search input must NOT be present in controlled mode
  expect(screen.queryByPlaceholderText('Search sights')).toBeNull();
});

it('controlled mode: empty query shows all rows', async () => {
  await renderWithTheme(
    <DexSheet cityName="Tokyo" sights={sights} onSelect={() => {}} query="" />,
  );
  expect(screen.getByText('Tower')).toBeOnTheScreen();
  expect(screen.getByText('Cathedral')).toBeOnTheScreen();
});
