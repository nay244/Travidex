import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../context/AuthProvider';
import { useCity } from '../../context/CityProvider';
import { useActiveCity } from '../../hooks/useActiveCity';
import { submitGem } from '../../lib/data/gems';
import { Flag } from '../../components/Flag';

// v1: gem coordinates = city center (auto-location model).
// Per-gem pin placement from device GPS can be added in a future iteration.

export default function ShareGem() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const { cityId } = useCity();
  const { city } = useActiveCity(cityId);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = !!photoUri && name.trim().length >= 3;

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (res.canceled) return;
    setPhotoUri(res.assets[0].uri);
  }

  async function handleSubmit() {
    if (!canSubmit || busy || !session?.user || !city) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      const blob = await (await fetch(photoUri!)).blob();
      const fileName = photoUri!.split('/').pop() ?? `${Date.now()}.jpg`;
      await submitGem(session.user.id, {
        name: name.trim(),
        note: note.trim() || null,
        cityId,
        lat: city.lat,
        lng: city.lng,
        blob,
        fileName,
      });
      setSubmitted(true);
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: t.spacing.s6 }}>
        <Text style={[t.type.h3, { color: t.colors.amber, marginBottom: t.spacing.s3, textAlign: 'center' }]}>
          Submitted for review
        </Text>
        <Text style={[t.type.caption, { color: t.colors.text2, textAlign: 'center', marginBottom: t.spacing.s5 }]}>
          Automated checks run first; a moderator review follows (usually ~24h).
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: t.colors.info, borderRadius: t.radii.sm, paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s5 }}
        >
          <Text style={[t.type.body, { color: '#fff' }]}>Done</Text>
        </Pressable>
      </View>
      </Screen>
    );
  }

  return (
    <Screen>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: t.spacing.s4 }}>
      {/* Auto location chip */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, marginBottom: t.spacing.s4 }}>
        {city ? <Flag code={city.country_code} size={18} radius={2} /> : null}
        <Text style={[t.type.caption, { color: t.colors.text2 }]}>{city?.name ?? ''}</Text>
      </View>

      {/* Photo box */}
      <Pressable
        testID="photo-box"
        onPress={pickPhoto}
        style={{
          height: 200,
          borderRadius: t.radii.sm,
          borderWidth: 1,
          borderColor: t.colors.borderDefault,
          borderStyle: 'dashed',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: t.spacing.s4,
          overflow: 'hidden',
        }}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Text style={[t.type.caption, { color: t.colors.text3 }]}>+ Add a photo</Text>
        )}
      </Pressable>

      {/* Name */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name this gem"
        placeholderTextColor={t.colors.text3}
        style={[
          t.type.body,
          {
            color: t.colors.text1,
            backgroundColor: t.colors.surface1,
            borderRadius: t.radii.sm,
            borderWidth: 1,
            borderColor: t.colors.borderSubtle,
            padding: t.spacing.s3,
            marginBottom: t.spacing.s3,
          },
        ]}
      />

      {/* Note */}
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Why is it special?"
        placeholderTextColor={t.colors.text3}
        multiline
        numberOfLines={3}
        style={[
          t.type.body,
          {
            color: t.colors.text1,
            backgroundColor: t.colors.surface1,
            borderRadius: t.radii.sm,
            borderWidth: 1,
            borderColor: t.colors.borderSubtle,
            padding: t.spacing.s3,
            marginBottom: t.spacing.s4,
            textAlignVertical: 'top',
          },
        ]}
      />

      {/* Guidelines card */}
      <View
        style={{
          backgroundColor: t.colors.infoBg,
          borderRadius: t.radii.sm,
          padding: t.spacing.s4,
          marginBottom: t.spacing.s4,
        }}
      >
        <Text style={[t.type.caption, { color: t.colors.info, fontWeight: '600', marginBottom: t.spacing.s2 }]}>
          Reviewed before it appears
        </Text>
        {[
          'No private property or exact home addresses',
          'No unsafe or restricted areas',
          'No ads or self-promotion',
          'Keep it travel-relevant',
        ].map((line, i) => (
          <Text key={i} style={[t.type.caption, { color: t.colors.text2, marginBottom: 2 }]}>
            {`· ${line}`}
          </Text>
        ))}
      </View>

      {/* Error */}
      {errorMsg ? (
        <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{errorMsg}</Text>
      ) : null}

      {/* Submit */}
      <Pressable
        testID="submit-gem"
        onPress={handleSubmit}
        disabled={!canSubmit || busy}
        style={{
          backgroundColor: canSubmit ? t.colors.amber : t.colors.surface2,
          borderRadius: t.radii.sm,
          paddingVertical: t.spacing.s3,
          alignItems: 'center',
        }}
      >
        <Text style={[t.type.body, { color: canSubmit ? '#000' : t.colors.textDisabled }]}>
          {busy ? 'Submitting…' : 'Share this gem'}
        </Text>
      </Pressable>
    </ScrollView>
    </Screen>
  );
}
