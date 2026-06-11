const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack, push: mockPush }), useLocalSearchParams: () => ({ id: 's1' }) }));
jest.mock('../../hooks/useSight', () => ({ useSight: jest.fn() }));
import { screen, fireEvent, act } from '@testing-library/react-native';
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

it('shows hero-unfound when not found', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'], about: 'Tower', hint: null, access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByTestId('hero-unfound')).toBeOnTheScreen();
  expect(screen.queryByTestId('hero-found')).toBeNull();
});

it('shows hero-found when found', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'], about: 'Tower', hint: null, access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: true, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.getByTestId('hero-found')).toBeOnTheScreen();
  expect(screen.queryByTestId('hero-unfound')).toBeNull();
});

it('back-btn calls router.back()', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: [], about: null, hint: null, access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  fireEvent.press(screen.getByTestId('back-btn'));
  expect(mockBack).toHaveBeenCalled();
});

it('hint text is hidden initially and visible after pressing toggle', async () => {
  (useSight as jest.Mock).mockReturnValue({
    sight: { id: 's1', dex_no: 1, name: 'Eiffel Tower', type_tags: ['Historic'], about: 'Tower', hint: 'South side', access: 'Easy', size: 'Large', busyness: 'Busy', lat: 48.85, lng: 2.29 },
    found: false, recentFinds: [], loading: false, reload: jest.fn(),
  });
  await renderWithTheme(<SightDetail />);
  expect(screen.queryByText('South side')).toBeNull();
  await act(async () => { fireEvent.press(screen.getByTestId('hint-toggle')); });
  expect(screen.getByText('South side')).toBeOnTheScreen();
});
