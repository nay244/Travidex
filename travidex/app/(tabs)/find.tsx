import { Pressable, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';

export default function Find() {
  const t = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.s4 }}>
          <Text style={[t.type.body, { color: t.colors.text2 }]}>Travidex needs your camera to log finds.</Text>
          <Pressable onPress={requestPermission} style={{ backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
            <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Enable camera</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/find/pick')}>
            <Text style={[t.type.body, { color: t.colors.text3 }]}>{'Skip & pick a sight'}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // Camera chrome is intentionally fixed black viewfinder + white shutter (not themed).
  // Screen's bg shows only at the notch; the camera view fills the rest with #000.
  return (
    <Screen>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView style={{ flex: 1 }} />
        <Pressable onPress={() => router.push('/find/pick')} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', width: 70, height: 70, borderRadius: 35 }} />
      </View>
    </Screen>
  );
}
