const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }), useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useSight } from '../../hooks/useSight';
import SightDetail from '../sight/[id]';

beforeEach(() => jest.clearAllMocks());

it('renders the entry and routes to navigate', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'], about: 'Tower', hint: 'South side', access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByText('Eiffel Tower')).toBeOnTheScreen();
  expect(screen.getByText('Easy')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Navigate'));
  expect(mockPush).toHaveBeenCalledWith('/sight/s1/navigate');
});
