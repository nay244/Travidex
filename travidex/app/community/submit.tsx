import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useAuth } from '../../context/AuthProvider';
import { submitSight } from '../../lib/data/community';

// Default center: Paris seed center. Replaced by the map pin's region as the user drags.
const DEFAULT = { lat: 48.8566, lng: 2.3522 };

export default function Submit() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [coord, setCoord] = useState(DEFAULT);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name.trim()) return setError('Name is required');
    if (!session?.user) return;
    setError(null);
    setBusy(true);
    try {
      await submitSight(session.user.id, {
        name: name.trim(),
        cityId,
        typeTags: tags.split(',').map(t => t.trim()).filter(Boolean),
        about: null,
        hint: null,
        lat: coord.lat,
        lng: coord.lng,
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
      <TextInput placeholder="Sight name" placeholderTextColor={t.colors.text3} value={name} onChangeText={setName} style={[t.type.body, input]} />
      <TextInput placeholder="Type tags (comma separated)" placeholderTextColor={t.colors.text3} value={tags} onChangeText={setTags} style={[t.type.body, input]} />
      <MapView
        style={{ height: 180, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }}
        testID="map-view"
        onRegionChangeComplete={(r: any) => setCoord({ lat: r.latitude, lng: r.longitude })}
      />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Submit for review</Text>
      </Pressable>
    </ScrollView>
  );
}
