import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import Map from '../(tabs)/map';
import Profile from '../(tabs)/profile';

it('renders the Map placeholder', async () => {
  await renderWithTheme(<Map />);
  expect(screen.getByText('Map')).toBeOnTheScreen();
});

it('renders the Profile placeholder', async () => {
  await renderWithTheme(<Profile />);
  expect(screen.getByText('Profile')).toBeOnTheScreen();
});
