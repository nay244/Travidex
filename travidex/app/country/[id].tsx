import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getCitiesForCountry } from '../../lib/data/citiesByCountry';
import { getCityProgress, Progress } from '../../lib/data/progress';
import { ChunkTile } from '../../components/ChunkTile';
import type { City } from '../../lib/types';

export default function Country() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map());

  useEffect(() => {
    (async () => {
      const [list, prog] = await Promise.all([
        getCitiesForCountry(id!),
        session?.user ? getCityProgress(session.user.id) : Promise.resolve(new Map<string, Progress>()),
      ]);
      setCities(list);
      setProgress(prog);
    })();
  }, [id, session?.user?.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', padding: t.spacing.s3 }}>
      {cities.map(c => {
        const p = progress.get(c.id) ?? { found: 0, total: 0 };
        return <ChunkTile key={c.id} name={c.name} found={p.found} total={p.total} onPress={() => router.push(`/city/${c.id}`)} />;
      })}
    </ScrollView>
  );
}
