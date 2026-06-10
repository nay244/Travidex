import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';
import { LocationPicker } from '../../components/LocationPicker';
import { Flag } from '../../components/Flag';

export default function MapScreen() {
  const t = useTheme();
  const router = useRouter();
  const { cityId, setCityId } = useCity();
  const { sights } = useCityCatalog(cityId);
  const { city } = useActiveCity(cityId);
  const [pickerOpen, setPickerOpen] = useState(false);

  const open = (id: string) => router.push(`/sight/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView
          key={cityId} // remount per city: fresh initialRegion without fighting user panning
          style={{ flex: 1 }}
          testID="map-view"
          initialRegion={city ? { latitude: city.lat, longitude: city.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 } : undefined}
        >
          {sights.map(s => <SightPin key={s.id} sight={s} onPress={open} />)}
        </MapView>
        <Pressable
          testID="location-pill"
          onPress={() => setPickerOpen(true)}
          style={{ position: 'absolute', top: t.spacing.s5, left: t.spacing.s4, flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, paddingVertical: t.spacing.s2, paddingHorizontal: t.spacing.s3, borderRadius: 999, backgroundColor: t.colors.surfaceOverlay, borderWidth: 1, borderColor: t.colors.borderSubtle }}
        >
          <Flag code={city?.country_code ?? ''} size={22} radius={5} />
          <Text style={[t.type.body, { color: t.colors.text1 }]}>{city?.name ?? ''}</Text>
          <Text style={{ color: t.colors.text3 }}>{'▾'}</Text>
        </Pressable>
      </View>
      <View style={{ height: '42%' }}>
        <DexSheet cityName={city?.name ?? ''} sights={sights} onSelect={open} />
      </View>
      <LocationPicker
        visible={pickerOpen}
        currentCityId={cityId}
        initialCountryId={city?.country_id ?? null}
        onPick={(id) => { setCityId(id); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
