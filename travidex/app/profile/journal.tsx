import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getUserPhotos, UserPhoto } from '../../lib/data/photos';
import { Screen } from '../../components/Screen';

export default function Journal() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    if (session?.user) getUserPhotos(session.user.id).then(setPhotos).catch(err => console.warn('getUserPhotos failed', err));
  }, [session?.user?.id]);

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
          Journal
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <Text style={[t.type.caption, { color: t.colors.text2, padding: t.spacing.s5 }]}>{`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}</Text>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <Image source={{ uri: item.photo_url }} style={{ width: '33%', aspectRatio: 1, margin: 1 }} />}
      />
    </Screen>
  );
}
