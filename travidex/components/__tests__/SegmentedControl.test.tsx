import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { SegmentedControl } from '../SegmentedControl';

const OPTIONS = [
  { key: 'a', label: 'Option A', testID: 'seg-a' },
  { key: 'b', label: 'Option B', testID: 'seg-b' },
  { key: 'c', label: 'Option C', testID: 'seg-c' },
];

it('renders all option labels', async () => {
  const { getByText } = await renderWithTheme(
    <SegmentedControl options={OPTIONS} value="a" onChange={jest.fn()} />
  );
  expect(getByText('Option A')).toBeTruthy();
  expect(getByText('Option B')).toBeTruthy();
  expect(getByText('Option C')).toBeTruthy();
});

it('pressing an inactive option fires onChange with its key', async () => {
  const onChange = jest.fn();
  const { getByTestId } = await renderWithTheme(
    <SegmentedControl options={OPTIONS} value="a" onChange={onChange} />
  );
  fireEvent.press(getByTestId('seg-b'));
  expect(onChange).toHaveBeenCalledWith('b');
});

it('pressing another inactive option fires onChange with its key', async () => {
  const onChange = jest.fn();
  const { getByTestId } = await renderWithTheme(
    <SegmentedControl options={OPTIONS} value="a" onChange={onChange} />
  );
  fireEvent.press(getByTestId('seg-c'));
  expect(onChange).toHaveBeenCalledWith('c');
});

it('pressing the active option fires onChange with its key', async () => {
  const onChange = jest.fn();
  const { getByTestId } = await renderWithTheme(
    <SegmentedControl options={OPTIONS} value="a" onChange={onChange} />
  );
  fireEvent.press(getByTestId('seg-a'));
  expect(onChange).toHaveBeenCalledWith('a');
});

it('active label has semibold font; inactive label has regular font', async () => {
  const { getByText } = await renderWithTheme(
    <SegmentedControl options={OPTIONS} value="b" onChange={jest.fn()} />
  );
  const activeLabel = getByText('Option B');
  const inactiveLabel = getByText('Option A');
  // Active uses SpaceGrotesk_600SemiBold; inactive uses SpaceGrotesk_400Regular
  expect(activeLabel.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ fontFamily: 'SpaceGrotesk_600SemiBold' }),
    ])
  );
  expect(inactiveLabel.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ fontFamily: 'SpaceGrotesk_400Regular' }),
    ])
  );
});

it('renders the three-option community sort labels', async () => {
  const sortOptions = [
    { key: 'favs',    label: 'Most favorited', testID: 'sort-favs' },
    { key: 'newest',  label: 'Newest',         testID: 'sort-newest' },
    { key: 'nearest', label: 'Nearest',        testID: 'sort-nearest' },
  ];
  const { getByText } = await renderWithTheme(
    <SegmentedControl options={sortOptions} value="favs" onChange={jest.fn()} />
  );
  expect(getByText('Most favorited')).toBeTruthy();
  expect(getByText('Newest')).toBeTruthy();
  expect(getByText('Nearest')).toBeTruthy();
});
