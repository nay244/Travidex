import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useSight } from '../../../hooks/useSight';
import { SightPin } from '../../../components/SightPin';
import { buildDirectionsUrl, MapProvider } from '../../../lib/navigation/externalMaps';

export default function Navigate() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, loading } = useSight(id!);
  const [mode, setMode] = useState<'walking' | 'driving'>('walking');

  if (loading || !sight) return <View style={{ flex: 1, backgroundColor: t.colors.bg }} />;

  const drive = (provider: MapProvider) =>
    Linking.openURL(buildDirectionsUrl(provider, { lat: sight.lat, lng: sight.lng }));

  const Tab = ({ k, label }: { k: 'walking' | 'driving'; label: string }) => (
    <Pressable
      onPress={() => setMode(k)}
      style={{
        paddingVertical: t.spacing.s3,
        paddingHorizontal: t.spacing.s5,
        backgroundColor: mode === k ? t.colors.actionPositive : t.colors.surface2,
        borderRadius: t.radii.lg,
      }}
    >
      <Text style={[t.type.body, { color: mode === k ? t.colors.textOnAccent : t.colors.text1 }]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flexDirection: 'row', gap: t.spacing.s3, padding: t.spacing.s4 }}>
        <Tab k="walking" label="Walking" />
        <Tab k="driving" label="Driving" />
      </View>
      {mode === 'walking' ? (
        <MapView style={{ flex: 1 }} testID="map-view">
          <SightPin sight={{ ...sight, found: true } as any} onPress={() => {}} />
        </MapView>
      ) : (
        <View style={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
          <Text style={[t.type.body, { color: t.colors.text2 }]}>Open directions in:</Text>
          {(['apple', 'google', 'waze'] as MapProvider[]).map(p => (
            <Pressable
              key={p}
              onPress={() => drive(p)}
              style={{ backgroundColor: t.colors.surface2, padding: t.spacing.s4, borderRadius: t.radii.sm }}
            >
              <Text style={[t.type.body, { color: t.colors.text1 }]}>
                {p === 'apple' ? 'Apple Maps' : p === 'google' ? 'Google Maps' : 'Waze'}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
