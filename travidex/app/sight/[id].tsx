import { ScrollView, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { Screen } from '../../components/Screen';
import { useSight } from '../../hooks/useSight';
import { LogFindSheet } from '../../components/LogFindSheet';
import { YourPhotos } from '../../components/YourPhotos';

export default function SightDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, found, recentFinds, loading, reload } = useSight(id!);

  const [hintOpen, setHintOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  if (loading || !sight) return <Screen><View style={{ flex: 1 }} /></Screen>;

  const dexLabel = '#' + String(sight.dex_no).padStart(3, '0');

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
        <View style={{ flex: 1 }} />
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ flex: 1 }}>

        {/* Hero block */}
        {found ? (
          <View
            testID="hero-found"
            style={{
              height: 220,
              backgroundColor: t.colors.foundBg,
              borderBottomWidth: 1,
              borderBottomColor: t.colors.greenLine,
              justifyContent: 'flex-end',
              padding: t.spacing.s4,
            }}
          >
            {/* Overlaid badge chips */}
            <View style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
              <View style={{
                backgroundColor: t.colors.surfaceOverlay,
                borderRadius: t.radii.pill,
                borderWidth: 1,
                borderColor: t.colors.borderDefault,
                paddingHorizontal: t.spacing.s3,
                paddingVertical: t.spacing.s1,
              }}>
                <Text style={[t.type.dexNo, { color: t.colors.text1 }]}>{dexLabel}</Text>
              </View>
              <View style={{
                backgroundColor: t.colors.greenDim,
                borderRadius: t.radii.pill,
                borderWidth: 1,
                borderColor: t.colors.greenLine,
                paddingHorizontal: t.spacing.s3,
                paddingVertical: t.spacing.s1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing.s1,
              }}>
                <Text style={[t.type.dexNo, { color: t.colors.green }]}>✓ FOUND</Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            testID="hero-unfound"
            style={{
              height: 220,
              backgroundColor: t.colors.surface2,
              borderBottomWidth: 1,
              borderBottomColor: t.colors.borderSubtle,
              justifyContent: 'flex-end',
              padding: t.spacing.s4,
            }}
          >
            <View style={{
              backgroundColor: t.colors.surfaceOverlay,
              borderRadius: t.radii.pill,
              borderWidth: 1,
              borderColor: t.colors.borderDefault,
              paddingHorizontal: t.spacing.s3,
              paddingVertical: t.spacing.s1,
              alignSelf: 'flex-start',
            }}>
              <Text style={[t.type.dexNo, { color: t.colors.text3 }]}>{dexLabel}</Text>
            </View>
          </View>
        )}

        <View style={{ padding: t.spacing.s5, gap: t.spacing.s4 }}>

          {/* Title row */}
          <View>
            <Text style={[t.type.h1, { color: t.colors.text1 }]}>{sight.name}</Text>
          </View>

          {/* Type chips */}
          {sight.type_tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s2 }}>
              {sight.type_tags.map(tag => (
                <View
                  key={tag}
                  style={{
                    borderWidth: 1,
                    borderColor: t.colors.borderDefault,
                    borderRadius: t.radii.pill,
                    paddingHorizontal: t.spacing.s3,
                    paddingVertical: t.spacing.s1,
                  }}
                >
                  <Text style={[t.type.caption, { color: t.colors.text2 }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Info grid: Access / Size / Busyness */}
          <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
            {([
              { label: 'ACCESS', value: sight.access },
              { label: 'SIZE', value: sight.size },
              { label: 'BUSYNESS', value: sight.busyness },
            ] as { label: string; value: string | null }[]).map(({ label, value }) => (
              <View
                key={label}
                style={{
                  flex: 1,
                  backgroundColor: t.colors.surface2,
                  borderRadius: t.radii.sm,
                  borderWidth: 1,
                  borderColor: t.colors.borderSubtle,
                  padding: t.spacing.s3,
                  alignItems: 'center',
                  gap: t.spacing.s1,
                }}
              >
                <Text style={[t.type.h3, { color: t.colors.text1 }]}>{value ?? '—'}</Text>
                <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons row */}
          <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
            <Pressable
              onPress={() => router.push(`/sight/${sight.id}/navigate`)}
              style={{
                flex: 1,
                backgroundColor: t.colors.actionPositive,
                padding: t.spacing.s4,
                borderRadius: t.radii.sm,
                alignItems: 'center',
              }}
            >
              <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Navigate</Text>
            </Pressable>
            {!found && (
              <Pressable
                onPress={() => setLogOpen(o => !o)}
                style={{
                  flex: 1,
                  backgroundColor: t.colors.actionPrimary,
                  padding: t.spacing.s4,
                  borderRadius: t.radii.sm,
                  alignItems: 'center',
                }}
              >
                <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>+ Log find</Text>
              </Pressable>
            )}
          </View>

          {/* Log find sheet (inline, shown when amber button pressed) */}
          {!found && logOpen && (
            <LogFindSheet sightId={sight.id} onLogged={reload} />
          )}

          {/* Find hint */}
          {sight.hint && (
            <Pressable
              testID="hint-toggle"
              onPress={() => setHintOpen(o => !o)}
              style={{
                backgroundColor: t.colors.amberDim,
                borderRadius: t.radii.md,
                borderWidth: 1,
                borderColor: t.colors.amberLine,
                padding: t.spacing.s4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s2 }}>
                <Text style={[t.type.label, { color: t.colors.amber, flex: 1 }]}>FIND HINT</Text>
                <Text style={[t.type.label, { color: t.colors.amber }]}>{hintOpen ? '▾' : '▸'}</Text>
              </View>
              {hintOpen && (
                <Text style={[t.type.body, { color: t.colors.text2, marginTop: t.spacing.s3 }]}>
                  {sight.hint}
                </Text>
              )}
            </Pressable>
          )}

          {/* About */}
          {sight.about && (
            <View>
              <Text style={[t.type.h2, { color: t.colors.text1, marginBottom: t.spacing.s3 }]}>About</Text>
              <Text style={[t.type.body, { color: t.colors.text2 }]}>{sight.about}</Text>
            </View>
          )}

          {/* Your photos (found only) */}
          {found && <YourPhotos sightId={sight.id} />}

          {/* Recent finds */}
          {recentFinds.length > 0 && (
            <View>
              <Text style={[t.type.label, { color: t.colors.text3, marginBottom: t.spacing.s2 }]}>Recent finds</Text>
              {recentFinds.map(f => (
                <Text key={f.id} style={[t.type.body, { color: t.colors.text2 }]}>{f.comment ?? 'Found!'}</Text>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </Screen>
  );
}
