import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';

export default function Verify() {
  const t = useTheme();
  return (
    <Screen>
    <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s7 }}>
      <Text style={[t.type.h1, { color: t.colors.text1, marginBottom: t.spacing.s4 }]}>Check your inbox</Text>
      <Text style={[t.type.body, { color: t.colors.text2 }]}>
        We sent you a confirmation link. Tap it to verify your email, then return here to finish setting up your profile.
      </Text>
    </View>
    </Screen>
  );
}
