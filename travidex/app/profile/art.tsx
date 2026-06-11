import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { useProfile } from '../../hooks/useProfile';
import { Screen } from '../../components/Screen';
import { Glass } from '../../components/Glass';
import { PROFILE_ART, ArtSwatch } from '../../lib/profileArt';
import { getArtId, setArtId } from '../../lib/data/profile';

export default function ArtPicker() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const { stats } = useProfile();
  const [selectedId, setSelectedId] = useState('trailhead');

  useEffect(() => {
    if (!session?.user) return;
    getArtId(session.user.id)
      .then(setSelectedId)
      .catch(err => console.warn('getArtId failed', err));
  }, [session?.user?.id]);

  async function handlePick(artId: string) {
    if (!session?.user) return;
    const prev = selectedId;
    setSelectedId(artId); // optimistic
    try {
      await setArtId(session.user.id, artId);
    } catch {
      setSelectedId(prev); // revert
      console.warn('setArtId failed — reverted');
    }
  }

  const unlockedCount = PROFILE_ART.filter(a => a.test(stats)).length;

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: t.spacing.s5 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: t.spacing.s4 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ marginRight: t.spacing.s4 }}
          >
            <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
          </Pressable>
          <Text style={[t.type.h2, { color: t.colors.text1, flex: 1 }]}>Profile art</Text>
          <Text style={[t.type.label, { color: t.colors.green }]}>
            {unlockedCount}/{PROFILE_ART.length} UNLOCKED
          </Text>
        </View>

        {/* Subtitle — §6.1 corrected copy */}
        <Text style={[t.type.body, { color: t.colors.text3, marginBottom: t.spacing.s5 }]}>
          Unlock new <Text style={{ fontWeight: '700' }}>backgrounds</Text> as you find sights, claim cities, and explore countries.
        </Text>

        {/* 2-col grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s3 }}>
          {PROFILE_ART.map(art => {
            const unlocked = art.test(stats);
            const selected = selectedId === art.id;
            const prog = art.progress(stats);
            return (
              <Pressable
                key={art.id}
                testID={`art-${art.id}-${unlocked ? 'unlocked' : 'locked'}`}
                onPress={() => unlocked ? handlePick(art.id) : undefined}
                style={{
                  width: '47.5%',
                  borderRadius: t.radii.lg,
                  overflow: 'hidden',
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? t.colors.green : t.colors.borderSubtle,
                }}
              >
                {/* Art preview — real artwork fills the tile */}
                <View style={{ height: 74, position: 'relative' }}>
                  <ArtSwatch
                    art={art}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  />
                  {/* Locked: scrim overlay + lock icon */}
                  {!unlocked && (
                    <View style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: t.colors.surfaceScrim,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <View style={{
                        width: 32, height: 32, borderRadius: 16,
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Ionicons name="lock-closed" size={14} color="#fff" />
                      </View>
                    </View>
                  )}
                  {/* Selected checkmark disc */}
                  {selected && (
                    <View
                      testID={`art-selected-${art.id}`}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 22, height: 22, borderRadius: 11,
                        backgroundColor: t.colors.green,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="checkmark" size={13} color={t.colors.textOnAccent} />
                    </View>
                  )}
                </View>

                {/* Glass info footer */}
                <Glass style={{ padding: t.spacing.s3 }}>
                  <Text style={[t.type.h3, { color: unlocked ? t.colors.text1 : t.colors.text3 }]}>
                    {art.label}
                  </Text>
                  {unlocked ? (
                    art.id === 'trailhead' ? (
                      <Text style={[t.type.label, { color: t.colors.text3 }]}>FREE</Text>
                    ) : (
                      <Text style={[t.type.label, { color: t.colors.green }]}>UNLOCKED</Text>
                    )
                  ) : (
                    <View style={{ marginTop: t.spacing.s1 }}>
                      {/* Criteria + progress fraction */}
                      <Text
                        style={[t.type.label, { color: t.colors.amber }]}
                        numberOfLines={1}
                      >
                        <Ionicons name="lock-closed-outline" size={10} color={t.colors.amber} />{' '}
                        {art.unlock} · {prog.value}/{prog.goal}
                      </Text>
                      {/* Progress bar */}
                      <View
                        style={{
                          marginTop: t.spacing.s1 + 2,
                          height: 4,
                          borderRadius: 999,
                          backgroundColor: t.colors.progressBg,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            width: `${Math.min(100, (prog.value / prog.goal) * 100)}%`,
                            height: '100%',
                            borderRadius: 999,
                            backgroundColor: t.colors.amber,
                          }}
                        />
                      </View>
                    </View>
                  )}
                </Glass>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
