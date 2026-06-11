import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useProfile } from '../../../hooks/useProfile';
import { ACHIEVEMENTS, achievementProgress } from '../../../lib/achievements';
import { Screen } from '../../../components/Screen';
import { Glass } from '../../../components/Glass';

export default function AchievementsGrid() {
  const t = useTheme();
  const router = useRouter();
  const { stats } = useProfile();

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
        <Text style={[t.type.h2, { color: t.colors.text1 }]}>Achievements</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: t.spacing.s5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: t.spacing.s3,
        }}
      >
        {ACHIEVEMENTS.map(a => {
          const { value, done } = achievementProgress(a, stats);

          return (
            <Pressable
              key={a.id}
              testID={`ach-${a.id}-${done ? 'done' : 'locked'}`}
              onPress={() => router.push(`/profile/achievements/${a.id}` as any)}
              style={({ pressed }) => ({
                width: '47%',
                borderRadius: t.radii.lg,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Glass style={{
                borderRadius: t.radii.lg,
                padding: t.spacing.s5,
                alignItems: 'center',
                gap: t.spacing.s2,
              }}>
                {/* Icon disc: done = foundBg fill + green icon; locked = hollow + text3 icon */}
                <View style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: done ? t.colors.foundBg : 'transparent',
                  borderWidth: done ? 0 : 1,
                  borderColor: t.colors.locked,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Ionicons
                    name={a.icon as any}
                    size={24}
                    color={done ? t.colors.green : t.colors.text3}
                  />
                </View>

                {/* Label */}
                <Text
                  style={[t.type.h3, { color: t.colors.text1, textAlign: 'center' }]}
                  numberOfLines={2}
                >
                  {a.label}
                </Text>

                {/* Mono progress caption */}
                <Text style={[t.type.monoSm, { color: done ? t.colors.green : t.colors.text3 }]}>
                  {value}/{a.goal}
                </Text>

                {/* Progress bar */}
                <View style={{
                  width: '100%',
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: t.colors.progressBg,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    width: `${(value / a.goal) * 100}%`,
                    height: '100%',
                    backgroundColor: done ? t.colors.green : t.colors.amber,
                    borderRadius: 2,
                  }} />
                </View>
              </Glass>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
