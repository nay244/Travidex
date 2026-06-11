// Profile background art. Add art: copy an entry, rename, set unlock + draw tokens.
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import type { Stats } from './stats';

export type ProfileArt = {
  id: string;
  label: string;
  unlock: string;                      // human copy for locked state
  test: (s: Stats) => boolean;         // unlocked when true
  tones: [string, string];             // theme color token NAMES for the card wash, resolved via t.colors[...]
};

export const PROFILE_ART: ProfileArt[] = [
  { id: 'trailhead',  label: 'Trailhead',  unlock: 'Always unlocked',        test: () => true,                    tones: ['wash1', 'greenDim'] },
  { id: 'city-amber', label: 'City amber', unlock: 'Claim your first city',  test: s => s.citiesClaimed >= 1,     tones: ['wash2', 'amberDim'] },
  { id: 'wayfarer',   label: 'Wayfarer',   unlock: 'Explore 3 countries',    test: s => s.countriesExplored >= 3, tones: ['wash1', 'blueDim'] },
  { id: 'collector',  label: 'Collector',  unlock: 'Log 25 finds',           test: s => s.totalFinds >= 25,       tones: ['wash2', 'greenDim'] },
];

export function artById(id: string): ProfileArt {
  return PROFILE_ART.find(a => a.id === id) ?? PROFILE_ART[0];
}

/**
 * ArtSwatch — a rounded rect washed with the art's two tones.
 * Base tone fills the background; accent tone overlays a diagonal block.
 * Used both in the picker cards and as the profile header backdrop.
 */
export function ArtSwatch({ art, style }: { art: ProfileArt; style?: ViewStyle }) {
  const t = useTheme();
  const base = (t.colors as any)[art.tones[0]] as string;
  const accent = (t.colors as any)[art.tones[1]] as string;

  return (
    <View style={[{ overflow: 'hidden' }, style]} pointerEvents="none">
      {/* Base wash */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: base }} />
      {/* Diagonal accent block — a square rotated 45° placed top-right */}
      <View
        style={{
          position: 'absolute',
          width: '80%',
          aspectRatio: 1,
          backgroundColor: accent,
          top: '-40%',
          right: '-20%',
          transform: [{ rotate: '20deg' }],
          borderRadius: 12,
        }}
      />
    </View>
  );
}
