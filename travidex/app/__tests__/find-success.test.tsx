const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));
jest.mock('../../context/CityProvider', () => ({ useCity: () => ({ cityId: 'city-1' }) }));
jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../lib/data/catalog', () => ({ getSightById: jest.fn() }));
jest.mock('../../lib/data/finds', () => ({ getFoundSightIds: jest.fn() }));
jest.mock('../../context/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: 'u1' } } }) }));

import { screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { getSightById } from '../../lib/data/catalog';
import Success from '../find/success';

const mockSight = { id: 's1', city_id: 'city-1', name: 'Eiffel Tower', dex_no: 1, type_tags: [], reference_photo: null, about: null, hint: null, access: null, size: null, busyness: null, lat: 0, lng: 0, source: 'curated', created_at: '' };

beforeEach(() => {
  jest.clearAllMocks();
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: [],
    completion: { found: 1, total: 8 },
    loading: false,
    reload: jest.fn(),
  });
  (getSightById as jest.Mock).mockResolvedValue(mockSight);
});

describe('new-find variant', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ sightId: 's1' });
  });

  it('shows dex number formatted as #001', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('#001')).toBeTruthy());
  });

  it('shows sight name', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Eiffel Tower')).toBeTruthy());
  });

  it('shows "Added to your dex!" message', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex!')).toBeTruthy());
  });

  it('shows completion bar with city found/total text', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('This city · 1 of 8')).toBeTruthy());
  });

  it('shows "First find!" badge card when found === 1', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('First find!')).toBeTruthy());
  });

  it('shows "City claimed!" badge when all sights found', async () => {
    (useCityCatalog as jest.Mock).mockReturnValue({
      sights: [],
      completion: { found: 8, total: 8 },
      loading: false,
      reload: jest.fn(),
    });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('City claimed!')).toBeTruthy());
  });

  it('shows no badge card for a middle-of-list find', async () => {
    (useCityCatalog as jest.Mock).mockReturnValue({
      sights: [],
      completion: { found: 4, total: 8 },
      loading: false,
      reload: jest.fn(),
    });
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Added to your dex!')).toBeTruthy());
    expect(screen.queryByText('First find!')).toBeNull();
    expect(screen.queryByText('City claimed!')).toBeNull();
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

  it('does NOT show the completion bar', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText(/This city/)).toBeNull();
  });

  it('does NOT show a badge card', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText('First find!')).toBeNull();
    expect(screen.queryByText('City claimed!')).toBeNull();
  });

  it('does NOT show "Added to your dex!" message', async () => {
    await renderWithTheme(<Success />);
    await waitFor(() => expect(screen.getByText('Already in your dex')).toBeTruthy());
    expect(screen.queryByText('Added to your dex!')).toBeNull();
  });
});
