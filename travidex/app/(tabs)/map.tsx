import { useEffect, useState, useCallback } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';
import { LocationPicker } from '../../components/LocationPicker';
import { LogFindSheet } from '../../components/LogFindSheet';
import { Flag } from '../../components/Flag';
import type { SightWithFind } from '../../lib/types';

export default function MapScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cityId, setCityId } = useCity();
  const { sights, reload } = useCityCatalog(cityId);
  const { city } = useActiveCity(cityId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<SightWithFind | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reload on focus so pins/rows refresh after logging elsewhere
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  // Clear selection on any city change (picker, Explore's "Open map", etc.)
  useEffect(() => { setSelected(null); setLogModalOpen(false); setSearchQuery(''); }, [cityId]);

  const handleSelect = useCallback((id: string) => {
    const sight = sights.find(s => s.id === id) ?? null;
    setSelected(sight);
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

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView
          key={cityId}
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
                placeholder="Search sights"
                placeholderTextColor={t.colors.text3}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[t.type.body, { flex: 1, color: t.colors.text1, padding: 0 }]}
              />
            </View>
            {/* Glass filter icon button (decorative) */}
            <View style={[glassStyle, { width: 46, height: 46, borderRadius: t.radii.md, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="options-outline" size={18} color={t.colors.text1} />
            </View>
          </View>

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
      </View>

      {/* Selection banner (§3.2 select-to-log) */}
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

      <View style={{ height: '42%' }}>
        <DexSheet
          cityName={city?.name ?? ''}
          sights={sights}
          onSelect={handleSelect}
          selectedId={selected?.id ?? null}
          onSeeMore={handleSeeMore}
          query={searchQuery}
        />
      </View>

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
