import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useThemeMode } from '@/theme';
import { useEntitlement } from '../../context/EntitlementProvider';
import { Screen } from '../../components/Screen';
import type { Scheme } from '@/theme';

export default function Appearance() {
  const t = useTheme();
  const router = useRouter();
  const { scheme, setScheme } = useThemeMode();
  const { isPremium } = useEntitlement();

  function choose(next: Scheme) {
    if (next === 'dark' && !isPremium) {
      // premium gate — copy this pattern for new Travidex+ features
      router.push('/paywall');
      return;
    }
    setScheme(next);
  }

  return (
    <Screen>
    <View style={{ flex: 1, padding: t.spacing.s7, gap: t.spacing.s5 }}>
      <Text style={[t.type.h2, { color: t.colors.text1 }]}>Appearance</Text>

      <Pressable
        testID="option-light"
        accessibilityState={{ selected: scheme === 'light' }}
        onPress={() => choose('light')}
        style={{
          padding: t.spacing.s5,
          borderRadius: 12,
          backgroundColor: scheme === 'light' ? t.colors.actionPrimary : t.colors.surface2,
        }}
      >
        <Text style={[t.type.body, { color: scheme === 'light' ? t.colors.textOnAccent : t.colors.text1 }]}>
          Light
        </Text>
      </Pressable>

      <Pressable
        testID="option-dark"
        accessibilityState={{ selected: scheme === 'dark' }}
        onPress={() => choose('dark')}
        style={{
          padding: t.spacing.s5,
          borderRadius: 12,
          backgroundColor: scheme === 'dark' ? t.colors.actionPrimary : t.colors.surface2,
        }}
      >
        <Text style={[t.type.body, { color: scheme === 'dark' ? t.colors.textOnAccent : t.colors.text1 }]}>
          {`Dark${!isPremium ? '  (Travidex+)' : ''}`}
        </Text>
      </Pressable>
    </View>
    </Screen>
  );
}
