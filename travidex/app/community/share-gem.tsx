import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { Medallion } from '../../components/Medallion';
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
        <Medallion icon="time-outline" tone="amber" earned size={72} />
        <Text style={[t.type.h3, { color: t.colors.text1, marginTop: t.spacing.s4, marginBottom: t.spacing.s2, textAlign: 'center' }]}>
          Submitted for review
        </Text>
        <Text style={[t.type.caption, { color: t.colors.text2, textAlign: 'center', marginBottom: t.spacing.s5 }]}>
          Automated checks passed — a moderator will review it, usually within 24 hours.
        </Text>
        <Pressable
          testID="done-btn"
          onPress={() => router.back()}
          style={{ backgroundColor: t.colors.actionPositive, borderRadius: t.radii.pill, paddingVertical: t.spacing.s3, paddingHorizontal: t.spacing.s5 }}
        >
          <Text style={[t.type.body, { color: t.colors.textOnAccent }]}>Done</Text>
        </Pressable>
      </View>
      </Screen>
    );
  }

  return (
    <Screen>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: 52,
      paddingHorizontal: t.spacing.s4,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.borderSubtle,
    }}>
      <Pressable
        testID="back-btn"
        onPress={() => router.back()}
        hitSlop={8}
        style={({ pressed }) => ({
          width: 40, height: 40, borderRadius: 20,
          alignItems: 'center', justifyContent: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
      </Pressable>
      <Text style={[t.type.h2, { flex: 1, textAlign: 'center', color: t.colors.text1 }]}>
        Share a hidden gem
      </Text>
      <View style={{ width: 40 }} />
    </View>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: t.spacing.s4 }}>

      {/* Photo box */}
      <Pressable
        testID="photo-box"
        onPress={pickPhoto}
        style={{
          height: 200,
          borderRadius: t.radii.lg,
          borderWidth: 1.5,
          borderColor: t.colors.borderStrong,
          borderStyle: 'dashed',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: t.spacing.s4,
          overflow: 'hidden',
          gap: t.spacing.s2,
        }}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <>
            <Ionicons name="camera-outline" size={22} color={t.colors.text3} />
            <Text style={[t.type.body, { color: t.colors.text2, fontFamily: t.fontFamily.sansSemibold }]}>
              Add a photo of the spot
            </Text>
            <Text
              style={[
                t.type.caption,
                {
                  color: t.colors.amber,
                  fontFamily: t.fontFamily.monoRegular,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  fontSize: 10,
                },
              ]}
            >
              REQUIRED
            </Text>
          </>
        )}
      </Pressable>

      {/* Name */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name the spot"
        placeholderTextColor={t.colors.text3}
        style={[
          t.type.body,
          {
            color: t.colors.text1,
            backgroundColor: t.colors.surface2,
            borderRadius: t.radii.md,
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
        placeholder="Why is it special? What should travelers look for?"
        placeholderTextColor={t.colors.text3}
        multiline
        numberOfLines={3}
        style={[
          t.type.body,
          {
            color: t.colors.text1,
            backgroundColor: t.colors.surface2,
            borderRadius: t.radii.md,
            borderWidth: 1,
            borderColor: t.colors.borderSubtle,
            padding: t.spacing.s3,
            marginBottom: t.spacing.s3,
            textAlignVertical: 'top',
          },
        ]}
      />

      {/* Auto location chip */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacing.s2,
          padding: t.spacing.s3,
          marginBottom: t.spacing.s4,
          backgroundColor: t.colors.surface2,
          borderRadius: t.radii.md,
          borderWidth: 1,
          borderColor: t.colors.borderSubtle,
        }}
      >
        {city ? <Flag code={city.country_code} size={18} radius={2} /> : null}
        <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>{city?.name ?? ''}</Text>
        <Text
          style={[
            t.type.caption,
            {
              color: t.colors.text3,
              fontFamily: t.fontFamily.monoRegular,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: 9,
            },
          ]}
        >
          AUTO · FROM MAP
        </Text>
      </View>

      {/* Guidelines card */}
      <View
        style={{
          backgroundColor: t.colors.infoBg,
          borderRadius: t.radii.lg,
          borderWidth: 1,
          borderColor: t.colors.blueLine,
          padding: t.spacing.s4,
          marginBottom: t.spacing.s4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2, marginBottom: t.spacing.s2 }}>
          <Ionicons name="shield-checkmark-outline" size={15} color={t.colors.info} />
          <Text
            style={[
              t.type.caption,
              {
                color: t.colors.info,
                fontFamily: t.fontFamily.monoBold,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: 10,
              },
            ]}
          >
            Reviewed before it appears
          </Text>
        </View>
        <Text style={[t.type.caption, { color: t.colors.text2, lineHeight: 18 }]}>
          No private property or exact home addresses, unsafe or restricted areas, ads, or off-topic content. Submissions run automated checks, then a moderator approves them.
        </Text>
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
          backgroundColor: canSubmit ? t.colors.actionPositive : t.colors.surface2,
          borderRadius: t.radii.pill,
          paddingVertical: t.spacing.s3,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: t.spacing.s2,
        }}
      >
        <Ionicons
          name="send-outline"
          size={16}
          color={canSubmit ? t.colors.textOnAccent : t.colors.textDisabled}
        />
        <Text style={[t.type.body, { color: canSubmit ? t.colors.textOnAccent : t.colors.textDisabled }]}>
          {busy ? 'Submitting…' : 'Submit for review'}
        </Text>
      </Pressable>
    </ScrollView>
    </Screen>
  );
}
