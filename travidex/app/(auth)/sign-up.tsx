import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { signUpWithEmail } from '../../lib/auth';
import { isValidEmail, validatePassword, passwordsMatch } from '../../lib/validation';

export default function SignUp() {
  const t = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!isValidEmail(email)) return setError('Enter a valid email');
    const pwError = validatePassword(pw);
    if (pwError) return setError(pwError);
    if (!passwordsMatch(pw, confirm)) return setError('Passwords do not match');
    setError(null);
    setBusy(true);
    try {
      await signUpWithEmail(email, pw);
      router.push('/(auth)/verify');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Sign up</Text>
      <TextInput placeholder="Email" placeholderTextColor={t.colors.text3} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={input} />
      <TextInput placeholder="Password" placeholderTextColor={t.colors.text3} secureTextEntry value={pw} onChangeText={setPw} style={input} />
      <TextInput placeholder="Confirm password" placeholderTextColor={t.colors.text3} secureTextEntry value={confirm} onChangeText={setConfirm} style={input} />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Create account</Text>
      </Pressable>
    </View>
  );
}
