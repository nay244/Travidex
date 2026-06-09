import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme';
import { useAuth } from '../context/AuthProvider';
import { getUserPhotos, uploadUserPhoto, UserPhoto } from '../lib/data/photos';

export function YourPhotos({ sightId }: { sightId: string }) {
  const t = useTheme();
  const { session } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const refresh = useCallback(async () => {
    if (session?.user) setPhotos((await getUserPhotos(session.user.id)).filter(p => p.sight_id === sightId));
  }, [session?.user?.id, sightId]);

  useEffect(() => { refresh(); }, [refresh]);

  async function add() {
    if (!session?.user) return;
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
      if (res.canceled) return;
      const asset = res.assets[0];
      const blob = await (await fetch(asset.uri)).blob();
      await uploadUserPhoto(session.user.id, sightId, blob, asset.fileName ?? `${Date.now()}.jpg`);
      await refresh();
    } catch (err) {
      console.warn('upload failed', err);
    }
  }

  return (
    <View>
      <Text style={[t.type.label, { color: t.colors.text3, marginBottom: t.spacing.s2 }]}>Your photos</Text>
      <ScrollView horizontal>
        {photos.map(p => <Image key={p.id} source={{ uri: p.photo_url }} style={{ width: 64, height: 64, borderRadius: t.radii.xs, marginRight: t.spacing.s2 }} />)}
        <Pressable onPress={add} style={{ width: 64, height: 64, borderRadius: t.radii.xs, backgroundColor: t.colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[t.type.caption, { color: t.colors.text3 }]}>+ Add photo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
