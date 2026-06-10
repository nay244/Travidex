import { useState, useEffect } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { supabase } from '../../lib/supabase';
import { useEntitlement } from '../../context/EntitlementProvider';

export default function Settings() {
  const t = useTheme();
  const router = useRouter();
  const { restore } = useEntitlement();
  const [locationOn, setLocationOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => setLocationOn(status === 'granted'))
      .catch(() => {});
  }, []);

  async function toggleLocation(next: boolean) {
    if (next) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationOn(status === 'granted');
    } else {
      setLocationOn(false); // OS-level revoke happens in Settings app; we just stop using it
    }
  }

  function deleteAccount() {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account, finds, photos, and badges.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ],
    );
  }

  async function doDelete() {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) {
      setBusy(false);
      Alert.alert('Could not delete account', 'Try again later.');
      return;
    }
    await supabase.auth.signOut();
    router.replace('/(auth)/welcome');
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, padding: t.spacing.s5, gap: t.spacing.s5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[t.type.body, { color: t.colors.text1 }]}>Use location</Text>
        <Switch value={locationOn} onValueChange={toggleLocation} />
      </View>
      <Pressable onPress={() => router.push('/profile/appearance')}>
        <Text style={[t.type.body, { color: t.colors.text1 }]}>Appearance</Text>
      </Pressable>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text style={[t.type.body, { color: t.colors.info }]}>Sign out</Text>
      </Pressable>
      <Pressable onPress={() => restore()}>
        <Text style={[t.type.body, { color: t.colors.info }]}>Restore purchases</Text>
      </Pressable>
      <Pressable onPress={deleteAccount} disabled={busy}>
        <Text style={[t.type.body, { color: t.colors.danger }]}>Delete account</Text>
      </Pressable>
    </View>
  );
}
