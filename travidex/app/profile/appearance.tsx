import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, useThemeMode } from '@/theme';
import { useEntitlement } from '../../context/EntitlementProvider';
import { Screen } from '../../components/Screen';
import type { Scheme } from '@/theme';

// Hard-coded preview palettes so the mock always reads correctly regardless of active theme
const PREVIEW = {
  light: { bg: '#eceef3', card: '#ffffff', line: 'rgba(22,30,48,0.12)', dot: '#1f9d57' },
  dark:  { bg: '#0d0f14', card: '#12151c', line: 'rgba(255,255,255,0.10)', dot: '#4ade80' },
};

type CardProps = {
  mode: Scheme;
  label: string;
  active: boolean;
  locked: boolean;
  testID: string;
  onPress: () => void;
};

function ThemeCard({ mode, label, active, locked, testID, onPress }: CardProps) {
  const t = useTheme();
  const pal = PREVIEW[mode];

  return (
    <Pressable
      testID={testID}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        borderRadius: t.radii.lg,
        overflow: 'hidden',
        borderWidth: active ? 2 : 1,
        borderColor: active ? t.colors.greenLine : t.colors.borderDefault,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {/* Mini mock preview */}
      <View style={{ height: 96, backgroundColor: pal.bg, padding: 10 }}>
        {/* Fake surface bar */}
        <View style={{
          height: 22, borderRadius: 6, backgroundColor: pal.card,
          borderWidth: 1, borderColor: pal.line,
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 6,
        }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: pal.dot }} />
          <View style={{ flex: 1, height: 5, borderRadius: 999, backgroundColor: pal.line }} />
        </View>
        {/* Fake text lines */}
        <View style={{ marginTop: 8, height: 5, width: '70%', borderRadius: 999, backgroundColor: pal.line }} />
        <View style={{ marginTop: 6, height: 5, width: '50%', borderRadius: 999, backgroundColor: pal.line }} />

        {/* Lock overlay for premium-gated dark card when not premium */}
        {locked && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(8,10,14,0.42)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: 'rgba(255,255,255,0.16)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="lock-closed" size={16} color="#fff" />
            </View>
          </View>
        )}
      </View>

      {/* Label row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 12, paddingVertical: 10,
        backgroundColor: t.colors.surface2,
      }}>
        <Text style={[t.type.body, { color: t.colors.text1, fontWeight: '600' }]}>{label}</Text>
        {active ? (
          <View style={{
            width: 18, height: 18, borderRadius: 9,
            backgroundColor: t.colors.green,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="checkmark" size={12} color={t.colors.textOnAccent} />
          </View>
        ) : locked ? (
          // Amber chip: TRAVIDEX+
          <View style={{
            paddingHorizontal: 6, paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: t.colors.amberDim,
            borderWidth: 1, borderColor: t.colors.amberLine,
          }}>
            <Text style={[t.type.label, { color: t.colors.amber, fontSize: 9 }]}>TRAVIDEX+</Text>
          </View>
        ) : (
          <View style={{
            width: 16, height: 16, borderRadius: 8,
            borderWidth: 2, borderColor: t.colors.borderStrong,
          }} />
        )}
      </View>
    </Pressable>
  );
}

export default function Appearance() {
  const t = useTheme();
  const router = useRouter();
  const { scheme, setScheme } = useThemeMode();
  const { isPremium } = useEntitlement();

  function choose(next: Scheme) {
    if (next === 'dark' && !isPremium) {
      // premium gate — copy this pattern for new Travidex+ features
      router.push('/paywall');
      return;
    }
    setScheme(next);
  }

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
          Appearance
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={{ flex: 1, padding: t.spacing.s7, gap: t.spacing.s5 }}>
        <Text style={[t.type.caption, { color: t.colors.text3 }]}>
          Light is on by default. Dark mode is a Travidex+ feature.
        </Text>

        {/* Two scheme cards side by side */}
        <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
          <ThemeCard
            mode="light"
            label="Light"
            active={scheme === 'light'}
            locked={false}
            testID="option-light"
            onPress={() => choose('light')}
          />
          <ThemeCard
            mode="dark"
            label="Dark"
            active={scheme === 'dark'}
            locked={!isPremium}
            testID="option-dark"
            onPress={() => choose('dark')}
          />
        </View>

        {/* Unlock banner for free users */}
        {!isPremium && (
          <Pressable
            onPress={() => router.push('/paywall')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.spacing.s4,
              padding: t.spacing.s5,
              borderRadius: t.radii.lg,
              backgroundColor: t.colors.amberDim,
              borderWidth: 1,
              borderColor: t.colors.amberLine,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: t.colors.amber,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="sparkles" size={20} color={t.colors.textOnAccent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[t.type.body, { color: t.colors.text1, fontWeight: '600' }]}>Unlock dark mode</Text>
              <Text style={[t.type.label, { color: t.colors.amber, marginTop: 2 }]}>TRAVIDEX+ · PREVIEW IT HERE</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.colors.amber} />
          </Pressable>
        )}

        {/* Premium confirmation */}
        {isPremium && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3 }}>
            <Ionicons name="checkmark" size={14} color={t.colors.green} />
            <Text style={[t.type.label, { color: t.colors.green }]}>TRAVIDEX+ ACTIVE — SWITCH FREELY</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}
