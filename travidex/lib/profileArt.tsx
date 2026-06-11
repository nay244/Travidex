// Profile background art. Add art: copy an entry, rename, set unlock + draw tokens.
import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import type { Stats } from './stats';

export type ProfileArt = {
  id: string;         // 'trailhead' | 'tileman' | 'aurora' | 'passport' | 'topographic' | 'summit'
  label: string;
  unlock: string;     // human copy for locked state
  test: (s: Stats) => boolean;
  progress: (s: Stats) => { value: number; goal: number };
  Art: (props: { style?: ViewStyle }) => ReactElement;
};

// ─── Individual art renderers ─────────────────────────────────────────────────

function TrailheadArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View style={[{ overflow: 'hidden' }, style]} pointerEvents="none">
      {/* Map-land background */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: t.colors.mapLand }} />
      <View style={{ position: 'absolute', inset: 0, backgroundColor: t.colors.mapLand2, opacity: 0.5 }} />
      {/* Road lines approximated as thin rotated views */}
      <View style={{ position: 'absolute', height: 2, width: '120%', backgroundColor: t.colors.mapRoad, top: '55%', left: '-10%', transform: [{ rotate: '-3deg' }] }} />
      <View style={{ position: 'absolute', height: 2, width: '60%', backgroundColor: t.colors.mapRoad, top: '30%', left: '20%', transform: [{ rotate: '75deg' }, { translateY: -20 }] }} />
      <View style={{ position: 'absolute', height: 2.5, width: '50%', backgroundColor: t.colors.mapRoadHi, top: '40%', left: '30%', transform: [{ rotate: '25deg' }] }} />
      {/* Green found-pin dot */}
      <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: t.colors.green, left: '20%', top: '44%' }} />
      {/* Locked/grey pin dot */}
      <View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: t.colors.locked, left: '60%', top: '30%' }} />
    </View>
  );
}

function TilemanArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  // 7-col × 3-row grid; indices 3,9,10,16 = green cells; 5,12 = amber cells
  const greenIdx = new Set([3, 9, 10, 16]);
  const amberIdx = new Set([5, 12]);
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: t.colors.surface3 }, style]} pointerEvents="none">
      <View style={{ position: 'absolute', inset: 6, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
        {Array.from({ length: 21 }).map((_, i) => {
          const isGreen = greenIdx.has(i);
          const isAmber = amberIdx.has(i);
          return (
            <View
              key={i}
              style={{
                width: '12%',
                aspectRatio: 1,
                borderRadius: 4,
                backgroundColor: isGreen
                  ? t.colors.greenDim
                  : isAmber
                  ? t.colors.amberDim
                  : t.colors.surface1,
                borderBottomWidth: isGreen ? 3 : isAmber ? 3 : 0,
                borderBottomColor: isGreen
                  ? t.colors.green
                  : isAmber
                  ? t.colors.amber
                  : 'transparent',
                borderWidth: isGreen || isAmber ? 0 : 1,
                borderColor: t.colors.borderSubtle,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function AuroraArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: t.colors.surface2 }, style]} pointerEvents="none">
      {/* Green glow blob top-left */}
      <View style={{ position: 'absolute', width: '90%', height: '160%', left: '-10%', top: '-60%', backgroundColor: t.colors.greenGlow, borderRadius: 999, opacity: 0.7 }} />
      {/* Amber glow blob top-right */}
      <View style={{ position: 'absolute', width: '70%', height: '140%', right: '-15%', top: '-40%', backgroundColor: t.colors.amberGlow, borderRadius: 999, opacity: 0.65 }} />
      {/* Subtle extra blue tint center */}
      <View style={{ position: 'absolute', width: '50%', height: '80%', left: '25%', top: '10%', backgroundColor: t.colors.blueDim, borderRadius: 999, opacity: 0.4 }} />
    </View>
  );
}

function PassportArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  // Dot grid: 5 cols × 4 rows
  const dots = Array.from({ length: 20 });
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: t.colors.surface2 }, style]} pointerEvents="none">
      {/* Dot grid */}
      <View style={{ position: 'absolute', inset: 0, flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 0 }}>
        {dots.map((_, i) => (
          <View key={i} style={{ width: '20%', height: '25%', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: t.colors.blueLine, opacity: 0.6 }} />
          </View>
        ))}
      </View>
      {/* Dashed border rectangle */}
      <View
        style={{
          position: 'absolute',
          inset: 10,
          borderWidth: 2,
          borderColor: t.colors.blueLine,
          borderRadius: 6,
          borderStyle: 'dashed',
        }}
      />
    </View>
  );
}

function TopographicArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  // Concentric rounded-rect rings — no SVG; use bordered Views of increasing size centered
  const rings = [0, 1, 2, 3, 4, 5];
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: t.colors.surface2, alignItems: 'center', justifyContent: 'center' }, style]} pointerEvents="none">
      {rings.map(i => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: 28 + i * 22,
            height: 18 + i * 14,
            borderRadius: 8 + i * 4,
            borderWidth: 1.5,
            borderColor: t.colors.greenLine,
            opacity: Math.max(0.2, 0.55 - i * 0.06),
          }}
        />
      ))}
    </View>
  );
}

function SummitArt({ style }: { style?: ViewStyle }) {
  const t = useTheme();
  // Mountain peaks via layered rotated squares (diamond shapes) clipped by container
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: t.colors.amberDim }, style]} pointerEvents="none">
      {/* Back peak — large rotated square */}
      <View
        style={{
          position: 'absolute',
          width: 70, height: 70,
          backgroundColor: t.colors.amberLine,
          transform: [{ rotate: '45deg' }],
          bottom: -30, left: '30%',
          opacity: 0.6,
        }}
      />
      {/* Left peak */}
      <View
        style={{
          position: 'absolute',
          width: 50, height: 50,
          backgroundColor: t.colors.amberLine,
          transform: [{ rotate: '45deg' }],
          bottom: -22, left: '8%',
          opacity: 0.45,
        }}
      />
      {/* Right peak */}
      <View
        style={{
          position: 'absolute',
          width: 44, height: 44,
          backgroundColor: t.colors.amber,
          transform: [{ rotate: '45deg' }],
          bottom: -18, right: '10%',
          opacity: 0.35,
        }}
      />
      {/* Horizon wash */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', backgroundColor: t.colors.surface2, opacity: 0.5 }} />
    </View>
  );
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export const PROFILE_ART: ProfileArt[] = [
  {
    id: 'trailhead',
    label: 'Trailhead',
    unlock: 'Starter design',
    test: () => true,
    progress: () => ({ value: 1, goal: 1 }),
    Art: TrailheadArt,
  },
  {
    id: 'tileman',
    label: 'Tileman',
    unlock: 'Claim 1 city',
    test: s => s.citiesClaimed >= 1,
    progress: s => ({ value: Math.min(s.citiesClaimed, 1), goal: 1 }),
    Art: TilemanArt,
  },
  {
    id: 'aurora',
    label: 'Aurora',
    unlock: 'Claim 2 cities',
    test: s => s.citiesClaimed >= 2,
    progress: s => ({ value: Math.min(s.citiesClaimed, 2), goal: 2 }),
    Art: AuroraArt,
  },
  {
    id: 'passport',
    label: 'Passport',
    unlock: 'Explore 3 countries',
    test: s => s.countriesExplored >= 3,
    progress: s => ({ value: Math.min(s.countriesExplored, 3), goal: 3 }),
    Art: PassportArt,
  },
  {
    id: 'topographic',
    label: 'Topographic',
    unlock: 'Claim 3 cities',
    test: s => s.citiesClaimed >= 3,
    progress: s => ({ value: Math.min(s.citiesClaimed, 3), goal: 3 }),
    Art: TopographicArt,
  },
  {
    id: 'summit',
    label: 'Summit',
    unlock: 'Find 100 sights',
    test: s => s.totalFinds >= 100,
    progress: s => ({ value: Math.min(s.totalFinds, 100), goal: 100 }),
    Art: SummitArt,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Looks up art by id; falls back to trailhead for unknown/legacy ids (e.g. old 'city-amber'). */
export function artById(id: string): ProfileArt {
  return PROFILE_ART.find(a => a.id === id) ?? PROFILE_ART[0];
}

/**
 * ArtSwatch — absolute-fill artwork renderer.
 * Used in the picker tiles and as the full-screen + 36px profile background.
 */
export function ArtSwatch({ art, style }: { art: ProfileArt; style?: ViewStyle }) {
  const fillStyle: ViewStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, ...style };
  return <art.Art style={fillStyle} />;
}
