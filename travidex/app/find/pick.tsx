import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        paddingHorizontal: t.spacing.s4,
        borderBottomWidth: 1,
        borderBottomColor: t.colors.borderSubtle,
      }}>
        <Pressable
          testID="back-btn"
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
        </Pressable>
        <Text style={[t.type.h2, { flex: 1, textAlign: 'center', color: t.colors.text1 }]}>
          Log a find
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={sights}
        keyExtractor={s => s.id}
        renderItem={({ item }) => <SightRow sight={item} onPress={() => handlePress(item)} />}
      />
    </Screen>
  );
}
