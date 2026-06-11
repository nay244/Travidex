import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useProfile } from '../../../hooks/useProfile';
import { ACHIEVEMENTS, achievementProgress } from '../../../lib/achievements';
import { Screen } from '../../../components/Screen';
import { Medallion } from '../../../components/Medallion';

export default function AchievementDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stats } = useProfile();

  const achievement = ACHIEVEMENTS.find(a => a.id === id);

  if (!achievement) {
    return (
      <Screen>
        <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>
          Not found
        </Text>
      </Screen>
    );
  }

  const { value, done } = achievementProgress(achievement, stats);
  const earned = value > 0;

  return (
    <Screen>
      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        style={({ pressed }) => ({
          padding: t.spacing.s5,
          alignSelf: 'flex-start',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Ionicons name="close" size={24} color={t.colors.text1} />
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: 'center',
          padding: t.spacing.s5,
          paddingTop: t.spacing.s8,
          gap: t.spacing.s5,
        }}
      >
        {/* Big medallion */}
        <Medallion
          icon={achievement.icon}
          tone={achievement.tone}
          earned={earned}
          size={96}
          badge={earned ? String(value) : undefined}
        />

        {/* Label */}
        <Text style={[t.type.h1, { color: t.colors.text1, textAlign: 'center' }]}>
          {achievement.label}
        </Text>

        {/* Progress block */}
        <View style={{ width: '100%', gap: t.spacing.s2 }}>
          <Text style={[t.type.stat, { color: t.colors.text1, textAlign: 'center' }]}>
            {value} / {achievement.goal}
          </Text>
          <View style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            backgroundColor: t.colors.progressBg,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${(value / achievement.goal) * 100}%`,
              height: '100%',
              backgroundColor: done ? t.colors.green : t.colors.amber,
              borderRadius: 4,
            }} />
          </View>
        </View>

        {/* Description */}
        <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center' }]}>
          {achievement.description}
        </Text>

        {/* Status line */}
        {done ? (
          <Text style={[t.type.label, { color: t.colors.green }]}>Unlocked</Text>
        ) : (
          <Text style={[t.type.label, { color: t.colors.text3 }]}>Keep going</Text>
        )}
      </ScrollView>
    </Screen>
  );
}
