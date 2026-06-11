import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useProfile } from '../../../hooks/useProfile';
import { ACHIEVEMENTS, achievementProgress } from '../../../lib/achievements';
import { Screen } from '../../../components/Screen';
import { Medallion } from '../../../components/Medallion';

const COL = 3;
const MEDALLION_SIZE = 84;

export default function AchievementsGrid() {
  const t = useTheme();
  const router = useRouter();
  const { stats } = useProfile();

  const total = ACHIEVEMENTS.length;
  const doneCount = ACHIEVEMENTS.filter(a => achievementProgress(a, stats).done).length;

  return (
    <Screen>
      {/* Back header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: t.spacing.s5,
        paddingTop: t.spacing.s4,
        paddingBottom: t.spacing.s3,
        gap: t.spacing.s3,
      }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.spacing.s5, paddingTop: t.spacing.s3 }}
      >
        {/* Awards header row */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: t.spacing.s5,
        }}>
          <Text style={[t.type.h2, { fontFamily: t.fontFamily.sansBold, color: t.colors.text1 }]}>
            Awards
          </Text>
          <Text style={[t.type.monoSm, { color: t.colors.green }]}>
            {doneCount}/{total} unlocked
          </Text>
        </View>

        {/* 3-column grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s4 }}>
          {ACHIEVEMENTS.map(a => {
            const { value, done } = achievementProgress(a, stats);
            // earned-style when value > 0 (done or in-progress); hollow when value === 0
            const earned = value > 0;
            const caption = value === 0 ? 'LOCKED' : `LVL ${a.level} · ${value}/${a.goal}`;

            return (
              <Pressable
                key={a.id}
                testID={`ach-${a.id}-${done ? 'done' : 'locked'}`}
                onPress={() => router.push(`/profile/achievements/${a.id}` as any)}
                style={({ pressed }) => ({
                  // 3 columns: (width - 2*padding - 2*gap) / 3
                  width: `${100 / COL}%` as any,
                  alignItems: 'center',
                  gap: t.spacing.s2,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Medallion
                  icon={a.icon}
                  tone={a.tone}
                  earned={earned}
                  size={MEDALLION_SIZE}
                  badge={earned ? String(value) : undefined}
                />
                <Text
                  style={[t.type.caption, {
                    color: t.colors.text1,
                    fontFamily: t.fontFamily.sansSemibold,
                    textAlign: 'center',
                  }]}
                  numberOfLines={2}
                >
                  {a.label}
                </Text>
                <Text style={[t.type.monoSm, {
                  color: value === 0 ? t.colors.text3 : t.colors.text2,
                  textAlign: 'center',
                }]}>
                  {caption}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
