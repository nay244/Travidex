import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { useProfile } from '../../hooks/useProfile';
import { useEntitlement } from '../../context/EntitlementProvider';
import { Screen } from '../../components/Screen';
import { Glass } from '../../components/Glass';
import { artById, ArtSwatch } from '../../lib/profileArt';
import { getArtId } from '../../lib/data/profile';
import { BADGES } from '../../lib/badges';
import { ACHIEVEMENTS, achievementProgress } from '../../lib/achievements';
import { Medallion } from '../../components/Medallion';

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

// TODO: real join date from profiles
const JOIN_YEAR = new Date().getFullYear();

export default function Profile() {
  const t = useTheme();
  const router = useRouter();
  const { stats, earnedBadges } = useProfile();
  const { isPremium } = useEntitlement();
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
  const handle = displayName;

  // --- Badges rail: last 4 earned (most-recent first), fill rest with locks ---
  const earnedBadgeObjects = earnedBadges
    .slice()
    .reverse()
    .slice(0, 4)
    .map(code => BADGES.find(b => b.code === code))
    .filter(Boolean) as typeof BADGES;
  const badgeSlots = [...earnedBadgeObjects];
  while (badgeSlots.length < 4) badgeSlots.push(null as any);

  // --- Achievements rail: done first then in-progress by value, 4 slots ---
  const achWithProgress = ACHIEVEMENTS.map(a => ({
    ...a,
    progress: achievementProgress(a, stats),
  }));
  const achSorted = [
    ...achWithProgress.filter(a => a.progress.done),
    ...achWithProgress
      .filter(a => !a.progress.done)
      .sort((x, y) => y.progress.value - x.progress.value),
  ].slice(0, 4);
  const achSlots = [...achSorted];
  while (achSlots.length < 4) achSlots.push(null as any);

  const sectionLabelStyle = [
    t.type.label,
    {
      color: t.colors.text3,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.2,
      marginBottom: t.spacing.s3,
      fontFamily: t.fontFamily.monoRegular,
      fontSize: t.fontSize.micro,
    },
  ];

  return (
    <Screen>
      {/* Full-screen art background — absolute fill behind everything */}
      <ArtSwatch
        art={art}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 }}
      />
      {/* Art veil for legibility */}
      <View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: t.colors.artVeil,
        }}
        pointerEvents="none"
      />

      {/* Gear chip — top-right, above scroll */}
      <Pressable
        testID="settings-chip"
        onPress={() => router.push('/profile/settings' as any)}
        style={({ pressed }) => ({
          position: 'absolute',
          top: 56,
          right: t.spacing.s5,
          zIndex: 10,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Glass
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="settings-outline" size={18} color={t.colors.text1} />
        </Glass>
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.spacing.s5, paddingTop: t.spacing.s5 + 44 }}
      >
        {/* (1.5) Header: avatar + display name + meta */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s4, marginBottom: t.spacing.s5 }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: t.colors.surface1,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: t.colors.bg,
            }}
          >
            <Text style={[t.type.h2, { color: t.colors.text2 }]}>{initials}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[t.type.h2, { color: t.colors.text1, fontWeight: '700' }]}>{displayName}</Text>
            <Text
              style={[
                t.type.body,
                {
                  color: t.colors.text2,
                  fontFamily: t.fontFamily.monoRegular,
                  fontSize: t.fontSize.monoSm,
                  marginTop: t.spacing.s1,
                },
              ]}
            >
              @{handle} · SINCE {JOIN_YEAR}
            </Text>
          </View>
        </View>

        {/* (1.3) Three separate StatTiles */}
        <View style={{ flexDirection: 'row', gap: t.spacing.s3, marginBottom: t.spacing.s3 }}>
          <Glass style={{ flex: 1, borderRadius: t.radii.lg, padding: t.spacing.s4, alignItems: 'center' }}>
            <Ionicons name="location-outline" size={18} color={t.colors.text2} style={{ marginBottom: t.spacing.s2 }} />
            <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{stats.totalFinds}</Text>
            <Text
              style={[
                t.type.label,
                {
                  color: t.colors.text3,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: t.spacing.s1,
                  fontSize: t.fontSize.micro,
                  letterSpacing: 0.5,
                },
              ]}
              numberOfLines={2}
            >
              Sights found
            </Text>
          </Glass>
          <Glass style={{ flex: 1, borderRadius: t.radii.lg, padding: t.spacing.s4, alignItems: 'center' }}>
            <Ionicons name="flag-outline" size={18} color={t.colors.text2} style={{ marginBottom: t.spacing.s2 }} />
            <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{stats.citiesClaimed}</Text>
            <Text
              style={[
                t.type.label,
                {
                  color: t.colors.text3,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: t.spacing.s1,
                  fontSize: t.fontSize.micro,
                  letterSpacing: 0.5,
                },
              ]}
              numberOfLines={2}
            >
              Cities claimed
            </Text>
          </Glass>
          <Glass style={{ flex: 1, borderRadius: t.radii.lg, padding: t.spacing.s4, alignItems: 'center' }}>
            <Ionicons name="earth-outline" size={18} color={t.colors.text2} style={{ marginBottom: t.spacing.s2 }} />
            <Text style={[t.type.statXl, { color: t.colors.text1 }]}>{stats.countriesExplored}</Text>
            <Text
              style={[
                t.type.label,
                {
                  color: t.colors.text3,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: t.spacing.s1,
                  fontSize: t.fontSize.micro,
                  letterSpacing: 0.5,
                },
              ]}
              numberOfLines={2}
            >
              Countries
            </Text>
          </Glass>
        </View>

        {/* (1.4) World completion card */}
        <Glass
          style={{
            borderRadius: t.radii.lg,
            padding: t.spacing.s4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.spacing.s4,
            marginBottom: t.spacing.s5,
          }}
        >
          {/* Ring approximation — SVG arc deferred, using circle border */}
          <View
            style={{
              width: 64, height: 64, borderRadius: 32,
              borderWidth: 3,
              borderColor: t.colors.greenLine,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: t.fontFamily.monoRegular,
                fontSize: t.fontSize.monoSm,
                color: t.colors.text1,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {stats.worldFound}/{stats.worldTotal}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[t.type.body, { color: t.colors.text1, fontWeight: '600' }]}>World completion</Text>
            <Text
              style={{
                fontFamily: t.fontFamily.monoRegular,
                fontSize: t.fontSize.monoSm,
                color: t.colors.text3,
                marginTop: t.spacing.s1,
                letterSpacing: 0.3,
              }}
            >
              <Text style={{ color: t.colors.green, fontWeight: '700' }}>{stats.worldFound}</Text>
              {' / '}{stats.worldTotal} SIGHTS · {stats.countriesExplored} COUNTRIES STARTED
            </Text>
          </View>
        </Glass>

        {/* (1.2) Badges rail */}
        <View style={{ marginBottom: t.spacing.s5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.spacing.s3 }}>
            <Text style={[t.type.h2, { color: t.colors.text1, fontWeight: '700', fontSize: 18 }]}>Badges</Text>
            <Pressable
              testID="badges-page-btn"
              onPress={() => router.push('/profile/badges' as any)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Glass style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="chevron-forward" size={14} color={t.colors.text2} />
              </Glass>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', gap: t.spacing.s3, justifyContent: 'space-between' }}>
            {badgeSlots.map((badge, i) =>
              badge ? (
                <Medallion
                  key={badge.code}
                  testID={`rail-badge-${i}`}
                  icon={badge.icon}
                  tone={badge.tone}
                  earned
                  size={64}
                />
              ) : (
                <Medallion
                  key={`lock-${i}`}
                  testID={`rail-badge-${i}`}
                  icon="lock-closed-outline"
                  tone="green"
                  earned={false}
                  size={64}
                />
              )
            )}
          </View>
        </View>

        {/* (1.2) Achievements rail */}
        <View style={{ marginBottom: t.spacing.s5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.spacing.s3 }}>
            <Text style={[t.type.h2, { color: t.colors.text1, fontWeight: '700', fontSize: 18 }]}>Achievements</Text>
            <Pressable
              testID="achievements-page-btn"
              onPress={() => router.push('/profile/achievements' as any)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Glass style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="chevron-forward" size={14} color={t.colors.text2} />
              </Glass>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', gap: t.spacing.s3, justifyContent: 'space-between' }}>
            {achSlots.map((ach, i) =>
              ach ? (
                <Medallion
                  key={ach.id}
                  testID={`rail-achievement-${i}`}
                  icon={ach.icon}
                  tone={ach.tone}
                  earned={ach.progress.done}
                  size={64}
                />
              ) : (
                <Medallion
                  key={`ach-lock-${i}`}
                  testID={`rail-achievement-${i}`}
                  icon="lock-closed-outline"
                  tone="green"
                  earned={false}
                  size={64}
                />
              )
            )}
          </View>
        </View>

        {/* (1.6) Customize section */}
        <Text style={sectionLabelStyle}>Customize</Text>

        {/* Appearance row */}
        <Pressable
          testID="nav-appearance"
          onPress={() => router.push('/profile/appearance' as any)}
          style={({ pressed }) => ({
            marginBottom: t.spacing.s3,
            opacity: pressed ? 0.75 : 1,
            borderRadius: t.radii.lg,
          })}
        >
          <Glass
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: t.radii.lg,
              padding: t.spacing.s4,
              paddingHorizontal: t.spacing.s5,
            }}
          >
            <Ionicons name="moon-outline" size={20} color={t.colors.text2} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1, fontWeight: '600' }]}>Appearance</Text>
            {!isPremium && (
              <View
                style={{
                  backgroundColor: t.colors.amberDim,
                  borderRadius: 999,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: t.colors.amberLine,
                  marginRight: t.spacing.s3,
                }}
              >
                <Text
                  style={{
                    fontFamily: t.fontFamily.monoRegular,
                    fontSize: t.fontSize.micro,
                    color: t.colors.amber,
                    letterSpacing: 0.8,
                  }}
                >
                  TRAVIDEX+
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
          </Glass>
        </Pressable>

        {/* Profile art row */}
        <Pressable
          testID="nav-profile-art"
          onPress={() => router.push('/profile/art' as any)}
          style={({ pressed }) => ({
            marginBottom: t.spacing.s5,
            opacity: pressed ? 0.75 : 1,
            borderRadius: t.radii.lg,
          })}
        >
          <Glass
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: t.radii.lg,
              padding: t.spacing.s4,
              paddingHorizontal: t.spacing.s5,
            }}
          >
            {/* Live 36px ArtSwatch thumbnail */}
            <View
              style={{
                width: 36, height: 36,
                borderRadius: t.radii.sm,
                overflow: 'hidden',
                marginRight: t.spacing.s4,
                borderWidth: 1,
                borderColor: t.colors.borderDefault,
              }}
            >
              <ArtSwatch art={art} style={{ width: 36, height: 36, borderRadius: 0 }} />
            </View>
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1, fontWeight: '600' }]}>Profile art</Text>
            <Text
              style={{
                fontFamily: t.fontFamily.monoRegular,
                fontSize: t.fontSize.monoSm,
                color: t.colors.text3,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginRight: t.spacing.s2,
              }}
            >
              {art.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
          </Glass>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
