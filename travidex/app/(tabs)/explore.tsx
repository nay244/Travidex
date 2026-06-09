import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCountries } from '../../lib/data/countries';
import { getCountryProgress, Progress } from '../../lib/data/progress';
import type { Country } from '../../lib/types';

export default function Explore() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map());

  useEffect(() => {
    (async () => {
      const [list, prog] = await Promise.all([
        getCountries(),
        session?.user ? getCountryProgress(session.user.id) : Promise.resolve(new Map<string, Progress>()),
      ]);
      setCountries(list);
      setProgress(prog);
    })();
  }, [session?.user?.id]);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: t.colors.bg }}
      data={countries}
      keyExtractor={c => c.id}
      renderItem={({ item }) => {
        const p = progress.get(item.id) ?? { found: 0, total: 0 };
        return (
          <Pressable
            onPress={() => router.push(`/country/${item.id}`)}
            style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}
          >
            <Text style={[t.type.h3, { color: t.colors.text1 }]}>{item.name}</Text>
            <Text style={[t.type.caption, { color: t.colors.text2 }]}>{`${p.found} / ${p.total} sights`}</Text>
          </Pressable>
        );
      }}
    />
  );
}
