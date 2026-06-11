import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/Screen';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { useEntitlement } from '../../context/EntitlementProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { getUserPhotos } from '../../lib/data/photos';
import type { UserPhoto } from '../../lib/data/photos';
import { Flag } from '../../components/Flag';

// Highlight-card frames. Add a frame: copy a line, rename, pick tokens. premium: true gates it behind Travidex+.
type Frame = { id: string; label: string; premium: boolean; borderColor: string | null; footerColor: string };
const FRAMES: Frame[] = [
  { id: 'classic', label: 'Classic', premium: false, borderColor: null,        footerColor: '#f3f6fb' },
  { id: 'gold',    label: 'Gold',    premium: true,  borderColor: 'amber',     footerColor: 'amber'  },
  { id: 'forest',  label: 'Forest',  premium: true,  borderColor: 'green',     footerColor: 'green'  },
];

// "Share to friends" deferred until the friends feed supports posts (see plan 7.6)

function monthYear(): string {
  const d = new Date();
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

type PhotoWithDex = UserPhoto & { dex_no: number };

// Share destinations — each routes via the system share sheet (expo-sharing).
// Direct Messages/Stories/Photos integrations are deferred (no clipboard dep for Copy link).
const SHARE_DESTINATIONS = [
  { id: 'save',     label: 'Save image' },
  { id: 'messages', label: 'Messages'   },
  { id: 'stories',  label: 'Stories'    },
  { id: 'copy',     label: 'Copy link'  }, // disabled — no clipboard dep
] as const;

export default function RegionHighlights() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useLocalSearchParams<{ cityId: string }>();
  const { session } = useAuth();
  const uid = session?.user?.id ?? '';
  const { isPremium } = useEntitlement();

  const { sights, completion } = useCityCatalog(cityId!);
  const { city } = useActiveCity(cityId!);

  const [allPhotos, setAllPhotos] = useState<PhotoWithDex[]>([]);
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [shareError, setShareError] = useState<string | null>(null);
  const [frameId, setFrameId] = useState('classic');
  const [destRowOpen, setDestRowOpen] = useState(false);

  function chooseFrame(f: Frame) {
    // premium gate — copy this pattern for new Travidex+ features
    if (f.premium && !isPremium) { router.push('/paywall'); return; }
    setFrameId(f.id);
  }

  const activeFrame = FRAMES.find(f => f.id === frameId) ?? FRAMES[0];
  // Resolve token names to actual color values at render time
  const frameBorderColor = activeFrame.borderColor
    ? t.colors[activeFrame.borderColor as keyof typeof t.colors] as string
    : null;
  const frameFooterColor = activeFrame.footerColor.startsWith('#')
    ? activeFrame.footerColor
    : t.colors[activeFrame.footerColor as keyof typeof t.colors] as string;

  const viewShotRef = useRef<View>(null);

  // Load user photos filtered to found sights in this city
  useEffect(() => {
    if (!uid) return;
    const foundIds = new Set(sights.filter(s => s.found).map(s => s.id));
    if (foundIds.size === 0) { setAllPhotos([]); return; }
    getUserPhotos(uid)
      .then(photos => {
        const eligible: PhotoWithDex[] = photos
          .filter(p => foundIds.has(p.sight_id))
          .map(p => {
            const sight = sights.find(s => s.id === p.sight_id);
            return { ...p, dex_no: sight?.dex_no ?? 0 };
          });
        setAllPhotos(eligible);
      })
      .catch(err => console.warn('Failed to load user photos', err));
  }, [uid, sights]);

  const selected = allPhotos.filter(p => !excluded[p.id]);
  const foundSights = sights.filter(s => s.found);
  const hasContent = foundSights.length > 0 && allPhotos.length > 0;

  function togglePhoto(id: string) {
    setExcluded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleShareCapture() {
    if (selected.length === 0) return;
    try {
      const uri = await captureRef(viewShotRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.warn('Share failed', err);
      setShareError('Share failed. Please try again.');
    }
  }

  const cityName = city?.name ?? '…';
  const countryCode = city?.country_code ?? '';
  const my = monthYear();

  // ── Empty state ──
  if (!hasContent) {
    return (
      <Screen>
        <View style={{ padding: t.spacing.s4 }}>
          <Pressable testID="back-btn" onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
          </Pressable>
        </View>
        <View
          testID="highlights-empty"
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing.s9, gap: t.spacing.s4 }}
        >
          {/* Sparkles chip */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: t.colors.amberDim,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="sparkles" size={22} color={t.colors.amber} />
          </View>
          <Text style={[t.type.h3, { color: t.colors.text1, textAlign: 'center' }]}>
            No highlights yet
          </Text>
          <Text style={[t.type.body, { color: t.colors.text3, textAlign: 'center', lineHeight: 22 }]}>
            {`Find a sight in ${cityName} and add photos — they'll come together here.`}
          </Text>
        </View>
      </Screen>
    );
  }

  // ── Mosaic layout helpers ──
  // Card shows up to 9 tiles; if more than 9 photos are selected only the first 9 appear.
  const cardPhotos = selected.slice(0, 9);
  const firstPhoto = cardPhotos[0];
  const nextTwo = cardPhotos.slice(1, 3);
  const remainingPhotos = cardPhotos.slice(3);
  // Group remaining into rows of 3
  const remainingRows: PhotoWithDex[][] = [];
  for (let i = 0; i < remainingPhotos.length; i += 3) {
    remainingRows.push(remainingPhotos.slice(i, i + 3));
  }

  const shareDisabled = selected.length === 0;

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: t.spacing.s5,
          paddingTop: t.spacing.s5,
          paddingBottom: t.spacing.s3,
        }}
      >
        <Pressable testID="back-btn" onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
        </Pressable>
        <Text
          style={[
            t.type.h3,
            { color: t.colors.text1, flex: 1, textAlign: 'center' },
          ]}
        >
          Region highlights
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: t.spacing.s5, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Highlight card ── */}
        <ViewShot
          ref={viewShotRef as any}
          options={{ format: 'png', quality: 1 }}
        >
          <View
            testID="highlight-card"
            style={{
              width: '100%',
              aspectRatio: 4 / 5,
              borderRadius: t.radii.lg,
              overflow: 'hidden',
              backgroundColor: t.colors.surface1,
              borderWidth: frameBorderColor ? 2 : 0,
              borderColor: frameBorderColor ?? undefined,
            }}
          >
            {shareDisabled ? (
              <View
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[t.type.caption, { color: t.colors.text3 }]}>
                  Select at least one photo
                </Text>
              </View>
            ) : (
              <>
                {/* Photo mosaic */}
                <View style={{ flex: 1 }}>
                  {/* Top row: hero (2/3) + right column (1/3) */}
                  <View style={{ flexDirection: 'row', flex: 2 }}>
                    {/* Hero photo — 2×2 span */}
                    <View style={{ flex: 2 }}>
                      <Image
                        source={{ uri: firstPhoto.photo_url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </View>
                    {/* Right column — 1/3 width, two stacked photos */}
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      {nextTwo.map((p, i) => (
                        <View key={p.id} style={{ flex: 1 }}>
                          <Image
                            source={{ uri: p.photo_url }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                          {i === 0 && (
                            <View
                              style={{
                                position: 'absolute',
                                inset: 0,
                                borderTopWidth: 0,
                                borderBottomWidth: 1.5,
                                borderColor: t.colors.bg,
                              }}
                            />
                          )}
                        </View>
                      ))}
                      {/* Placeholder cells if fewer than 2 next photos */}
                      {nextTwo.length < 2 &&
                        Array.from({ length: 2 - nextTwo.length }).map((_, i) => (
                          <View
                            key={`ph-${i}`}
                            style={{ flex: 1, backgroundColor: t.colors.surface2 }}
                          />
                        ))}
                    </View>
                  </View>
                  {/* Remaining rows: 3-col grid */}
                  {remainingRows.map((row, ri) => (
                    <View key={ri} style={{ flexDirection: 'row', flex: 1 }}>
                      {row.map(p => (
                        <View key={p.id} style={{ flex: 1 }}>
                          <Image
                            source={{ uri: p.photo_url }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                      {/* Fill partial rows */}
                      {row.length < 3 &&
                        Array.from({ length: 3 - row.length }).map((_, i) => (
                          <View
                            key={`fill-${i}`}
                            style={{ flex: 1, backgroundColor: t.colors.surface2 }}
                          />
                        ))}
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Top gradient scrim + header strip */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                paddingHorizontal: t.spacing.s4,
                paddingTop: t.spacing.s3,
                paddingBottom: t.spacing.s5,
                // Gradient approximated with stacked translucent scrim (linear-gradient is a native dep)
                backgroundColor: 'rgba(10,12,16,0.52)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing.s2,
              }}
            >
              {countryCode ? <Flag code={countryCode} size={18} radius={4} /> : null}
              <Text
                style={{
                  fontFamily: t.fontFamily.sansBold,
                  fontSize: 18,
                  color: '#f3f6fb',
                  flex: 1,
                  letterSpacing: -0.01 * 18,
                }}
                numberOfLines={1}
              >
                {cityName}
              </Text>
              <Text
                style={[
                  t.type.label,
                  { color: 'rgba(243,246,251,0.75)', fontSize: 9 },
                ]}
              >
                MY HIGHLIGHTS
              </Text>
            </View>

            {/* Bottom gradient scrim + footer strip */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: t.spacing.s4,
                paddingTop: t.spacing.s4,
                paddingBottom: t.spacing.s3,
                backgroundColor: 'rgba(10,12,16,0.72)',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* Travidex wordmark: "Travi" in footer color, "dex" in green */}
              <Text
                style={{
                  fontFamily: t.fontFamily.sansBold,
                  fontSize: 13,
                  color: frameFooterColor,
                }}
              >
                {'Travi'}
                <Text style={{ color: t.colors.green }}>{'dex'}</Text>
              </Text>
              <Text
                style={[
                  t.type.label,
                  {
                    color: 'rgba(243,246,251,0.80)',
                    fontSize: 9,
                    marginLeft: 'auto',
                    letterSpacing: 1,
                  },
                ]}
              >
                {`${completion.found}/${completion.total} SIGHTS · ${my}`}
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* ── Frame selector ── */}
        <View
          style={{
            flexDirection: 'row',
            gap: t.spacing.s2,
            marginTop: t.spacing.s4,
          }}
        >
          {FRAMES.map(f => {
            const isActive = f.id === frameId;
            return (
              <Pressable
                key={f.id}
                testID={`frame-${f.id}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => chooseFrame(f)}
                style={{
                  paddingHorizontal: t.spacing.s4,
                  paddingVertical: t.spacing.s2,
                  borderRadius: t.radii.sm,
                  backgroundColor: isActive ? t.colors.amber : t.colors.surface2,
                  borderWidth: 1,
                  borderColor: isActive ? t.colors.amber : t.colors.borderSubtle,
                }}
              >
                <Text style={[t.type.label, { color: isActive ? t.colors.textOnAccent : t.colors.text1 }]}>
                  {f.label}
                </Text>
                {f.premium && !isPremium && (
                  <Text style={[t.type.label, { color: isActive ? t.colors.textOnAccent : t.colors.text3, fontSize: 8 }]}>
                    Travidex+
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* ── Photo selection grid ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: t.spacing.s6,
            marginBottom: t.spacing.s3,
          }}
        >
          <Text style={[t.type.h3, { color: t.colors.text1 }]}>Your photos</Text>
          <Text style={[t.type.label, { color: t.colors.text3 }]}>
            {`${selected.length} OF ${allPhotos.length} SELECTED`}
          </Text>
        </View>

        {/* 4-column grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.s2 }}>
          {allPhotos.map(p => {
            const isExcluded = !!excluded[p.id];
            return (
              <Pressable
                key={p.id}
                testID={`select-${p.id}`}
                onPress={() => togglePhoto(p.id)}
                style={({ pressed }) => ({
                  width: '23%',
                  aspectRatio: 1,
                  borderRadius: t.radii.sm,
                  overflow: 'hidden',
                  borderWidth: isExcluded ? 1 : 2,
                  borderColor: isExcluded ? t.colors.borderSubtle : t.colors.green,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Image
                  source={{ uri: p.photo_url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                {/* Scrim overlay for excluded photos */}
                {isExcluded && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: t.colors.surfaceScrim,
                    }}
                  />
                )}
                {/* Check dot — top-right, selected only */}
                {!isExcluded && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: t.colors.green,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 8, color: t.colors.textOnAccent }}>✓</Text>
                  </View>
                )}
                {/* Dex-# label — bottom-left, micro mono on a tiny scrim chip */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    left: 4,
                    backgroundColor: 'rgba(10,12,16,0.55)',
                    borderRadius: 3,
                    paddingHorizontal: 3,
                    paddingVertical: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: t.fontFamily.monoRegular,
                      fontSize: 8,
                      letterSpacing: 0.5,
                      color: 'rgba(243,246,251,0.85)',
                    }}
                    numberOfLines={1}
                  >
                    {`#${String(p.dex_no).padStart(3, '0')}`}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {shareError && (
          <Text
            style={[t.type.caption, { color: t.colors.danger, marginTop: t.spacing.s3, textAlign: 'center' }]}
          >
            {shareError}
          </Text>
        )}
      </ScrollView>

      {/* ── Share actions pinned bottom — gradient fade over content ── */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
        pointerEvents="box-none"
      >
        {/* Gradient fade layer (translucent bg stacked views approximate linear-gradient to top) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: t.colors.bg,
            opacity: 0,
          }}
        />
        {/* Content area with padding */}
        <View
          style={{
            paddingHorizontal: t.spacing.s5,
            paddingTop: t.spacing.s3,
            paddingBottom: t.spacing.s8,
            // Three-stop gradient approximation (no native dep): transparent → bg
            backgroundColor: t.colors.bg,
          }}
        >
          {/* Destination row — shown when destRowOpen */}
          {destRowOpen && (
            <View
              testID="dest-row"
              style={{
                flexDirection: 'row',
                gap: t.spacing.s2,
                marginBottom: t.spacing.s3,
              }}
            >
              {SHARE_DESTINATIONS.map(dest => {
                const isCopyLink = dest.id === 'copy';
                return (
                  <Pressable
                    key={dest.id}
                    testID={`dest-${dest.id}`}
                    disabled={isCopyLink || shareDisabled}
                    onPress={() => {
                      if (!isCopyLink) handleShareCapture();
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: t.spacing.s3,
                      borderRadius: t.radii.md,
                      backgroundColor: t.colors.surface2,
                      borderWidth: 1,
                      borderColor: t.colors.borderSubtle,
                      opacity: isCopyLink ? 0.4 : 1,
                    }}
                  >
                    <Text
                      style={[
                        t.type.caption,
                        {
                          color: isCopyLink ? t.colors.textDisabled : t.colors.text2,
                          textAlign: 'center',
                          fontSize: 10,
                        },
                      ]}
                    >
                      {dest.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Primary action row */}
          <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
            {/* Share to friends — deferred until friends feed supports posts (see plan 7.6) */}
            <Pressable
              disabled
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: t.spacing.s2,
                backgroundColor: t.colors.actionPositive,
                paddingVertical: t.spacing.s4,
                borderRadius: t.radii.pill,
                opacity: 0.45,
              }}
              accessibilityState={{ disabled: true }}
            >
              <Ionicons name="people" size={16} color={t.colors.textOnAccent} />
              <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>Share to friends</Text>
            </Pressable>

            {/* Share elsewhere — toggles destination row */}
            <Pressable
              testID="share-btn"
              onPress={() => {
                if (!shareDisabled) setDestRowOpen(o => !o);
              }}
              disabled={shareDisabled}
              accessibilityState={{ disabled: shareDisabled }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: t.spacing.s2,
                backgroundColor: t.colors.surface2,
                borderWidth: 1,
                borderColor: t.colors.borderDefault,
                paddingVertical: t.spacing.s4,
                borderRadius: t.radii.pill,
                opacity: shareDisabled ? 0.45 : 1,
              }}
            >
              <Ionicons name="share-outline" size={16} color={t.colors.text1} />
              <Text style={[t.type.h3, { color: t.colors.text1 }]}>Share elsewhere</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
