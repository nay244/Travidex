import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useAuth } from '../../context/AuthProvider';
import { submitSight } from '../../lib/data/community';
import { useActiveCity } from '../../hooks/useActiveCity';
import { LocationPicker } from '../../components/LocationPicker';

export default function Submit() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { session } = useAuth();
  const [submitCityId, setSubmitCityId] = useState(cityId);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { city } = useActiveCity(submitCityId);

  const cityCenter = city
    ? { latitude: city.lat, longitude: city.lng }
    : { latitude: 48.8566, longitude: 2.3522 };

  const [coord, setCoord] = useState(cityCenter);

  // Re-seed coord when city changes
  const handlePickCity = (newCityId: string) => {
    setSubmitCityId(newCityId);
    setPickerVisible(false);
    // coord will update via the key-based MapView remount
  };

  // When city loads, sync coord to city center (covers initial load + city change)
  const mapRegion = city
    ? { latitude: city.lat, longitude: city.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 }
    : { latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.08, longitudeDelta: 0.08 };

  async function submit() {
    if (!name.trim()) return setError('Name is required');
    if (!session?.user) return;
    setError(null);
    setBusy(true);
    try {
      await submitSight(session.user.id, {
        name: name.trim(),
        cityId: submitCityId,
        typeTags: tags.split(',').map(t => t.trim()).filter(Boolean),
        about: null,
        hint: null,
        lat: coord.latitude,
        lng: coord.longitude,
      });
      router.back();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: t.spacing.s5 }}>
      <Text style={[t.type.h2, { color: t.colors.text1, marginBottom: t.spacing.s4 }]}>Submit a sight</Text>
      <Pressable
        testID="city-picker-row"
        onPress={() => setPickerVisible(true)}
        style={{ backgroundColor: t.colors.surface2, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }}
      >
        <Text style={[t.type.body, { color: t.colors.text1 }]}>
          {`City: ${city?.name ?? '...'}`}
        </Text>
      </Pressable>
      <TextInput placeholder="Sight name" placeholderTextColor={t.colors.text3} value={name} onChangeText={setName} style={[t.type.body, input]} />
      <TextInput placeholder="Type tags (comma separated)" placeholderTextColor={t.colors.text3} value={tags} onChangeText={setTags} style={[t.type.body, input]} />
      <MapView
        key={submitCityId}
        style={{ height: 180, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }}
        testID="map-view"
        initialRegion={mapRegion}
        onRegionChangeComplete={(r: any) => setCoord({ latitude: r.latitude, longitude: r.longitude })}
      >
        <Marker coordinate={coord} />
      </MapView>
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Submit for review</Text>
      </Pressable>
      <LocationPicker
        visible={pickerVisible}
        currentCityId={submitCityId}
        initialCountryId={city?.country_id ?? null}
        onPick={handlePickCity}
        onClose={() => setPickerVisible(false)}
      />
    </ScrollView>
  );
}
