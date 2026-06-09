import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { ChunkTile } from '../ChunkTile';

it('shows city name, progress, and claimed marker at 100%', async () => {
  await renderWithTheme(<ChunkTile name="Tokyo" found={20} total={20} onPress={() => {}} />);
  expect(screen.getByText('Tokyo')).toBeOnTheScreen();
  expect(screen.getByText('20/20')).toBeOnTheScreen();
  expect(screen.getByTestId('claimed')).toBeOnTheScreen();
});

it('no claimed marker when in-progress', async () => {
  await renderWithTheme(<ChunkTile name="Osaka" found={5} total={20} onPress={() => {}} />);
  expect(screen.queryByTestId('claimed')).toBeNull();
});

it('fires onPress', async () => {
  const onPress = jest.fn();
  await renderWithTheme(<ChunkTile name="Kyoto" found={0} total={18} onPress={onPress} />);
  fireEvent.press(screen.getByText('Kyoto'));
  expect(onPress).toHaveBeenCalled();
});
