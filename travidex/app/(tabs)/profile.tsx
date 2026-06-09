import { Text, View } from 'react-native';
import { useTheme } from '@/theme';
export default function Screen() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.bg }}>
      <Text style={[t.type.h2, { color: t.colors.text1 }]}>Profile</Text>
    </View>
  );
}
