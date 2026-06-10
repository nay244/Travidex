import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getFeed, FeedItem } from '../../lib/data/feed';
import { getFriendsOverview } from '../../lib/data/friends';
import { relativeTime } from '../../lib/relativeTime';
import { GemsTab } from '../../components/GemsTab';

type Tab = 'friends' | 'gems';

export default function Community() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setLoaded(true);
      return;
    }
    getFeed(userId)
      .then(setFeed)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoaded(true));
    getFriendsOverview(userId)
      .then(f => setFriendsCount(f.length))
      .catch((e: any) => console.warn(e));
  }, [session?.user?.id]);

  const tabStyle = (tab: Tab) => ({
    flex: 1,
    paddingVertical: t.spacing.s3,
    alignItems: 'center' as const,
    borderRadius: t.radii.sm,
    backgroundColor: activeTab === tab ? t.colors.amberDim : t.colors.surface2,
    borderWidth: 1,
    borderColor: activeTab === tab ? t.colors.amberLine : 'transparent',
  });

  const tabTextStyle = (tab: Tab) => [
    t.type.body,
    { color: activeTab === tab ? t.colors.amber : t.colors.text3 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Segmented control */}
      <View style={{ flexDirection: 'row', gap: t.spacing.s2, padding: t.spacing.s4 }}>
        <Pressable
          testID="tab-friends"
          onPress={() => setActiveTab('friends')}
          style={tabStyle('friends')}
        >
          <Text style={tabTextStyle('friends')}>Friends</Text>
        </Pressable>
        <Pressable
          testID="tab-gems"
          onPress={() => setActiveTab('gems')}
          style={tabStyle('gems')}
        >
          <Text style={tabTextStyle('gems')}>Hidden gems</Text>
        </Pressable>
      </View>

      {activeTab === 'friends' ? (
        <FlatList
          data={feed}
          keyExtractor={f => f.id}
          ListHeaderComponent={
            <>
              {/* Your friends row */}
              <Pressable
                testID="your-friends-row"
                onPress={() => router.push('/community/friends')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: t.spacing.s4,
                  marginHorizontal: t.spacing.s4,
                  marginBottom: t.spacing.s3,
                  backgroundColor: t.colors.surface1,
                  borderRadius: t.radii.lg,
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                }}
              >
                <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>Your friends</Text>
                <Text style={[t.type.caption, { color: t.colors.text3, fontFamily: t.fontFamily.monoRegular }]}>
                  {friendsCount}
                </Text>
                <Text style={[t.type.body, { color: t.colors.text3, marginLeft: t.spacing.s2 }]}>›</Text>
              </Pressable>
              {error ? (
                <Text style={[t.type.caption, { color: t.colors.danger, paddingHorizontal: t.spacing.s5 }]}>
                  {error}
                </Text>
              ) : null}
            </>
          }
          ListEmptyComponent={
            loaded && !error ? (
              <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>No finds yet</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
              <Text style={[t.type.body, { color: t.colors.text1 }]}>
                {`${item.username ?? 'Someone'} found ${item.sight_name}${item.city_name ? ` in ${item.city_name}` : ''}`}
              </Text>
              <Text style={[t.type.caption, { color: t.colors.text3 }]}>{relativeTime(item.found_at)}</Text>
              {item.comment && (
                <Text style={[t.type.caption, { color: t.colors.text2 }]}>{item.comment}</Text>
              )}
            </View>
          )}
        />
      ) : (
        <View testID="gems-tab" style={{ flex: 1 }}>
          <GemsTab />
        </View>
      )}
    </View>
  );
}
