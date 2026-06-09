import { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightPin({ sight, onPress }: { sight: SightWithFind; onPress: (id: string) => void }) {
  const t = useTheme();
  return (
    <Marker
      identifier={sight.id}
      coordinate={{ latitude: sight.lat, longitude: sight.lng }}
      onPress={() => onPress(sight.id)}
    >
      {/* found = solid pin; unfound = hollow (transparent fill, locked ring) — not an opacity dim */}
      <View style={{ width: 18, height: 18, borderRadius: 9,
        backgroundColor: sight.found ? t.colors.pinFound : 'transparent',
        borderWidth: 2, borderColor: sight.found ? t.colors.pinFound : t.colors.pinUnseen }} />
    </Marker>
  );
}
