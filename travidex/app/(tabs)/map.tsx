import { useEffect, useState, useCallback } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
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

  // Finding 1: reload on focus so pins/rows refresh after logging elsewhere
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  // Clear selection on any city change (picker, Explore's "Open map", etc.)
  useEffect(() => { setSelected(null); setLogModalOpen(false); }, [cityId]);

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

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView
          key={cityId} // remount per city: fresh initialRegion without fighting user panning
          style={{ flex: 1 }}
          testID="map-view"
          initialRegion={city ? { latitude: city.lat, longitude: city.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 } : undefined}
        >
          {sights.map(s => (
            <SightPin key={s.id} sight={s} onPress={handleSelect} selected={selected?.id === s.id} />
          ))}
        </MapView>
        <Pressable
          testID="location-pill"
          onPress={() => setPickerOpen(true)}
          style={{ position: 'absolute', top: insets.top + t.spacing.s2, left: t.spacing.s4, flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, paddingVertical: t.spacing.s2, paddingHorizontal: t.spacing.s3, borderRadius: 999, backgroundColor: t.colors.surfaceOverlay, borderWidth: 1, borderColor: t.colors.borderSubtle }}
        >
          <Flag code={city?.country_code ?? ''} size={22} radius={5} />
          <Text style={[t.type.body, { color: t.colors.text1 }]}>{city?.name ?? ''}</Text>
          <Text style={{ color: t.colors.text3 }}>{'▾'}</Text>
        </Pressable>
      </View>

      {/* Selection banner (Finding 2: select-to-log per design §3.2/§5) */}
      {selected && (
        <Pressable
          testID="selection-banner"
          onPress={handleBannerPress}
          style={{
            backgroundColor: t.colors.amberDim,
            borderWidth: 1,
            borderColor: t.colors.amberLine,
            borderRadius: t.radii.sm,
            marginHorizontal: t.spacing.s4,
            marginBottom: t.spacing.s2,
            paddingVertical: t.spacing.s3,
            paddingHorizontal: t.spacing.s4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>
            {'Selected ' + selected.name}
          </Text>
          {selected.found ? (
            <Text style={[t.type.caption, { color: t.colors.text2 }]}>Already in your dex</Text>
          ) : (
            <Text testID="banner-tap-to-log" style={[t.type.caption, { color: t.colors.amber }]}>TAP TO LOG</Text>
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
