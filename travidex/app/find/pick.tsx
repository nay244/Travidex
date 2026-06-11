import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useCity } from '../../context/CityProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { SightRow } from '../../components/SightRow';
import { LogFindSheet } from '../../components/LogFindSheet';
import type { SightWithFind } from '../../lib/types';

export default function Pick() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useCity();
  const { sights } = useCityCatalog(cityId);
  const [selected, setSelected] = useState<SightWithFind | null>(null);

  function handlePress(item: SightWithFind) {
    if (item.found) {
      router.push({ pathname: '/find/success', params: { sightId: item.id, already: '1' } });
    } else {
      setSelected(item);
    }
  }

  if (selected) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', padding: t.spacing.s5 }}>
          <LogFindSheet
            sightId={selected.id}
            onLogged={() => router.push({ pathname: '/find/success', params: { sightId: selected.id } })}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={sights}
        keyExtractor={s => s.id}
        renderItem={({ item }) => <SightRow sight={item} onPress={() => handlePress(item)} />}
      />
    </Screen>
  );
}
