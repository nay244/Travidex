import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { useProfile } from '../../hooks/useProfile';
import { Screen } from '../../components/Screen';
import { Glass } from '../../components/Glass';
import { artById, ArtSwatch } from '../../lib/profileArt';
import { getArtId } from '../../lib/data/profile';

// TODO: username from profiles table (Phase 9+); fallback to email local-part
function useDisplayName() {
  const { session } = useAuth();
  const email = session?.user?.email ?? '';
  return email.split('@')[0] || 'Traveler';
}

function getInitials(name: string): string {
  const parts = name.split(/[\s._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const t = useTheme();
  const router = useRouter();
  const { stats } = useProfile();
  const displayName = useDisplayName();
  const initials = getInitials(displayName);
  const { session } = useAuth();
  const [artId, setArtId] = useState('trailhead');

  useEffect(() => {
    if (!session?.user) return;
    getArtId(session.user.id)
      .then(setArtId)
      .catch(err => console.warn('getArtId failed', err));
  }, [session?.user?.id]);

  const art = artById(artId);

  // Stat cell: equal flex, centered, never overlaps on 390pt device
  const StatCell = ({ value, label }: { value: number; label: string }) => (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: t.spacing.s5, paddingHorizontal: t.spacing.s2 }}>
      <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{value}</Text>
      <Text
        style={[
          t.type.label,
          {
            color: t.colors.text3,
            textAlign: 'center',
            marginTop: t.spacing.s1,
            fontSize: 9,
            letterSpacing: 0.5,
            lineHeight: 12,
          },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );

  const NavRow = ({
    label,
    to,
    icon,
    testID,
  }: {
    label: string;
    to: string;
    icon: keyof typeof Ionicons.glyphMap;
    testID?: string;
  }) => (
    <Pressable
      testID={testID}
      onPress={() => router.push(to as any)}
      style={({ pressed }) => ({
        marginBottom: t.spacing.s3,
        opacity: pressed ? 0.75 : 1,
        borderRadius: t.radii.lg,
      })}
    >
      <Glass style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: t.radii.lg,
        padding: t.spacing.s5,
      }}>
        <Ionicons name={icon} size={20} color={t.colors.text2} style={{ marginRight: t.spacing.s4 }} />
        <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
      </Glass>
    </Pressable>
  );

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: t.spacing.s5 }}>
        {/* Identity header with art backdrop — taller zone per ref 15 */}
        <View style={{
          borderRadius: t.radii.lg,
          overflow: 'hidden',
          marginBottom: t.spacing.s5,
          borderWidth: 1,
          borderColor: t.colors.borderSubtle,
          minHeight: 120,
        }}>
          <ArtSwatch art={art} style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
          {/* Glass wash over art so text is legible */}
          <View style={{
            flex: 1,
            paddingHorizontal: t.spacing.s5,
            paddingVertical: t.spacing.s6,
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: t.colors.surface3,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: t.colors.bg,
              marginBottom: t.spacing.s3,
            }}>
              <Text style={[t.type.h2, { color: t.colors.text2 }]}>{initials}</Text>
            </View>
            <Text style={[t.type.h2, { color: t.colors.text1 }]}>{displayName}</Text>
          </View>
        </View>

        {/* Stat row — 3 equal cells, cannot overlap */}
        <Glass style={{
          flexDirection: 'row',
          borderRadius: t.radii.lg,
          marginBottom: t.spacing.s5,
          overflow: 'hidden',
        }}>
          <StatCell value={stats.totalFinds} label="Sights found" />
          <View style={{ width: 1, backgroundColor: t.colors.divider, marginVertical: t.spacing.s4 }} />
          <StatCell value={stats.citiesClaimed} label="Cities claimed" />
          <View style={{ width: 1, backgroundColor: t.colors.divider, marginVertical: t.spacing.s4 }} />
          <StatCell value={stats.countriesExplored} label="Countries" />
        </Glass>

        {/* Nav rail */}
        <NavRow label="Profile art" to="/profile/art" icon="color-palette-outline" testID="nav-profile-art" />
        <NavRow label="Badges" to="/profile/badges" icon="ribbon-outline" />
        <NavRow label="Achievements" to="/profile/achievements" icon="trophy-outline" testID="nav-achievements" />
        <NavRow label="Photo journal" to="/profile/journal" icon="images-outline" />
        <NavRow label="Settings" to="/profile/settings" icon="settings-outline" />
      </ScrollView>
    </Screen>
  );
}
