import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getFeed, FeedItem } from '../../lib/data/feed';
import { getFriendsOverview, FriendOverview } from '../../lib/data/friends';
import { relativeTime } from '../../lib/relativeTime';
import { GemsTab } from '../../components/GemsTab';
import { Screen } from '../../components/Screen';
import { SegmentedControl } from '../../components/SegmentedControl';

const TAB_OPTIONS = [
  { key: 'friends', label: 'Friends', testID: 'tab-friends' },
  { key: 'gems',    label: 'Hidden gems', testID: 'tab-gems' },
] as const;

type Tab = 'friends' | 'gems';

export default function Community() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [friendsList, setFriendsList] = useState<FriendOverview[]>([]);
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
      .then(setFriendsList)
      .catch((e: any) => console.warn(e));
  }, [session?.user?.id]);

  const friendsCount = friendsList.length;

  return (
    <Screen>
      {/* Screen title */}
      <Text
        style={[
          t.type.h1,
          { color: t.colors.text1, paddingHorizontal: t.spacing.s5, paddingTop: t.spacing.s4, paddingBottom: t.spacing.s3 },
        ]}
      >
        Community
      </Text>

      {/* Segmented control */}
      <View style={{ paddingHorizontal: t.spacing.s4, paddingBottom: t.spacing.s2 }}>
        <SegmentedControl
          options={TAB_OPTIONS}
          value={activeTab}
          onChange={key => setActiveTab(key as Tab)}
        />
      </View>

      {activeTab === 'friends' ? (
        <FlatList
          data={feed}
          keyExtractor={f => f.id}
          ListHeaderComponent={
            <>
              {/* Your friends card */}
              <Pressable
                testID="your-friends-row"
                onPress={() => router.push('/community/friends')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: t.spacing.s3,
                  padding: t.spacing.s4,
                  marginHorizontal: t.spacing.s4,
                  marginTop: t.spacing.s4,
                  marginBottom: t.spacing.s3,
                  backgroundColor: t.colors.surface1,
                  borderRadius: t.radii.lg,
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                }}
              >
                {/* Stacked initials cluster */}
                <View style={{ flexDirection: 'row' }}>
                  {friendsList.slice(0, 3).map((f, i) => (
                    <View
                      key={f.friend_id}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: t.colors.surface3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: i === 0 ? 0 : -8,
                        borderWidth: 2,
                        borderColor: t.colors.surface1,
                      }}
                    >
                      <Text
                        style={[
                          t.type.caption,
                          { color: t.colors.text2, fontFamily: t.fontFamily.sansSemibold, fontSize: 12 },
                        ]}
                      >
                        {f.username[0]?.toUpperCase() ?? '?'}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={[t.type.body, { color: t.colors.text1, flex: 1, fontFamily: t.fontFamily.sansSemibold }]}>
                  Your friends
                </Text>
                <Text
                  style={[
                    t.type.caption,
                    { color: t.colors.text3, fontFamily: t.fontFamily.monoBold },
                  ]}
                >
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
            <View
              style={{
                flexDirection: 'row',
                gap: t.spacing.s3,
                padding: t.spacing.s3,
                marginHorizontal: t.spacing.s4,
                marginBottom: t.spacing.s3,
                backgroundColor: t.colors.surface1,
                borderRadius: t.radii.lg,
                borderWidth: 1,
                borderColor: t.colors.borderSubtle,
              }}
            >
              {/* Avatar disc */}
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: t.colors.surface3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text
                  style={[
                    t.type.caption,
                    { color: t.colors.text2, fontFamily: t.fontFamily.sansSemibold, fontSize: 13 },
                  ]}
                >
                  {(item.username ?? 'S')[0]?.toUpperCase()}
                </Text>
              </View>

              {/* Content */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[t.type.body, { color: t.colors.text2, lineHeight: 20 }]}>
                  <Text style={{ color: t.colors.text1, fontFamily: t.fontFamily.sansSemibold }}>
                    {item.username ?? 'Someone'}
                  </Text>
                  {' found '}
                  <Text style={{ color: t.colors.green, fontFamily: t.fontFamily.sansSemibold }}>
                    {item.sight_name}
                  </Text>
                  {item.city_name ? (
                    <Text style={{ color: t.colors.text3 }}>{` in ${item.city_name}`}</Text>
                  ) : null}
                </Text>
                <Text
                  style={[
                    t.type.caption,
                    {
                      color: t.colors.text3,
                      fontFamily: t.fontFamily.monoRegular,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginTop: 2,
                    },
                  ]}
                >
                  {relativeTime(item.found_at)}
                </Text>
                {item.comment ? (
                  <Text style={[t.type.caption, { color: t.colors.text2, marginTop: t.spacing.s1 }]}>
                    {item.comment}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        />
      ) : (
        <View testID="gems-tab" style={{ flex: 1 }}>
          <GemsTab />
        </View>
      )}
    </Screen>
  );
}
