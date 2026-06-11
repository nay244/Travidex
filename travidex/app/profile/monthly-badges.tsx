import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getFindMonths } from '../../lib/data/finds';
import { Screen } from '../../components/Screen';

// Flat month catalog — copy a line to add/rename (index 0 = January).
const MONTHS = [
  'January',   // 0 — Jan
  'February',  // 1 — Feb
  'March',     // 2 — Mar
  'April',     // 3 — Apr
  'May',       // 4 — May
  'June',      // 5 — Jun
  'July',      // 6 — Jul
  'August',    // 7 — Aug
  'September', // 8 — Sep
  'October',   // 9 — Oct
  'November',  // 10 — Nov
  'December',  // 11 — Dec
];

// Flat short-label catalog used in the cell caption (matches MONTHS by index).
const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
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
          const earnedCount = MONTHS.filter((_name, m) => {
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
                {MONTHS.map((name, m) => {
                  const key = `${year}-${String(m + 1).padStart(2, '0')}`;
                  const earned = findMonths.has(key);
                  return (
                    <View
                      key={key}
                      testID={earned ? `month-${key}-earned` : `month-${key}-locked`}
                      style={{
                        // 3-col layout: (100% - 2 gaps) / 3 — use fixed fraction
                        width: '30%',
                        alignItems: 'center',
                        gap: t.spacing.s2,
                      }}
                    >
                      {/* Circular disc */}
                      <View style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: earned ? t.colors.foundBg : 'transparent',
                        borderWidth: 1.5,
                        borderColor: earned ? t.colors.greenLine : t.colors.locked,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {earned ? (
                          <Ionicons name="checkmark" size={26} color={t.colors.green} />
                        ) : (
                          <Ionicons name="lock-closed-outline" size={20} color={t.colors.text3} />
                        )}
                      </View>
                      {/* Month caption */}
                      <Text style={[t.type.monoSm, {
                        color: earned ? t.colors.green : t.colors.textDisabled,
                        textAlign: 'center',
                      }]}>
                        {MONTH_SHORT[m]}
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
