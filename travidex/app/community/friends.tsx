import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { Screen } from '../../components/Screen';
import {
  getFriendsOverview,
  searchProfiles,
  addFriend,
  FriendOverview,
  ProfileHit,
} from '../../lib/data/friends';

export default function FriendsScreen() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const uid = session?.user?.id ?? '';

  const [friends, setFriends] = useState<FriendOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileHit[]>([]);

  function loadFriends() {
    if (!uid) { setLoading(false); return; }
    getFriendsOverview(uid)
      .then(setFriends)
      .catch((e: any) => console.warn(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadFriends(); }, [uid]);

  useEffect(() => {
    if (query.length < 2) { setSearchResults([]); return; }
    searchProfiles(query, uid)
      .then(setSearchResults)
      .catch((e: any) => console.warn(e));
  }, [query]);

  const friendIds = new Set(friends.map(f => f.friend_id));
  const addResults = searchResults.filter(r => !friendIds.has(r.user_id));

  async function handleAdd(userId: string) {
    try {
      await addFriend(uid, userId);
      loadFriends();
    } catch (e: any) {
      console.warn(e);
    }
  }

  const filteredFriends = query.length > 0
    ? friends.filter(f => f.username.toLowerCase().includes(query.toLowerCase()))
    : friends;

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: t.spacing.s4,
          paddingVertical: t.spacing.s3,
          borderBottomWidth: 1,
          borderBottomColor: t.colors.borderSubtle,
          backgroundColor: t.colors.surfaceOverlay,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: t.spacing.s2 }}>
          <Text style={[t.type.body, { color: t.colors.text1 }]}>‹</Text>
        </Pressable>
        <Text style={[t.type.h3, { color: t.colors.text1, flex: 1, textAlign: 'center' }]}>Friends</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={filteredFriends}
        keyExtractor={f => f.friend_id}
        ListHeaderComponent={
          <>
            {/* Search input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: t.spacing.s4,
                paddingHorizontal: t.spacing.s4,
                height: 46,
                backgroundColor: t.colors.surface2,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: t.colors.borderSubtle,
              }}
            >
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search people"
                placeholderTextColor={t.colors.text3}
                style={[t.type.body, { flex: 1, color: t.colors.text1 }]}
              />
            </View>

            {/* Search results — non-friend profiles */}
            {addResults.map(r => (
              <Pressable
                key={r.user_id}
                testID={`add-${r.user_id}`}
                onPress={() => handleAdd(r.user_id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: t.spacing.s4,
                  marginBottom: t.spacing.s2,
                  padding: t.spacing.s4,
                  backgroundColor: t.colors.surface1,
                  borderRadius: t.radii.lg,
                  borderWidth: 1,
                  borderColor: t.colors.greenLine,
                }}
              >
                <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>{r.username}</Text>
                <Text style={[t.type.caption, { color: t.colors.green }]}>Add a friend</Text>
              </Pressable>
            ))}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>
              No friends yet — search to add one.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            testID={`friend-${item.friend_id}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: t.spacing.s4,
              marginBottom: t.spacing.s2,
              padding: t.spacing.s4,
              backgroundColor: t.colors.surface1,
              borderRadius: t.radii.lg,
              borderWidth: 1,
              borderColor: t.colors.borderSubtle,
            }}
          >
            {/* Initials avatar */}
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: t.colors.surface3,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: t.spacing.s3,
              }}
            >
              <Text style={[t.type.body, { color: t.colors.text2, fontFamily: t.fontFamily.monoRegular }]}>
                {item.username[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>

            {/* Username + handle */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[t.type.body, { color: t.colors.text1 }]}>{item.username}</Text>
              <Text style={[t.type.caption, { color: t.colors.text3 }]}>@{item.username}</Text>
            </View>

            {/* Last find + count */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[t.type.caption, { color: t.colors.text3 }]}>
                {item.last_find ?? 'No finds yet'}
              </Text>
              <Text style={[t.type.caption, { color: t.colors.green, fontFamily: t.fontFamily.monoRegular }]}>
                {item.sights_count}
              </Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
