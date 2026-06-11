import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { BADGES } from '../../lib/badges';
import { getUserBadges } from '../../lib/data/badges';
import { Screen } from '../../components/Screen';
import { Glass } from '../../components/Glass';

export default function Badges() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) getUserBadges(session.user.id).then(setEarned).catch(err => console.warn('getUserBadges failed', err));
  }, [session?.user?.id]);

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
          Badges
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.spacing.s5, gap: t.spacing.s3 }}
      >
        {/* Monthly badges entry — links to the calendar-grid view (§3.9) */}
        <Pressable
          testID="monthly-badges-link"
          onPress={() => router.push('/profile/monthly-badges')}
          style={({ pressed }) => ({
            borderRadius: t.radii.lg,
            opacity: pressed ? 0.7 : 1,
            marginBottom: t.spacing.s3,
          })}
        >
          <Glass style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: t.spacing.s5,
            borderRadius: t.radii.lg,
          }}>
            <Ionicons name="calendar-outline" size={20} color={t.colors.green} style={{ marginRight: t.spacing.s4 }} />
            <Text style={[t.type.body, { color: t.colors.text1, flex: 1 }]}>Monthly badges</Text>
            <Ionicons name="chevron-forward" size={16} color={t.colors.text3} />
          </Glass>
        </Pressable>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s3 }}>
          {BADGES.map(b => {
            const has = earned.includes(b.code);
            // earned = foundBg fill + green accents; locked = HOLLOW (transparent + locked border)
            return (
              <View
                key={b.code}
                testID={`badge-${b.code}-${has ? 'earned' : 'locked'}`}
                style={{ width: '48%', borderRadius: t.radii.lg }}
              >
                <Glass style={{
                  padding: t.spacing.s3,
                  borderRadius: t.radii.lg,
                  alignItems: 'center',
                  gap: t.spacing.s2,
                }}>
                  {/* Badge glyph disc */}
                  <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: has ? t.colors.green : 'transparent',
                    borderWidth: has ? 0 : 1,
                    borderColor: t.colors.locked,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons
                      name={has ? 'ribbon' : 'lock-closed-outline'}
                      size={22}
                      color={has ? t.colors.textOnAccent : t.colors.text3}
                    />
                  </View>
                  <Text
                    style={[t.type.h3, { color: has ? t.colors.text1 : t.colors.text3, textAlign: 'center' }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {b.label}
                  </Text>
                  <Text
                    style={[
                      t.type.label,
                      {
                        color: has ? t.colors.green : t.colors.text3,
                        fontSize: 9,
                        letterSpacing: 0.5,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {has ? 'Earned' : 'Locked'}
                  </Text>
                </Glass>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
