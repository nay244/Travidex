import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { SightRow } from '../SightRow';

const sight = { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: true, type_tags: [] } as any;
const sightWithTags = { id: 's2', dex_no: 2, name: 'Louvre', found: false, type_tags: ['Historic', 'Scenic', 'Food', 'Modern'] } as any;

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

it('renders type chips from type_tags, capped at 2 with +N overflow chip', async () => {
  await renderWithTheme(<SightRow sight={sightWithTags} onPress={() => {}} />);
  // First 2 chips rendered
  expect(screen.getByText('Historic')).toBeOnTheScreen();
  expect(screen.getByText('Scenic')).toBeOnTheScreen();
  // 3rd and 4th chips replaced by overflow indicator
  expect(screen.queryByText('Food')).toBeNull();
  expect(screen.queryByText('Modern')).toBeNull();
  // Overflow chip shows correct count
  expect(screen.getByText('+2')).toBeOnTheScreen();
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
