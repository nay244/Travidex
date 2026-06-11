import { useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { signInWithApple } from '../../lib/auth';
import { Screen } from '../../components/Screen';
import { Flag } from '../../components/Flag';

// 5 columns × 4 rows of flag codes — same "collector's board" spread as Welcome.jsx
// c = claimed, p = in-progress, u = unseen (shown with a dim surface tile)
const BOARD: { code: string; state: 'c' | 'p' | 'u' }[] = [
  { code: 'JP', state: 'u' }, { code: 'PL', state: 'p' }, { code: 'IT', state: 'u' },
  { code: 'CH', state: 'c' }, { code: 'TH', state: 'u' },
  { code: 'SE', state: 'c' }, { code: 'DE', state: 'u' }, { code: 'UA', state: 'u' },
  { code: 'DK', state: 'p' }, { code: 'FR', state: 'u' },
  { code: 'NL', state: 'u' }, { code: 'BE', state: 'p' }, { code: 'RU', state: 'c' },
  { code: 'AT', state: 'u' }, { code: 'HU', state: 'u' },
  { code: 'ES', state: 'u' }, { code: 'PT', state: 'c' }, { code: 'RO', state: 'u' },
  { code: 'NO', state: 'u' }, { code: 'BD', state: 'p' },
];

const TILE_SIZE = 62;
const TILE_GAP = 8;

export default function Welcome() {
  const t = useTheme();
  const router = useRouter();

  async function handleAppleSignIn() {
    try {
      await signInWithApple();
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign in failed', 'Please try again.');
      }
    }
  }

  return (
    <Screen edges={[]}>
      <View style={{ flex: 1, backgroundColor: t.colors.bg }}>

        {/* ── Flag-grid hero (top ~60 %) ─────────────────────────── */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            overflow: 'hidden',
          }}
        >
          {/* Radial wash behind the flags */}
          <View
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: t.colors.wash1,
            }}
          />

          {/* Rotated flag grid */}
          <View
            style={{
              position: 'absolute',
              top: -16,
              left: -12,
              right: -12,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: TILE_GAP,
              padding: TILE_GAP,
              transform: [{ rotate: '-4deg' }, { scale: 1.08 }],
              opacity: 0.95,
            }}
          >
            {BOARD.map((tile, i) => (
              <View
                key={i}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  borderRadius: t.radii.sm,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor:
                    tile.state === 'c'
                      ? t.colors.greenLine
                      : tile.state === 'p'
                      ? t.colors.amberLine
                      : t.colors.borderDefault,
                  backgroundColor: t.colors.surface1,
                  ...t.shadow.sm,
                }}
              >
                <Flag code={tile.code} size={TILE_SIZE} radius={0} />
              </View>
            ))}
          </View>

          {/* Fade gradient: transparent → bg */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '55%',
              // RN gradient approximation: two overlapping semi-transparent bg layers
              // (LinearGradient not available without expo-linear-gradient; surfaceOverlay + bg suffices)
              backgroundColor: t.colors.bg,
              opacity: 0.92,
            }}
          />
        </View>

        {/* ── Content panel (bottom, floats over the fade) ─────────── */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: '38%',
            paddingHorizontal: t.spacing.s7,
            paddingBottom: t.spacing.s10,
            justifyContent: 'flex-end',
          }}
        >
          {/* Logo + wordmark */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s3, marginBottom: t.spacing.s5 }}>
            {/* Travidex mark: green dot placeholder (the SVG asset lives outside RN bundle) */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: t.radii.sm,
                backgroundColor: t.colors.greenDim,
                borderWidth: 1,
                borderColor: t.colors.greenLine,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: t.colors.green,
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: t.fontFamily.sansBold,
                fontSize: 24,
                letterSpacing: -0.48,
                color: t.colors.text1,
              }}
            >
              {'Travi'}
              <Text style={{ color: t.colors.green }}>{'dex'}</Text>
            </Text>
          </View>

          {/* Headline */}
          <Text
            style={[
              t.type.display,
              {
                color: t.colors.text1,
                marginBottom: t.spacing.s4,
                lineHeight: 40,
              },
            ]}
          >
            {'Collect the world, one '}
            <Text style={{ color: t.colors.green }}>{'sight'}</Text>
            {' at a time.'}
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              t.type.bodyLg,
              {
                color: t.colors.text2,
                marginBottom: t.spacing.s6,
                maxWidth: 320,
              },
            ]}
          >
            {'Find real places, log your discoveries, and claim a city when you\'ve found every sight.'}
          </Text>

          {/* Apple sign-in — black pill */}
          <Pressable
            onPress={handleAppleSignIn}
            style={{
              height: t.size.btnH,
              borderRadius: t.radii.pill,
              backgroundColor: t.colors.text1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: t.spacing.s2,
              marginBottom: t.spacing.s3,
            }}
          >
            <Text
              style={[
                t.type.h3,
                {
                  color: t.colors.bg,
                  textAlign: 'center',
                },
              ]}
            >
              {'Sign in with Apple'}
            </Text>
          </Pressable>

          {/* Continue with email — outlined pill */}
          <Pressable
            onPress={() => router.push('/(auth)/sign-up')}
            style={{
              height: t.size.btnH,
              borderRadius: t.radii.pill,
              borderWidth: 1.5,
              borderColor: t.colors.borderStrong,
              backgroundColor: t.colors.surface1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: t.spacing.s3,
            }}
          >
            <Text style={[t.type.h3, { color: t.colors.text1, textAlign: 'center' }]}>
              {'Continue with Email'}
            </Text>
          </Pressable>

          {/* Log in link */}
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={{ padding: t.spacing.s2, alignItems: 'center', marginBottom: t.spacing.s3 }}
          >
            <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center' }]}>
              {'Already have an account? '}
              <Text style={{ color: t.colors.green, fontFamily: t.fontFamily.sansSemibold }}>
                {'Log in'}
              </Text>
            </Text>
          </Pressable>

          {/* Legal */}
          <Text
            style={{
              fontFamily: t.fontFamily.sansRegular,
              fontSize: t.fontSize.micro,
              color: t.colors.text3,
              textAlign: 'center',
              lineHeight: 17,
            }}
          >
            {'By continuing you agree to our '}
            <Text style={{ color: t.colors.text2 }}>{'Terms'}</Text>
            {' & '}
            <Text style={{ color: t.colors.text2 }}>{'Privacy Policy'}</Text>
            {'.'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
