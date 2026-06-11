import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useProfile } from '../../hooks/useProfile';
import { Screen } from '../../components/Screen';

export default function Profile() {
  const t = useTheme();
  const router = useRouter();
  const { stats } = useProfile();

  const Stat = ({ value, label }: { value: number; label: string }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{value}</Text>
      <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
    </View>
  );
  const Link = ({ label, to }: { label: string; to: string }) => (
    <Pressable onPress={() => router.push(to as any)} style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
      <Text style={[t.type.body, { color: t.colors.text1 }]}>{label}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: t.spacing.s7 }}>
        <Stat value={stats.totalFinds} label="Sights found" />
        <Stat value={stats.citiesClaimed} label="Cities claimed" />
        <Stat value={stats.countriesExplored} label="Countries" />
      </View>
      <Link label="Badges" to="/profile/badges" />
      <Link label="Photo journal" to="/profile/journal" />
      <Link label="Settings" to="/profile/settings" />
      </ScrollView>
    </Screen>
  );
}
