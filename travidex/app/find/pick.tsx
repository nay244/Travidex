import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';
import { LogFindSheet } from '../../components/LogFindSheet';

export default function Pick() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { sights } = useCityCatalog(cityId);
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.bg, justifyContent: 'center', padding: t.spacing.s5 }}>
        <LogFindSheet sightId={selected} onLogged={() => router.push('/find/success')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <FlatList
        data={sights}
        keyExtractor={s => s.id}
        renderItem={({ item }) => <SightRow sight={item} onPress={setSelected} />}
      />
    </View>
  );
}
