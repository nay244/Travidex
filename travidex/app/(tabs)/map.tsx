import { View } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightPin } from '../../components/SightPin';
import { DexSheet } from '../../components/DexSheet';

export default function MapScreen() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { sights } = useCityCatalog(cityId);

  const open = (id: string) => router.push(`/sight/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} testID="map-view">
          {sights.map(s => <SightPin key={s.id} sight={s} onPress={open} />)}
        </MapView>
      </View>
      <View style={{ height: '42%' }}>
        <DexSheet cityName="Paris" sights={sights} onSelect={open} />
      </View>
    </View>
  );
}
