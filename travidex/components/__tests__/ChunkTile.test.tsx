import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { ChunkTile } from '../ChunkTile';

it('shows city name at bottom and mono count at 100% (claimed)', async () => {
  await renderWithTheme(<ChunkTile name="Tokyo" found={20} total={20} onPress={() => {}} />);
  expect(screen.getByText('Tokyo')).toBeOnTheScreen();
  // Outer Text contains "20/20" as combined accessible text
  expect(screen.getByText('20/20', { exact: false })).toBeOnTheScreen();
});

it('shows claimed marker at 100%', async () => {
  await renderWithTheme(<ChunkTile name="Tokyo" found={20} total={20} onPress={() => {}} />);
  expect(screen.getByTestId('claimed')).toBeOnTheScreen();
});

it('no claimed marker when in-progress', async () => {
  await renderWithTheme(<ChunkTile name="Osaka" found={5} total={20} onPress={() => {}} />);
  expect(screen.queryByTestId('claimed')).toBeNull();
});

it('no claimed marker when untouched', async () => {
  await renderWithTheme(<ChunkTile name="Kyoto" found={0} total={18} onPress={() => {}} />);
  expect(screen.queryByTestId('claimed')).toBeNull();
});

it('fires onPress', async () => {
  const onPress = jest.fn();
  await renderWithTheme(<ChunkTile name="Kyoto" found={0} total={18} onPress={onPress} />);
  fireEvent.press(screen.getByText('Kyoto'));
  expect(onPress).toHaveBeenCalled();
});

it('forwards testID to the root pressable', async () => {
  await renderWithTheme(
    <ChunkTile name="Paris" found={3} total={5} onPress={() => {}} testID="chunk-tile-paris" />
  );
  expect(screen.getByTestId('chunk-tile-paris')).toBeOnTheScreen();
});
