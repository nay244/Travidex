import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { SightRow } from '../SightRow';

const sight = { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: true, type_tags: [] } as any;
const sightWithTags = { id: 's2', dex_no: 2, name: 'Louvre', found: false, type_tags: ['Historic', 'Scenic', 'Food', 'Modern'] } as any;

it('shows name and dex number and a found thumbnail', async () => {
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('#001')).toBeOnTheScreen();
  expect(screen.getByTestId('thumb-found')).toBeOnTheScreen();
  expect(screen.queryByTestId('thumb-unfound')).toBeNull();
});

it('shows thumb-unfound for unfound sights', async () => {
  const unfound = { ...sight, found: false } as any;
  await renderWithTheme(<SightRow sight={unfound} onPress={() => {}} />);
  expect(screen.getByTestId('thumb-unfound')).toBeOnTheScreen();
  expect(screen.queryByTestId('thumb-found')).toBeNull();
});

it('fires onPress with the sight id', async () => {
  const onPress = jest.fn();
  await renderWithTheme(<SightRow sight={sight} onPress={onPress} />);
  fireEvent.press(screen.getByText('Eiffel Tower'));
  expect(onPress).toHaveBeenCalledWith('s1');
});

it('renders every type tag as its own chip (no +N collapse)', async () => {
  await renderWithTheme(<SightRow sight={sightWithTags} onPress={() => {}} />);
  expect(screen.getByText('Historic')).toBeOnTheScreen();
  expect(screen.getByText('Scenic')).toBeOnTheScreen();
  expect(screen.getByText('Food')).toBeOnTheScreen();
  expect(screen.getByText('Modern')).toBeOnTheScreen();
  expect(screen.queryByText(/^\+\d+$/)).toBeNull();
});

it('does NOT render a favorite heart when onToggleFavorite is not provided', async () => {
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} />);
  expect(screen.queryByTestId('fav-s1')).toBeNull();
});

it('renders unfavorited heart (♡) when onToggleFavorite provided and favorited=false', async () => {
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} favorited={false} onToggleFavorite={() => {}} />);
  expect(screen.getByTestId('fav-s1')).toBeOnTheScreen();
  expect(screen.getByText('♡')).toBeOnTheScreen();
});

it('renders favorited heart (♥) in amber state when favorited=true', async () => {
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} favorited={true} onToggleFavorite={() => {}} />);
  expect(screen.getByTestId('fav-s1')).toBeOnTheScreen();
  expect(screen.getByText('♥')).toBeOnTheScreen();
});

it('pressing fav-<id> calls onToggleFavorite with sight id', async () => {
  const onToggleFavorite = jest.fn();
  await renderWithTheme(<SightRow sight={sight} onPress={() => {}} favorited={false} onToggleFavorite={onToggleFavorite} />);
  fireEvent.press(screen.getByTestId('fav-s1'));
  expect(onToggleFavorite).toHaveBeenCalledWith('s1');
});
