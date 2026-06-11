import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { SelectionProvider, useSelection } from '../SelectionProvider';
import type { SightWithFind } from '../../lib/types';

const SIGHT: SightWithFind = {
  id: 's1', city_id: 'c1', dex_no: 1, name: 'Eiffel Tower', found: false,
  lat: 48.85, lng: 2.29, type_tags: [], reference_photo: null, about: null,
  hint: null, access: null, size: null, busyness: null, source: 'curated',
  created_at: '2024-01-01T00:00:00Z',
};

function Probe() {
  const { selected, setSelected, logRequested, requestLog, clearLogRequest } = useSelection();
  return (
    <>
      <Text testID="selected">{selected ? selected.name : 'none'}</Text>
      <Text testID="log-requested">{String(logRequested)}</Text>
      <Pressable onPress={() => setSelected(SIGHT)}><Text>set-sight</Text></Pressable>
      <Pressable onPress={() => setSelected(null)}><Text>clear-sight</Text></Pressable>
      <Pressable onPress={requestLog}><Text>request-log</Text></Pressable>
      <Pressable onPress={clearLogRequest}><Text>clear-log</Text></Pressable>
    </>
  );
}

function Wrapper() {
  return <SelectionProvider><Probe /></SelectionProvider>;
}

it('starts with no selection and logRequested=false', async () => {
  await render(<Wrapper />);
  expect(screen.getByTestId('selected').props.children).toBe('none');
  expect(screen.getByTestId('log-requested').props.children).toBe('false');
});

it('setSelected stores the sight', async () => {
  await render(<Wrapper />);
  await act(async () => { fireEvent.press(screen.getByText('set-sight')); });
  expect(screen.getByTestId('selected').props.children).toBe('Eiffel Tower');
});

it('setSelected(null) clears the sight', async () => {
  await render(<Wrapper />);
  await act(async () => { fireEvent.press(screen.getByText('set-sight')); });
  await act(async () => { fireEvent.press(screen.getByText('clear-sight')); });
  expect(screen.getByTestId('selected').props.children).toBe('none');
});

it('requestLog flips logRequested to true', async () => {
  await render(<Wrapper />);
  await act(async () => { fireEvent.press(screen.getByText('request-log')); });
  expect(screen.getByTestId('log-requested').props.children).toBe('true');
});

it('clearLogRequest resets logRequested to false', async () => {
  await render(<Wrapper />);
  await act(async () => { fireEvent.press(screen.getByText('request-log')); });
  await act(async () => { fireEvent.press(screen.getByText('clear-log')); });
  expect(screen.getByTestId('log-requested').props.children).toBe('false');
});
