import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { getFeed, FeedItem } from '../../lib/data/feed';

export default function Community() {
  const t = useTheme();
  const router = useRouter();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getFeed()
      .then(setFeed)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View style={{ flexDirection: 'row', gap: t.spacing.s3, padding: t.spacing.s4 }}>
        <Pressable
          onPress={() => router.push('/community/submit')}
          style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}
        >
          <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Submit a sight</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/community/mine')}
          style={{ backgroundColor: t.colors.surface2, padding: t.spacing.s4, borderRadius: t.radii.sm }}
        >
          <Text style={[t.type.body, { color: t.colors.text2 }]}>My submissions</Text>
        </Pressable>
      </View>
      <FlatList
        data={feed}
        keyExtractor={f => f.id}
        ListHeaderComponent={
          error ? (
            <Text style={[t.type.caption, { color: t.colors.danger, paddingHorizontal: t.spacing.s5 }]}>
              {error}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          loaded && !error ? (
            <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>No finds yet</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
            <Text style={[t.type.body, { color: t.colors.text1 }]}>
              {`${item.username ?? 'Someone'} found ${item.sight_name}`}
            </Text>
            {item.comment && (
              <Text style={[t.type.caption, { color: t.colors.text2 }]}>{item.comment}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
