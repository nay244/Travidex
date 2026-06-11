const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../hooks/useActiveCity', () => ({
  useActiveCity: () => ({ city: { id: 'city-1', name: 'Paris', country_id: 'fr', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' } }),
}));
jest.mock('../../lib/data/catalog', () => ({ getSightById: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn(), getUserFindCount: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));
import { AccessibilityInfo } from 'react-native';
import { screen, waitFor, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { getSightById } from '../../lib/data/catalog';
import { getUserFindCount } from '../../lib/data/finds';
import Success from '../find/success';

// Reduced motion → resolve true so animation loops don't start in tests.
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

const mockSight = { id: 's1', city_id: 'city-1', name: 'Eiffel Tower', dex_no: 1, type_tags: [], reference_photo: null, about: null, hint: null, access: null, size: null, busyness: null, lat: 0, lng: 0, source: 'curated', created_at: '' };

beforeEach(() => {
  jest.clearAllMocks();
  mockPush.mockReset();
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [],
    completion: { found: 1, total: 8 },
    loading: false,
    reload: jest.fn(),
  });
  (getSightById as jest.Mock).mockResolvedValue(mockSight);
  (getUserFindCount as jest.Mock).mockResolvedValue(1); // first-ever find by default
});

describe('new-find variant', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ sightId: 's1' });
  });

  it('shows dex number formatted as #001', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('#001 · Paris')).toBeTruthy());
  });

  it('shows sight name', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Eiffel Tower')).toBeTruthy());
  });

  it('shows "Added to your dex" message', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex')).toBeTruthy());
  });

  it('shows completion bar with city found/total text', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('PARIS · 1 / 8')).toBeTruthy());
  });

  it('shows meta line with dex number and city name', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('#001 · Paris')).toBeTruthy());
  });

  it('shows "BADGE UNLOCKED · FIRST FIND" badge card on the user\'s first-ever find', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('BADGE UNLOCKED · FIRST FIND')).toBeTruthy());
  });

  it('does NOT show first-find badge when the user has prior finds in other cities', async () => {
    (getUserFindCount as jest.Mock).mockResolvedValue(5);
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex')).toBeTruthy());
    expect(screen.queryByText(/BADGE UNLOCKED/)).toBeNull();
  });

  it('shows "BADGE UNLOCKED · CITY CLAIMED" badge when all sights found', async () => {
    (useCityCatalog as jest.Mock).mockReturnValue({
      sights: [],
      completion: { found: 8, total: 8 },
      loading: false,
      reload: jest.fn(),
    });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('BADGE UNLOCKED · CITY CLAIMED')).toBeTruthy());
  });

  it('shows no badge card for a middle-of-list find', async () => {
    (getUserFindCount as jest.Mock).mockResolvedValue(4);
    (useCityCatalog as jest.Mock).mockReturnValue({
      sights: [],
      completion: { found: 4, total: 8 },
      loading: false,
      reload: jest.fn(),
    });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex')).toBeTruthy());
    expect(screen.queryByText(/BADGE UNLOCKED/)).toBeNull();
  });

  it('renders confetti on new-find variant', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex')).toBeTruthy());
    expect(screen.getByTestId('confetti')).toBeTruthy();
  });
});

describe('already variant', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ sightId: 's1', already: '1' });
  });

  it('shows sight name and "Already in your dex" text', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Eiffel Tower')).toBeTruthy());
    expect(screen.getByText('Already in your dex')).toBeTruthy();
  });

  it('shows meta line with dex number and city on already variant', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('#001 · Paris')).toBeTruthy());
  });

  it('does NOT show the completion bar', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText(/PARIS/)).toBeNull();
  });

  it('does NOT show a badge card', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText(/BADGE UNLOCKED/)).toBeNull();
  });

  it('does NOT show "Added to your dex" message', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText('Added to your dex')).toBeNull();
  });

  it('does NOT render confetti on already variant', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByTestId('confetti')).toBeNull();
  });
});

describe('View entry button', () => {
  it('renders "View entry" in the new-find variant and navigates to /sight/s1', async () => {
    mockUseLocalSearchParams.mockReturnValue({ sightId: 's1' });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('View entry')).toBeTruthy());
    fireEvent.press(screen.getByText('View entry'));
    expect(mockPush).toHaveBeenCalledWith('/sight/s1');
  });

  it('renders "View entry" in the already variant and navigates to /sight/s1', async () => {
    mockUseLocalSearchParams.mockReturnValue({ sightId: 's1', already: '1' });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('View entry')).toBeTruthy());
    fireEvent.press(screen.getByText('View entry'));
    expect(mockPush).toHaveBeenCalledWith('/sight/s1');
  });
});
