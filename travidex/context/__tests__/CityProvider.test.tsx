import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { CityProvider, useCity } from '../CityProvider';

function Probe() {
  const { cityId, setCityId } = useCity();
  return (
    <>
      <Text>{cityId}</Text>
      <Pressable onPress={() => setCityId('tokyo')}><Text>change</Text></Pressable>
    </>
  );
}

it('defaults to the seeded Paris city and updates', async () => {
  await render(<CityProvider><Probe /></CityProvider>);
  expect(screen.getByText('22222222-2222-2222-2222-222222222222')).toBeOnTheScreen();
  await fireEvent.press(screen.getByText('change'));
  expect(screen.getByText('tokyo')).toBeOnTheScreen();
});
