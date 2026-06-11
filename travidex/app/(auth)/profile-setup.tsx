import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { isUsernameAvailable, createProfile } from '../../lib/profiles';
import { useAuth } from '../../context/AuthProvider';
import { Screen } from '../../components/Screen';

export default function ProfileSetup() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!session?.user) return;
    setBusy(true);
    setError(null);
    try {
      const free = await isUsernameAvailable(username);
      if (!free) {
        setError('That username is taken');
        return;
      }
      await createProfile(session.user.id, username, null);
      router.replace('/(tabs)/map');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <Screen>
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7 }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Pick a username</Text>
      <TextInput placeholder="Username" placeholderTextColor={t.colors.text3} autoCapitalize="none" value={username} onChangeText={setUsername} style={input} />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Continue</Text>
      </Pressable>
    </View>
    </Screen>
  );
}
