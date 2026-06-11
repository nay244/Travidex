import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getFindMonths } from '../../lib/data/finds';
import { Screen } from '../../components/Screen';
import { Medallion, type MedallionTone } from '../../components/Medallion';

// Month badge designs — add/adjust a month: copy a line and rename.
// Icons are Ionicons; tones tint the earned medallion. Derived from kit BADGE_YEARS.
const MONTH_BADGES: { month: string; icon: string; tone: MedallionTone }[] = [
  { month: 'January',   icon: 'trail-sign-outline', tone: 'green' }, // footprints → trail
  { month: 'February',  icon: 'camera-outline',     tone: 'blue'  }, // camera
  { month: 'March',     icon: 'map-outline',         tone: 'amber' }, // map
  { month: 'April',     icon: 'flag-outline',        tone: 'green' }, // flag
  { month: 'May',       icon: 'compass-outline',     tone: 'blue'  }, // compass
  { month: 'June',      icon: 'triangle-outline',    tone: 'amber' }, // mountain
  { month: 'July',      icon: 'water-outline',       tone: 'blue'  }, // waves
  { month: 'August',    icon: 'bonfire-outline',     tone: 'amber' }, // tent/outdoors
  { month: 'September', icon: 'leaf-outline',        tone: 'green' }, // leaf
  { month: 'October',   icon: 'skull-outline',       tone: 'amber' }, // ghost/Halloween
  { month: 'November',  icon: 'rainy-outline',       tone: 'blue'  }, // wind/rain
  { month: 'December',  icon: 'snow-outline',        tone: 'blue'  }, // snowflake
];

export default function MonthlyBadges({ now = new Date() }: { now?: Date }) {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [findMonths, setFindMonths] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (session?.user) {
      getFindMonths(session.user.id)
        .then(setFindMonths)
        .catch(err => console.warn('getFindMonths failed', err));
    }
  }, [session?.user?.id]);

  const currentYear = now.getFullYear();

  // Collect years from earned months + always include current year, descending.
  const earnedYears = new Set(
    [...findMonths].map(ym => parseInt(ym.slice(0, 4), 10)),
  );
  earnedYears.add(currentYear);
  const years = [...earnedYears].sort((a, b) => b - a);

  return (
    <Screen>
      {/* Manual header — stack header is hidden at the tabs layout level */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        paddingHorizontal: t.spacing.s4,
        borderBottomWidth: 1,
        borderBottomColor: t.colors.borderSubtle,
      }}>
        <Pressable
          onPress={() => router.back()}
          testID="back-button"
          style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="chevron-back" size={22} color={t.colors.text1} />
        </Pressable>
        <Text style={[t.type.h2, { flex: 1, textAlign: 'center', color: t.colors.text1 }]}>
          Monthly badges
        </Text>
        {/* Balance the back button so title stays centered */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.spacing.s5, paddingBottom: t.spacing.s8 }}
      >
        {/* Subtitle */}
        <Text style={[t.type.caption, { color: t.colors.text3, marginBottom: t.spacing.s4, lineHeight: 19 }]}>
          Complete each month's challenge to earn its badge. A new design drops every month.
        </Text>

        {years.map(year => {
          const earnedCount = MONTH_BADGES.filter((_badge, m) => {
            const key = `${year}-${String(m + 1).padStart(2, '0')}`;
            return findMonths.has(key);
          }).length;

          return (
            <View key={year} style={{ marginTop: t.spacing.s5 }}>
              {/* Year header row */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: t.spacing.s4,
              }}>
                <Text style={[t.type.h2, { color: t.colors.text1 }]}>{year} badges</Text>
                <Text style={[t.type.label, { color: t.colors.green }]}>{earnedCount}/12</Text>
              </View>

              {/* 3-col month grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s4 }}>
                {MONTH_BADGES.map(({ month, icon, tone }, m) => {
                  const key = `${year}-${String(m + 1).padStart(2, '0')}`;
                  const earned = findMonths.has(key);
                  return (
                    <View
                      key={key}
                      style={{
                        // 3-col layout: guarantee 3-up on narrow screens
                        // (30% + gaps could wrap the 3rd column)
                        flexBasis: '28%',
                        flexGrow: 1,
                        alignItems: 'center',
                        gap: t.spacing.s2,
                      }}
                    >
                      <Medallion
                        icon={earned ? icon : 'lock-closed-outline'}
                        tone={tone}
                        earned={earned}
                        size={64}
                        testID={earned ? `month-${key}-earned` : `month-${key}-locked`}
                      />
                      {/* Month label — full name, sans 600 */}
                      <Text style={{
                        fontFamily: t.fontFamily.sansSemibold,
                        fontSize: t.fontSize.caption,
                        color: earned ? t.colors.green : t.colors.textDisabled,
                        textAlign: 'center',
                      }}>
                        {month}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
