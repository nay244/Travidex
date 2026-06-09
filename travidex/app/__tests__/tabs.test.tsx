import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import Map from '../(tabs)/map';
import Profile from '../(tabs)/profile';

jest.mock('../../hooks/useCityCatalog', () => ({
  useCityCatalog: jest.fn(() => ({
    sights: [], completion: { found: 0, total: 0 }, loading: false, reload: jest.fn(),
  })),
}));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../hooks/useProfile', () => ({
  useProfile: () => ({ stats: { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0 }, earnedBadges: [], loading: false }),
}));

it('renders the Map screen', async () => {
  await renderWithTheme(<Map />);
  expect(screen.getByTestId('map-view')).toBeOnTheScreen();
});

it('renders the Profile screen', async () => {
  await renderWithTheme(<Profile />);
  expect(screen.getByText('Sights found')).toBeOnTheScreen();
});
