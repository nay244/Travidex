import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { useCityCatalog } from '../../hooks/useCityCatalog';
import { useActiveCity } from '../../hooks/useActiveCity';
import { getUserPhotos } from '../../lib/data/photos';
import type { UserPhoto } from '../../lib/data/photos';
import { Flag } from '../../components/Flag';

// "Share to friends" deferred until the friends feed supports posts (see plan 7.6)

function monthYear(): string {
  const d = new Date();
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

type PhotoWithDex = UserPhoto & { dex_no: number };

export default function RegionHighlights() {
  const t = useTheme();
  const router = useRouter();
  const { cityId } = useLocalSearchParams<{ cityId: string }>();
  const { session } = useAuth();
  const uid = session?.user?.id ?? '';

  const { sights, completion } = useCityCatalog(cityId!);
  const { city } = useActiveCity(cityId!);

  const [allPhotos, setAllPhotos] = useState<PhotoWithDex[]>([]);
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [shareError, setShareError] = useState<string | null>(null);

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

  async function handleShare() {
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
      <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ padding: t.spacing.s4 }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[t.type.body, { color: t.colors.text2 }]}>← Back</Text>
          </Pressable>
        </View>
        <View
          testID="highlights-empty"
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing.s9 }}
        >
          <Text style={[t.type.body, { color: t.colors.text3, textAlign: 'center', lineHeight: 22 }]}>
            {`Find a sight in ${cityName} and add photos to build your highlights.`}
          </Text>
        </View>
      </View>
    );
  }

  // ── Mosaic layout helpers ──
  // First selected photo spans 2×2 (rendered as: first photo at 2/3 width + right
  // column with 2 photos; then remaining photos in 3-col rows below)
  const firstPhoto = selected[0];
  const nextTwo = selected.slice(1, 3);
  const remainingPhotos = selected.slice(3);
  // Group remaining into rows of 3
  const remainingRows: PhotoWithDex[][] = [];
  for (let i = 0; i < remainingPhotos.length; i += 3) {
    remainingRows.push(remainingPhotos.slice(i, i + 3));
  }

  const shareDisabled = selected.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
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
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[t.type.body, { color: t.colors.text2 }]}>← Back</Text>
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
        contentContainerStyle={{ padding: t.spacing.s5, paddingBottom: 120 }}
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
                    {/* Hero photo — 2/3 width */}
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

            {/* Top scrim + header strip */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                paddingHorizontal: t.spacing.s4,
                paddingTop: t.spacing.s3,
                paddingBottom: t.spacing.s4,
                backgroundColor: t.colors.surfaceScrim,
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing.s2,
              }}
            >
              {countryCode ? <Flag code={countryCode} size={18} radius={4} /> : null}
              <Text
                style={[
                  t.type.h3,
                  { color: '#f3f6fb', flex: 1 },
                ]}
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

            {/* Bottom scrim + footer strip */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: t.spacing.s4,
                paddingTop: t.spacing.s3,
                paddingBottom: t.spacing.s3,
                backgroundColor: t.colors.surfaceScrim,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  t.type.h3,
                  { color: '#f3f6fb' },
                ]}
              >
                {'Travi'}
                <Text style={{ color: t.colors.green }}>{'dex'}</Text>
              </Text>
              <Text
                style={[
                  t.type.label,
                  {
                    color: 'rgba(243,246,251,0.8)',
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
                {/* Check badge for selected */}
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
                {/* Dex label */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    left: 4,
                    right: 4,
                  }}
                >
                  <Text
                    style={[
                      t.type.label,
                      {
                        color: t.colors.text3,
                        fontSize: 8,
                        letterSpacing: 0.5,
                      },
                    ]}
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

      {/* ── Share action pinned bottom ── */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: t.spacing.s5,
          paddingTop: t.spacing.s4,
          paddingBottom: t.spacing.s8,
          backgroundColor: t.colors.bg,
          borderTopWidth: 1,
          borderTopColor: t.colors.borderSubtle,
        }}
      >
        <Pressable
          testID="share-btn"
          onPress={handleShare}
          disabled={shareDisabled}
          style={{
            backgroundColor: shareDisabled ? t.colors.locked : t.colors.actionPositive,
            paddingVertical: t.spacing.s4,
            borderRadius: t.radii.sm,
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              t.type.h3,
              {
                color: shareDisabled ? t.colors.lockedText : t.colors.textOnAccent,
              },
            ]}
          >
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
