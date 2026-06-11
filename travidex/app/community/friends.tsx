import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { Screen } from '../../components/Screen';
import { relativeTime } from '../../lib/relativeTime';
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

  // Main search — filters existing friends only
  const [query, setQuery] = useState('');

  // Add-friend panel
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState<ProfileHit[]>([]);

  function loadFriends() {
    if (!uid) { setLoading(false); return; }
    getFriendsOverview(uid)
      .then(setFriends)
      .catch((e: any) => console.warn(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadFriends(); }, [uid]);

  // Add-panel search
  useEffect(() => {
    if (addQuery.length < 2) { setAddResults([]); return; }
    const friendIds = new Set(friends.map(f => f.friend_id));
    searchProfiles(addQuery, uid)
      .then(hits => setAddResults(hits.filter(h => !friendIds.has(h.user_id))))
      .catch((e: any) => console.warn(e));
  }, [addQuery, friends, uid]);

  async function handleAdd(userId: string) {
    try {
      await addFriend(uid, userId);
      setAddQuery('');
      setAddResults([]);
      setAddPanelOpen(false);
      loadFriends();
    } catch (e: any) {
      console.warn(e);
    }
  }

  const filteredFriends = query.length > 0
    ? friends.filter(f => f.username.toLowerCase().includes(query.toLowerCase()))
    : friends;

  function lastFindLine(item: FriendOverview): string {
    if (!item.last_find) return 'No finds yet';
    if (!item.last_find_at) return item.last_find.toUpperCase();
    return `${item.last_find.toUpperCase()} · ${relativeTime(item.last_find_at)}`;
  }

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
        <Text style={[t.type.h3, { color: t.colors.text1, flex: 1, textAlign: 'center' }]}>Friends</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={filteredFriends}
        keyExtractor={f => f.friend_id}
        ListHeaderComponent={
          <>
            {/* Main search — filters existing friends only */}
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
                gap: t.spacing.s2,
              }}
            >
              <Ionicons name="search" size={16} color={t.colors.text3} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search friends"
                placeholderTextColor={t.colors.text3}
                style={[t.type.body, { flex: 1, color: t.colors.text1 }]}
              />
            </View>

            {/* Add a friend row */}
            <Pressable
              testID="add-friend-row"
              onPress={() => setAddPanelOpen(open => !open)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: t.spacing.s4,
                marginBottom: t.spacing.s3,
                padding: t.spacing.s4,
                backgroundColor: t.colors.surface1,
                borderRadius: t.radii.lg,
                borderWidth: 1,
                borderColor: t.colors.greenLine,
                gap: t.spacing.s3,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: t.colors.greenDim,
                  borderWidth: 1,
                  borderColor: t.colors.greenLine,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person-add-outline" size={17} color={t.colors.green} />
              </View>
              <Text style={[t.type.body, { color: t.colors.text1, flex: 1, fontFamily: t.fontFamily.sansSemibold }]}>
                Add a friend
              </Text>
              <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
            </Pressable>

            {/* Inline add panel (toggled) */}
            {addPanelOpen && (
              <View
                style={{
                  marginHorizontal: t.spacing.s4,
                  marginBottom: t.spacing.s3,
                  padding: t.spacing.s3,
                  backgroundColor: t.colors.surface2,
                  borderRadius: t.radii.lg,
                  borderWidth: 1,
                  borderColor: t.colors.greenLine,
                  gap: t.spacing.s2,
                }}
              >
                {/* Search people field */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: t.spacing.s3,
                    height: 42,
                    backgroundColor: t.colors.surface1,
                    borderRadius: t.radii.md,
                    borderWidth: 1,
                    borderColor: t.colors.borderSubtle,
                    gap: t.spacing.s2,
                  }}
                >
                  <Ionicons name="search" size={15} color={t.colors.text3} />
                  <TextInput
                    testID="add-search-input"
                    value={addQuery}
                    onChangeText={setAddQuery}
                    placeholder="Search people"
                    placeholderTextColor={t.colors.text3}
                    style={[t.type.body, { flex: 1, color: t.colors.text1 }]}
                  />
                </View>

                {/* Search results */}
                {addResults.map(r => (
                  <Pressable
                    key={r.user_id}
                    testID={`add-${r.user_id}`}
                    onPress={() => handleAdd(r.user_id)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: t.spacing.s2,
                      paddingHorizontal: t.spacing.s3,
                      backgroundColor: t.colors.surface1,
                      borderRadius: t.radii.md,
                      borderWidth: 1,
                      borderColor: t.colors.greenLine,
                      gap: t.spacing.s3,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>
                      {r.username}
                    </Text>
                    <Text style={[t.type.caption, { color: t.colors.green }]}>Add</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* N FRIENDS section label */}
            {filteredFriends.length > 0 ? (
              <Text
                style={[
                  t.type.caption,
                  {
                    color: t.colors.text3,
                    fontFamily: t.fontFamily.monoRegular,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginHorizontal: t.spacing.s5,
                    marginBottom: t.spacing.s2,
                    marginTop: t.spacing.s1,
                    fontSize: 10,
                  },
                ]}
              >
                {filteredFriends.length} FRIENDS
              </Text>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>
              No friends yet — add one to compare dexes.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            testID={`friend-${item.friend_id}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s3,
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
                flexShrink: 0,
              }}
            >
              <Text style={[t.type.body, { color: t.colors.text2, fontFamily: t.fontFamily.sansSemibold }]}>
                {item.username.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>

            {/* Username + @handle + last find line */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={[t.type.body, { color: t.colors.text1 }]}
                numberOfLines={1}
              >
                <Text style={{ fontFamily: t.fontFamily.sansSemibold }}>{item.username}</Text>
                {'  '}
                <Text style={{ color: t.colors.text3, fontSize: 13 }}>@{item.username}</Text>
              </Text>
              <Text
                style={[
                  t.type.caption,
                  {
                    color: t.colors.text3,
                    fontFamily: t.fontFamily.monoRegular,
                    letterSpacing: 0.5,
                    marginTop: 2,
                    fontSize: 10,
                  },
                ]}
                numberOfLines={1}
              >
                {lastFindLine(item)}
              </Text>
            </View>

            {/* Green mono sights count */}
            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Text style={[t.type.body, { color: t.colors.green, fontFamily: t.fontFamily.monoBold, fontSize: 13 }]}>
                {item.sights_count}
              </Text>
              <Text
                style={[
                  t.type.caption,
                  {
                    color: t.colors.text3,
                    fontFamily: t.fontFamily.monoRegular,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: 9,
                    marginTop: 2,
                  },
                ]}
              >
                sights
              </Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
