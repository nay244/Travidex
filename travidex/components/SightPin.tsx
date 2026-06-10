import { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightPin({ sight, onPress, selected }: { sight: SightWithFind; onPress: (id: string) => void; selected?: boolean }) {
  const t = useTheme();
  const pinColor = selected ? t.colors.pinSelected : sight.found ? t.colors.pinFound : 'transparent';
  const borderColor = selected ? t.colors.pinSelected : sight.found ? t.colors.pinFound : t.colors.pinUnseen;
  return (
    <Marker
      identifier={sight.id}
      coordinate={{ latitude: sight.lat, longitude: sight.lng }}
      onPress={() => onPress(sight.id)}
    >
      {/* found = solid pin; unfound = hollow (transparent fill, locked ring) — not an opacity dim; selected = amber */}
      <View style={{ width: 18, height: 18, borderRadius: 9,
        backgroundColor: pinColor,
        borderWidth: 2, borderColor: borderColor }} />
    </Marker>
  );
}
