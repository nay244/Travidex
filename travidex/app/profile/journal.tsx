import { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getUserPhotos, UserPhoto } from '../../lib/data/photos';

export default function Journal() {
  const t = useTheme();
  const { session } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    if (session?.user) getUserPhotos(session.user.id).then(setPhotos).catch(err => console.warn('getUserPhotos failed', err));
  }, [session?.user?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <Text style={[t.type.caption, { color: t.colors.text2, padding: t.spacing.s5 }]}>{`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}</Text>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={p => p.id}
        renderItem={({ item }) => <Image source={{ uri: item.photo_url }} style={{ width: '33%', aspectRatio: 1, margin: 1 }} />}
      />
    </View>
  );
}
