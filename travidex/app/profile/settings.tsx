import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/theme';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const t = useTheme();
  const [locationOn, setLocationOn] = useState(false);

  async function toggleLocation(next: boolean) {
    if (next) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationOn(status === 'granted');
    } else {
      setLocationOn(false); // OS-level revoke happens in Settings app; we just stop using it
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, padding: t.spacing.s5, gap: t.spacing.s5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[t.type.body, { color: t.colors.text1 }]}>Use location</Text>
        <Switch value={locationOn} onValueChange={toggleLocation} />
      </View>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text style={[t.type.body, { color: t.colors.info }]}>Sign out</Text>
      </Pressable>
      <Pressable onPress={() => supabase.functions.invoke('delete-account')}>
        <Text style={[t.type.body, { color: t.colors.danger }]}>Delete account</Text>
      </Pressable>
    </View>
  );
}
