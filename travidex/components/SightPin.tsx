import { Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { SightWithFind } from '../lib/types';

export function SightPin({ sight, onPress, selected }: { sight: SightWithFind; onPress: (id: string) => void; selected?: boolean }) {
  const t = useTheme();

  // Pin state language:
  //   found    — green dot ~20px + white ✓ + soft green glow
  //   unfound  — dim grey dot ~14px, filled (pinUnseen)
  //   selected — amber, enlarged ~26px + amber glow (+ ✓ if found)
  const isFound = sight.found;

  const size = selected ? 26 : isFound ? 20 : 14;
  const bgColor = selected
    ? t.colors.pinSelected
    : isFound
    ? t.colors.pinFound
    : t.colors.pinUnseen;

  const shadowStyle = selected
    ? {
        shadowColor: t.colors.amberGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 4,
      }
    : isFound
    ? {
        shadowColor: t.colors.greenGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 4,
      }
    : {};

  // The check marks FOUND only — selection is conveyed by amber + size, never a check.
  const showCheck = isFound;

  return (
    <Marker
      identifier={sight.id}
      coordinate={{ latitude: sight.lat, longitude: sight.lng }}
      onPress={() => onPress(sight.id)}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadowStyle,
        }}
      >
        {showCheck && (
          <Text
            style={{
              color: t.colors.textOnAccent,
              fontSize: 10,
              lineHeight: 12,
              fontWeight: '700',
            }}
          >
            {'✓'}
          </Text>
        )}
      </View>
    </Marker>
  );
}
