import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';

export default function City() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCityId } = useCity();
  const { sights, completion } = useCityCatalog(id!);

  function openMap() {
    setCityId(id!);
    router.replace('/(tabs)/map');
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
        <Text style={[t.type.h3, { color: t.colors.text1 }]}>{`${completion.found} of ${completion.total} found`}</Text>
        <Pressable onPress={openMap} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
          <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Open map</Text>
        </Pressable>
      </View>
      <FlatList data={sights} keyExtractor={s => s.id} renderItem={({ item }) => <SightRow sight={item} onPress={() => router.push(`/sight/${item.id}`)} />} />
    </View>
  );
}
