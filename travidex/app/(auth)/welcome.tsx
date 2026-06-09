import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { signInWithApple } from '../../lib/auth';

export default function Welcome() {
  const t = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: t.spacing.s7, gap: t.spacing.s4, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.display, { color: t.colors.text1 }]}>Travidex</Text>
      <Text style={[t.type.body, { color: t.colors.text2, marginBottom: t.spacing.s5 }]}>Find the world, one sight at a time.</Text>

      {/* Apple button: text1-on-bg adapts (black on light, white on dark) per Apple's HIG */}
      <Pressable onPress={() => signInWithApple()} style={{ backgroundColor: t.colors.text1, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.bg }]}>Sign in with Apple</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/sign-up')} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s5, borderRadius: t.radii.md }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Continue with Email</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(auth)/login')} style={{ padding: t.spacing.s4 }}>
        <Text style={[t.type.body, { textAlign: 'center', color: t.colors.text2 }]}>Log in</Text>
      </Pressable>
    </View>
  );
}
