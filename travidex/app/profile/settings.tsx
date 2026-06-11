import { useState, useEffect } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { supabase } from '../../lib/supabase';
import { useEntitlement } from '../../context/EntitlementProvider';
import { Screen } from '../../components/Screen';

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

  async function restorePurchases() {
    try {
      await restore();
      Alert.alert('Purchases restored', 'Your Travidex+ access is up to date.');
    } catch {
      Alert.alert('Restore failed', 'Try again later.');
    }
  }

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

  const cardStyle = {
    backgroundColor: t.colors.surface1,
    borderRadius: t.radii.lg,
    borderWidth: 1,
    borderColor: t.colors.borderSubtle,
    overflow: 'hidden' as const,
    marginBottom: t.spacing.s4,
  };

  const rowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: t.spacing.s4,
    paddingHorizontal: t.spacing.s5,
    minHeight: t.size.hitMin,
  };

  const divider = {
    height: 1,
    backgroundColor: t.colors.divider,
    marginHorizontal: t.spacing.s5,
  };

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
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={{ flex: 1, padding: t.spacing.s5 }}>
        {/* Section 1: Location + Appearance */}
        <View style={cardStyle}>
          <View style={rowStyle}>
            <Ionicons name="location-outline" size={20} color={t.colors.text2} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>Use location</Text>
            <Switch value={locationOn} onValueChange={toggleLocation} />
          </View>
          <View style={divider} />
          <Pressable
            onPress={() => router.push('/profile/appearance')}
            style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="color-palette-outline" size={20} color={t.colors.text2} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>Appearance</Text>
            <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
          </Pressable>
        </View>

        {/* Section 2: Account actions */}
        <View style={cardStyle}>
          <Pressable
            onPress={() => supabase.auth.signOut()}
            style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="log-out-outline" size={20} color={t.colors.info} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.info }]}>Sign out</Text>
          </Pressable>
          <View style={divider} />
          <Pressable
            onPress={restorePurchases}
            style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="refresh-outline" size={20} color={t.colors.info} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.info }]}>Restore purchases</Text>
          </Pressable>
        </View>

        {/* Section 3: Danger zone */}
        <View style={cardStyle}>
          <Pressable
            onPress={deleteAccount}
            disabled={busy}
            style={({ pressed }) => [rowStyle, { opacity: pressed || busy ? 0.7 : 1 }]}
          >
            <Ionicons name="trash-outline" size={20} color={t.colors.danger} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.danger }]}>Delete account</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
