import { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Keyboard, Modal, PanResponder, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useSelection } from '../../context/SelectionProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';
import { LocationPicker } from '../../components/LocationPicker';
import { LogFindSheet } from '../../components/LogFindSheet';
import { Flag } from '../../components/Flag';
import { filterSights } from '../../lib/sightList';
import type { SightWithFind } from '../../lib/types';

export default function MapScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { cityId, setCityId } = useCity();
  const { selected, setSelected, logRequested, clearLogRequest } = useSelection();
  const { sights, reload } = useCityCatalog(cityId);
  const { city } = useActiveCity(cityId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const mapRef = useRef<MapView>(null);

  // --- 3-snap sheet --------------------------------------------------------
  // Snap points as distance from top of screen (smaller = taller sheet).
  // peek  ≈ 140pt from bottom (just grabber + header visible)
  // half  ≈ sheet covers the bottom 40 % of the screen (per device feedback)
  // full  ≈ top safe-area inset + 60
  const usableHeight = height;
  const snapPoints = useRef({
    peek: usableHeight - 140,
    half: usableHeight * 0.6,
    full: insets.top + 60,
  });

  // Keep snap points up-to-date if dimensions change (orientation, etc.)
  useEffect(() => {
    snapPoints.current = {
      peek: usableHeight - 140,
      half: usableHeight * 0.6,
      full: insets.top + 60,
    };
  }, [usableHeight, insets.top]);

  // Animated top edge of the sheet container. Default snap = half.
  const sheetTop = useRef(new Animated.Value(usableHeight * 0.6)).current;
  // Track the committed snap so we know the base position on each new drag.
  const currentSnap = useRef<'peek' | 'half' | 'full'>('half');
  const dragStart = useRef(0); // sheet position when a drag begins, for clamping

  const snapTo = useCallback((target: 'peek' | 'half' | 'full') => {
    currentSnap.current = target;
    Animated.spring(sheetTop, {
      toValue: snapPoints.current[target],
      useNativeDriver: false,
      bounciness: 2,
      speed: 14,
    }).start();
  }, [sheetTop]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 4,
      onPanResponderGrant: () => {
        // Stop any in-flight spring so drag starts from current rendered position.
        sheetTop.stopAnimation();
        dragStart.current = (sheetTop as any)._value;
        // Flatten so getAnimatedValue reads correctly from here.
        (sheetTop as any).setOffset(dragStart.current);
        (sheetTop as any).setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        const pts = snapPoints.current;
        // Clamp the RESULTING position (offset + delta) between full and peek.
        const next = Math.max(pts.full, Math.min(pts.peek, dragStart.current + gs.dy));
        sheetTop.setValue(next - dragStart.current);
      },
      onPanResponderRelease: (_, gs) => {
        (sheetTop as any).flattenOffset();
        const pts = snapPoints.current;
        // Current raw position after release.
        const cur = (sheetTop as any)._value as number;
        // Find nearest snap point.
        let best: 'peek' | 'half' | 'full' = 'half';
        let bestDist = Infinity;
        for (const k of ['peek', 'half', 'full'] as const) {
          const d = Math.abs(pts[k] - cur);
          if (d < bestDist) { bestDist = d; best = k; }
        }
        // Fast flick: velocity > 0.8 toward peek → peek; < -0.8 → full.
        if (gs.vy > 0.8) best = 'peek';
        else if (gs.vy < -0.8) best = 'full';
        currentSnap.current = best;
        Animated.spring(sheetTop, {
          toValue: pts[best],
          useNativeDriver: false,
          bounciness: 2,
          speed: 14,
        }).start();
      },
      onPanResponderTerminate: (_, gs) => {
        (sheetTop as any).flattenOffset();
        const pts = snapPoints.current;
        const cur = (sheetTop as any)._value as number;
        let best: 'peek' | 'half' | 'full' = 'half';
        let bestDist = Infinity;
        for (const k of ['peek', 'half', 'full'] as const) {
          const d = Math.abs(pts[k] - cur);
          if (d < bestDist) { bestDist = d; best = k; }
        }
        currentSnap.current = best;
        Animated.spring(sheetTop, {
          toValue: pts[best],
          useNativeDriver: false,
          bounciness: 2,
          speed: 14,
        }).start();
      },
    }),
  ).current;
  // -------------------------------------------------------------------------

  // Stop animation on unmount to prevent rAF callbacks firing outside act() in tests
  useEffect(() => () => { sheetTop.stopAnimation(); }, [sheetTop]);

  // Reload on focus so pins/rows refresh after logging elsewhere
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  // Clear selection on any city change (picker, Explore's "Open map", etc.)
  useEffect(() => { setSelected(null); setLogModalOpen(false); setSearchQuery(''); }, [cityId]);

  // Handle stamp FAB log request from the tab bar
  useEffect(() => {
    if (!logRequested) return;
    clearLogRequest();
    if (!selected) return;
    if (selected.found) {
      router.push({ pathname: '/find/success', params: { sightId: selected.id, already: '1' } });
    } else {
      setLogModalOpen(true);
    }
  }, [logRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to half snap on city change
  useEffect(() => { snapTo('half'); }, [cityId, snapTo]);

  const handleSelect = useCallback((id: string) => {
    const sight = sights.find(s => s.id === id) ?? null;
    setSelected(sight);
    if (sight) {
      // Tight zoom, and shift the region center south so the pin lands in the
      // middle of the VISIBLE map area (the sheet covers the bottom ~40%).
      const latitudeDelta = 0.012;
      mapRef.current?.animateToRegion(
        {
          latitude: sight.lat - latitudeDelta * 0.2,
          longitude: sight.lng,
          latitudeDelta,
          longitudeDelta: 0.012,
        },
        350,
      );
    }
  }, [sights]);

  const handleSeeMore = useCallback((id: string) => {
    router.push(`/sight/${id}`);
  }, [router]);

  const handleBannerPress = useCallback(() => {
    if (!selected) return;
    if (selected.found) {
      router.push({ pathname: '/find/success', params: { sightId: selected.id, already: '1' } });
    } else {
      setLogModalOpen(true);
    }
  }, [selected, router]);

  const handleLogged = useCallback(() => {
    if (!selected) return;
    const sightId = selected.id;
    setLogModalOpen(false);
    setSelected(null);
    reload();
    router.push({ pathname: '/find/success', params: { sightId } });
  }, [selected, reload, router]);

  // Glass overlay style shared by search row and filter button
  const glassStyle = {
    backgroundColor: t.colors.surfaceOverlay,
    borderWidth: 1,
    borderColor: t.colors.borderSubtle,
  } as const;

  const showSuggestions = searchFocused && searchQuery.trim().length >= 1;
  const suggestions = showSuggestions ? filterSights(sights, searchQuery).slice(0, 5) : [];

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Map takes full height; sheet is absolutely positioned over it */}
      <MapView
        key={cityId}
        ref={mapRef}
        style={{ flex: 1 }}
        testID="map-view"
        initialRegion={city ? { latitude: city.lat, longitude: city.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 } : undefined}
      >
        {sights.map(s => (
          <SightPin key={s.id} sight={s} onPress={handleSelect} selected={selected?.id === s.id} />
        ))}
      </MapView>

      {/* Top overlay: search row (flex) + filter icon button */}
      <View style={{ position: 'absolute', top: insets.top + t.spacing.s2, left: t.spacing.s4, right: t.spacing.s4, zIndex: 20, gap: t.spacing.s3 }}>
        <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
          {/* Glass search field */}
          <View style={[glassStyle, { flex: 1, flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: t.spacing.s4, borderRadius: t.radii.md, gap: t.spacing.s2 }]}>
            <Ionicons name="search" size={16} color={t.colors.text3} />
            <TextInput
              testID="map-search"
              placeholder="Search sights"
              placeholderTextColor={t.colors.text3}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={[t.type.body, { flex: 1, color: t.colors.text1, padding: 0 }]}
            />
          </View>
          {/* Glass filter icon button (decorative) */}
          <View style={[glassStyle, { width: 46, height: 46, borderRadius: t.radii.md, alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="options-outline" size={18} color={t.colors.text1} />
          </View>
        </View>

        {/* Search suggestions */}
        {showSuggestions && (
          <View style={[glassStyle, {
            borderRadius: t.radii.md,
            overflow: 'hidden',
            zIndex: 30,
          }]}>
            {suggestions.length === 0 ? (
              <View style={{ paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s4 }}>
                <Text style={[t.type.body, { color: t.colors.text3 }]}>No sights match</Text>
              </View>
            ) : suggestions.map(s => (
              <Pressable
                key={s.id}
                testID={`suggestion-${s.id}`}
                onPress={() => {
                  handleSelect(s.id);
                  setSearchQuery('');
                  Keyboard.dismiss();
                }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s4, gap: t.spacing.s2 }}
              >
                <Text style={[t.type.body, { flex: 1, color: t.colors.text1 }]} numberOfLines={1}>{s.name}</Text>
                <Text style={[t.type.body, { fontFamily: t.fontFamily.monoRegular, fontSize: t.fontSize.caption, color: t.colors.text3 }]}>
                  #{String(s.dex_no).padStart(3, '0')}
                </Text>
                {s.found ? (
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: t.colors.found }} />
                ) : (
                  <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: t.colors.text3 }} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Location pill */}
        <Pressable
          testID="location-pill"
          onPress={() => setPickerOpen(true)}
          style={[glassStyle, {
            alignSelf: 'flex-start',
            flexDirection: 'row', alignItems: 'center',
            gap: t.spacing.s2,
            height: 38,
            paddingHorizontal: t.spacing.s3,
            borderRadius: 999,
          }]}
        >
          <Flag code={city?.country_code ?? ''} size={22} radius={5} />
          <Text style={[t.type.body, { color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }]}>{city?.name ?? ''}</Text>
          <Ionicons name="chevron-down" size={14} color={t.colors.text3} />
        </Pressable>
      </View>

      {/* 3-snap dex sheet — absolutely positioned, animated top edge */}
      <Animated.View
        testID="dex-sheet-container"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: sheetTop,
          zIndex: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {/* Selection banner sits at the top of the sheet container, visible at all snaps */}
        {selected && (
          <Pressable
            testID="selection-banner"
            onPress={handleBannerPress}
            style={{
              backgroundColor: t.colors.amberDim,
              borderWidth: 1,
              borderColor: t.colors.amberLine,
              borderRadius: t.radii.md,
              marginHorizontal: t.spacing.s3,
              marginBottom: t.spacing.s2,
              paddingVertical: t.spacing.s3,
              paddingHorizontal: t.spacing.s3,
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s2,
            }}
          >
            <Ionicons name="ribbon-outline" size={16} color={t.colors.amber} />
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1, fontSize: t.fontSize.caption }]} numberOfLines={1}>
              {'Selected '}
              <Text style={{ fontFamily: t.fontFamily.sansBold }}>{selected.name}</Text>
            </Text>
            {selected.found ? (
              <Text style={[t.type.caption, { color: t.colors.text2 }]}>Already in your dex</Text>
            ) : (
              <Text testID="banner-tap-to-log" style={{ fontFamily: t.fontFamily.monoBold, fontSize: t.fontSize.micro, letterSpacing: 0.08 * t.fontSize.micro, color: t.colors.amber }}>TAP TO LOG ↓</Text>
            )}
          </Pressable>
        )}

        <DexSheet
          cityName={city?.name ?? ''}
          sights={sights}
          onSelect={handleSelect}
          selectedId={selected?.id ?? null}
          onSeeMore={handleSeeMore}
          query={searchQuery}
          dragHandleProps={panResponder.panHandlers}
        />
      </Animated.View>

      <LocationPicker
        visible={pickerOpen}
        currentCityId={cityId}
        initialCountryId={city?.country_id ?? null}
        onPick={(id) => { setCityId(id); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />

      {/* Log modal for unfound selection */}
      <Modal transparent visible={logModalOpen} onRequestClose={() => setLogModalOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: t.colors.surfaceScrim, justifyContent: 'flex-end' }}
          onPress={() => setLogModalOpen(false)}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            {selected && !selected.found && (
              <LogFindSheet sightId={selected.id} onLogged={handleLogged} />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
