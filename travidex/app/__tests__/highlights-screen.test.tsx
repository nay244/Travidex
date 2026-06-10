// Mocks must come before imports
jest.mock('react-native-view-shot', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ViewShot = React.forwardRef(
    ({ children, ...props }: any, ref: any) => <View ref={ref} {...props}>{children}</View>
  );
  ViewShot.displayName = 'ViewShot';
  return {
    __esModule: true,
    default: ViewShot,
    captureRef: jest.fn(),
  };
});

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  useLocalSearchParams: () => ({ cityId: 'city-1' }),
}));

jest.mock('../../context/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'uid-1' } } }),
}));

let mockIsPremium = false;
jest.mock('../../context/EntitlementProvider', () => ({
  useEntitlement: () => ({ isPremium: mockIsPremium }),
}));

jest.mock('../../hooks/useCityCatalog', () => ({ useCityCatalog: jest.fn() }));
jest.mock('../../hooks/useActiveCity', () => ({ useActiveCity: jest.fn() }));
jest.mock('../../lib/data/photos', () => ({ getUserPhotos: jest.fn() }));

// Mock Flag component to avoid theme dependency in snapshot
jest.mock('../../components/Flag', () => ({
  Flag: ({ code }: { code: string }) => {
    const { Text } = require('react-native');
    return <Text>{code}</Text>;
  },
}));

import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { getUserPhotos } from '../../lib/data/photos';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import RegionHighlights from '../highlights/[cityId]';

// ── Fixtures ──
const sights = [
  { id: 's1', dex_no: 1, name: 'Eiffel Tower', found: true,  city_id: 'city-1', type_tags: [], lat: 0, lng: 0, reference_photo: null, about: null, hint: null, access: null, size: null, busyness: null, source: 'curated' as const, created_at: '' },
  { id: 's2', dex_no: 2, name: 'Louvre',        found: true,  city_id: 'city-1', type_tags: [], lat: 0, lng: 0, reference_photo: null, about: null, hint: null, access: null, size: null, busyness: null, source: 'curated' as const, created_at: '' },
  { id: 's3', dex_no: 3, name: 'Notre Dame',    found: false, city_id: 'city-1', type_tags: [], lat: 0, lng: 0, reference_photo: null, about: null, hint: null, access: null, size: null, busyness: null, source: 'curated' as const, created_at: '' },
];

const photos = [
  { id: 'p1', sight_id: 's1', photo_url: 'https://example.com/p1.jpg' },
  { id: 'p2', sight_id: 's2', photo_url: 'https://example.com/p2.jpg' },
  { id: 'p3', sight_id: 's2', photo_url: 'https://example.com/p3.jpg' },
];

const cityData = { id: 'city-1', country_id: 'c1', name: 'Paris', region: null, lat: 48.85, lng: 2.35, country_code: 'FR', country_name: 'France' };

beforeEach(() => {
  jest.clearAllMocks();
  mockIsPremium = false;
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights,
    completion: { found: 2, total: 3 },
    loading: false,
  });
  (useActiveCity as jest.Mock).mockReturnValue({ city: cityData });
  (getUserPhotos as jest.Mock).mockResolvedValue(photos);
});

// ── Test cases ──

it('renders card and selection grid with all photos selected (3 OF 3 SELECTED)', async () => {
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('highlight-card')).toBeOnTheScreen());
  expect(screen.getByTestId('select-p1')).toBeOnTheScreen();
  expect(screen.getByTestId('select-p2')).toBeOnTheScreen();
  expect(screen.getByTestId('select-p3')).toBeOnTheScreen();
  expect(screen.getByText('3 OF 3 SELECTED')).toBeOnTheScreen();
});

it('toggling one photo shows 2 OF 3 SELECTED', async () => {
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('select-p1')).toBeOnTheScreen());
  await act(async () => { fireEvent.press(screen.getByTestId('select-p1')); });
  expect(screen.getByText('2 OF 3 SELECTED')).toBeOnTheScreen();
});

it('deselecting all disables share and shows select-at-least prompt', async () => {
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('select-p1')).toBeOnTheScreen());
  await act(async () => { fireEvent.press(screen.getByTestId('select-p1')); });
  await act(async () => { fireEvent.press(screen.getByTestId('select-p2')); });
  await act(async () => { fireEvent.press(screen.getByTestId('select-p3')); });
  expect(screen.getByText('Select at least one photo')).toBeOnTheScreen();
  const shareBtn = screen.getByTestId('share-btn');
  expect(shareBtn.props.accessibilityState?.disabled ?? shareBtn.props.disabled).toBeTruthy();
});

it('share press calls captureRef then shareAsync', async () => {
  (captureRef as jest.Mock).mockResolvedValue('file://x.png');
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('share-btn')).toBeOnTheScreen());
  await act(async () => { fireEvent.press(screen.getByTestId('share-btn')); });
  await waitFor(() => expect(captureRef).toHaveBeenCalled());
  expect(Sharing.shareAsync).toHaveBeenCalledWith('file://x.png');
});

it('shows highlights-empty when no found sights', async () => {
  (useCityCatalog as jest.Mock).mockReturnValue({
    sights: sights.map(s => ({ ...s, found: false })),
    completion: { found: 0, total: 3 },
    loading: false,
  });
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  expect(screen.getByTestId('highlights-empty')).toBeOnTheScreen();
});

it('renders frame chips (classic/gold/forest) with classic selected by default', async () => {
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('frame-classic')).toBeOnTheScreen());
  expect(screen.getByTestId('frame-gold')).toBeOnTheScreen();
  expect(screen.getByTestId('frame-forest')).toBeOnTheScreen();
  expect(screen.getByTestId('frame-classic')).toBeSelected();
  expect(screen.getByTestId('frame-gold')).not.toBeSelected();
  expect(screen.getByTestId('frame-forest')).not.toBeSelected();
});

it('free user tapping gold frame routes to paywall and frame stays classic', async () => {
  mockIsPremium = false;
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('frame-gold')).toBeOnTheScreen());
  await act(async () => { fireEvent.press(screen.getByTestId('frame-gold')); });
  expect(mockPush).toHaveBeenCalledWith('/paywall');
  expect(screen.getByTestId('frame-classic')).toBeSelected();
  expect(screen.getByTestId('frame-gold')).not.toBeSelected();
});

it('premium user tapping gold frame selects gold without paywall redirect', async () => {
  mockIsPremium = true;
  await act(async () => { renderWithTheme(<RegionHighlights />); });
  await waitFor(() => expect(screen.getByTestId('frame-gold')).toBeOnTheScreen());
  await act(async () => { fireEvent.press(screen.getByTestId('frame-gold')); });
  expect(mockPush).not.toHaveBeenCalled();
  await waitFor(() => {
    expect(screen.getByTestId('frame-gold')).toBeSelected();
    expect(screen.getByTestId('frame-classic')).not.toBeSelected();
  });
});
