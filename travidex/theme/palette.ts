/**
 * Travidex color palettes — generated 1:1 from design/Travidex/tokens/colors.css.
 *
 * LIGHT is the default theme. DARK is the premium (Travidex+) opt-in.
 * Both palettes expose the IDENTICAL set of keys — components read a key and
 * never branch on the active theme. Accents carry fixed semantics:
 *   green = found/claimed/success · amber = in-progress + Log/Find action
 *   blue  = personal/info · locked = unseen/disabled
 */

export type ColorTokens = {
  // Surfaces
  bg: string; surface1: string; surface2: string; surface3: string; surface4: string;
  surfaceOverlay: string; surfaceScrim: string;
  // Borders
  borderSubtle: string; borderDefault: string; borderStrong: string; divider: string;
  // Text
  text1: string; text2: string; text3: string; textDisabled: string; textOnAccent: string;
  // Green
  green: string; greenBright: string; greenDeep: string; greenDim: string; greenLine: string; greenGlow: string;
  // Amber
  amber: string; amberBright: string; amberDeep: string; amberDim: string; amberLine: string; amberGlow: string;
  // Blue
  blue: string; blueBright: string; blueDeep: string; blueDim: string; blueLine: string;
  // Locked / destructive
  locked: string; lockedText: string; danger: string; dangerDim: string;
  // Map
  mapLand: string; mapLand2: string; mapWater: string; mapGreen: string; mapRoad: string; mapRoadHi: string;
  // Wash / art / photo placeholder
  wash1: string; wash2: string; artVeil: string; phStripe: string; phBase: string;
  // Semantic aliases (resolved from the accent vars above)
  found: string; foundBg: string; progress: string; progressBg: string; info: string; infoBg: string;
  actionPrimary: string; actionPrimaryPress: string; actionPositive: string;
  pinFound: string; pinUnseen: string; pinSelected: string;
  chunkClaimed: string; chunkProgress: string; chunkUntouched: string;
};

export const lightColors: ColorTokens = {
  bg: '#eceef3', surface1: '#ffffff', surface2: '#f2f4f8', surface3: '#e7eaf1', surface4: '#ffffff',
  surfaceOverlay: 'rgba(255,255,255,0.74)', surfaceScrim: 'rgba(18,22,30,0.42)',

  borderSubtle: 'rgba(22,30,48,0.07)', borderDefault: 'rgba(22,30,48,0.12)', borderStrong: 'rgba(22,30,48,0.20)', divider: 'rgba(22,30,48,0.08)',

  text1: '#161a21', text2: '#525b69', text3: '#838b99', textDisabled: '#b0b6c1', textOnAccent: '#ffffff',

  green: '#1f9d57', greenBright: '#27b566', greenDeep: '#15663b', greenDim: 'rgba(31,157,87,0.12)', greenLine: 'rgba(31,157,87,0.30)', greenGlow: 'rgba(31,157,87,0.22)',
  amber: '#bd7d12', amberBright: '#e0a23c', amberDeep: '#8f5e0e', amberDim: 'rgba(189,125,18,0.13)', amberLine: 'rgba(189,125,18,0.34)', amberGlow: 'rgba(189,125,18,0.22)',
  blue: '#2f6fe0', blueBright: '#5187e8', blueDeep: '#1d4fac', blueDim: 'rgba(47,111,224,0.11)', blueLine: 'rgba(47,111,224,0.30)',

  locked: '#aab2c0', lockedText: '#838b99', danger: '#d83a3a', dangerDim: 'rgba(216,58,58,0.12)',

  mapLand: '#e9ebe4', mapLand2: '#dfe2da', mapWater: 'rgba(150,195,230,0.55)', mapGreen: 'rgba(120,180,130,0.30)', mapRoad: 'rgba(255,255,255,0.90)', mapRoadHi: 'rgba(189,125,18,0.40)',

  wash1: '#dff0e6', wash2: '#eceef3', artVeil: 'rgba(236,238,243,0.62)', phStripe: 'rgba(22,30,48,0.05)', phBase: '#f2f4f8',

  found: '#1f9d57', foundBg: 'rgba(31,157,87,0.12)', progress: '#bd7d12', progressBg: 'rgba(189,125,18,0.13)', info: '#2f6fe0', infoBg: 'rgba(47,111,224,0.11)',
  actionPrimary: '#bd7d12', actionPrimaryPress: '#8f5e0e', actionPositive: '#1f9d57',
  pinFound: '#1f9d57', pinUnseen: '#aab2c0', pinSelected: '#bd7d12',
  chunkClaimed: '#1f9d57', chunkProgress: '#bd7d12', chunkUntouched: '#aab2c0',
};

export const darkColors: ColorTokens = {
  bg: '#0d0f14', surface1: '#12151c', surface2: '#1a1d24', surface3: '#21252f', surface4: '#2a2f3a',
  surfaceOverlay: 'rgba(16,19,26,0.66)', surfaceScrim: 'rgba(7,9,13,0.60)',

  borderSubtle: 'rgba(255,255,255,0.06)', borderDefault: 'rgba(255,255,255,0.10)', borderStrong: 'rgba(255,255,255,0.16)', divider: 'rgba(255,255,255,0.07)',

  text1: '#f3f6fb', text2: '#a6b0c0', text3: '#717b8b', textDisabled: '#49515f', textOnAccent: '#0d0f14',

  green: '#4ade80', greenBright: '#6ef0a0', greenDeep: '#2e8b57', greenDim: 'rgba(74,222,128,0.16)', greenLine: 'rgba(74,222,128,0.40)', greenGlow: 'rgba(74,222,128,0.45)',
  amber: '#e0a23c', amberBright: '#f4b850', amberDeep: '#c9882b', amberDim: 'rgba(224,162,60,0.16)', amberLine: 'rgba(224,162,60,0.40)', amberGlow: 'rgba(224,162,60,0.45)',
  blue: '#8fb6ff', blueBright: '#aecbff', blueDeep: '#5b7fd6', blueDim: 'rgba(143,182,255,0.16)', blueLine: 'rgba(143,182,255,0.40)',

  locked: '#3a4150', lockedText: '#717b8b', danger: '#ff6b6b', dangerDim: 'rgba(255,107,107,0.16)',

  mapLand: '#11161f', mapLand2: '#18202c', mapWater: 'rgba(40,70,110,0.45)', mapGreen: 'rgba(46,90,70,0.28)', mapRoad: 'rgba(255,255,255,0.08)', mapRoadHi: 'rgba(224,162,60,0.18)',

  wash1: '#16241c', wash2: '#0d0f14', artVeil: 'rgba(13,15,20,0.66)', phStripe: 'rgba(255,255,255,0.035)', phBase: '#1a1d24',

  found: '#4ade80', foundBg: 'rgba(74,222,128,0.16)', progress: '#e0a23c', progressBg: 'rgba(224,162,60,0.16)', info: '#8fb6ff', infoBg: 'rgba(143,182,255,0.16)',
  actionPrimary: '#e0a23c', actionPrimaryPress: '#c9882b', actionPositive: '#4ade80',
  pinFound: '#4ade80', pinUnseen: '#3a4150', pinSelected: '#e0a23c',
  chunkClaimed: '#4ade80', chunkProgress: '#e0a23c', chunkUntouched: '#3a4150',
};
