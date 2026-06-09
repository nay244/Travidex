import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';

export default function Success() {
  const t = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, alignItems: 'center', justifyContent: 'center', gap: t.spacing.s4 }}>
      <Text style={[t.type.h1, { color: t.colors.green }]}>Added to your dex!</Text>
      <Pressable onPress={() => router.replace('/(tabs)/map')} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Done</Text>
      </Pressable>
    </View>
  );
}
