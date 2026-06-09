import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { sendPasswordReset } from '../../lib/auth';

export default function Forgot() {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const input = { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s5 }]}>Reset password</Text>
      {sent ? (
        <Text style={[t.type.body, { color: t.colors.text2 }]}>Check your inbox for a reset link.</Text>
      ) : (
        <>
          <TextInput placeholder="Email" placeholderTextColor={t.colors.text3} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={input} />
          {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
          <Pressable onPress={submit} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
            <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Send reset link</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
