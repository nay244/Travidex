import { View } from 'react-native';
import { useTheme } from '@/theme';

// Real-world flag colors below are intrinsic asset data (port of the design kit's
// flags.jsx) — exempt from the no-hardcoded-hex theme rule. Everything else themes.

type Spec =
  | ['v' | 'h', string[]]
  | ['vu' | 'hu', [string, number][]]
  | ['circle', string, string, number]
  | ['nordic', string, string]
  | ['nordic', string, string, string]
  | ['plus', string, string]
  | ['usa'];

const FLAGS: Record<string, { name: string; spec: Spec }> = {
  JP: { name: 'Japan',         spec: ['circle', '#ffffff', '#BC002D', 42] },
  BD: { name: 'Bangladesh',    spec: ['circle', '#006A4E', '#F42A41', 40] },
  FR: { name: 'France',        spec: ['v', ['#0055A4', '#ffffff', '#EF4135']] },
  IT: { name: 'Italy',         spec: ['v', ['#009246', '#ffffff', '#CE2B37']] },
  IE: { name: 'Ireland',       spec: ['v', ['#169B62', '#ffffff', '#FF883E']] },
  BE: { name: 'Belgium',       spec: ['v', ['#000000', '#FAE042', '#ED2939']] },
  RO: { name: 'Romania',       spec: ['v', ['#002B7F', '#FCD116', '#CE1126']] },
  DE: { name: 'Germany',       spec: ['h', ['#000000', '#DD0000', '#FFCE00']] },
  NL: { name: 'Netherlands',   spec: ['h', ['#AE1C28', '#ffffff', '#21468B']] },
  RU: { name: 'Russia',        spec: ['h', ['#ffffff', '#0039A6', '#D52B1E']] },
  HU: { name: 'Hungary',       spec: ['h', ['#CE2939', '#ffffff', '#477050']] },
  ID: { name: 'Indonesia',     spec: ['h', ['#FF0000', '#ffffff']] },
  PL: { name: 'Poland',        spec: ['h', ['#ffffff', '#DC143C']] },
  UA: { name: 'Ukraine',       spec: ['h', ['#0057B7', '#FFD700']] },
  AT: { name: 'Austria',       spec: ['h', ['#ED2939', '#ffffff', '#ED2939']] },
  LT: { name: 'Lithuania',     spec: ['h', ['#FDB913', '#006A44', '#C1272D']] },
  ES: { name: 'Spain',         spec: ['hu', [['#AA151B', 1], ['#F1BF00', 2], ['#AA151B', 1]]] },
  TH: { name: 'Thailand',      spec: ['hu', [['#A51931', 1], ['#F4F5F8', 1], ['#2D2A4A', 2], ['#F4F5F8', 1], ['#A51931', 1]]] },
  PT: { name: 'Portugal',      spec: ['vu', [['#006600', 2], ['#FF0000', 3]]] },
  SE: { name: 'Sweden',        spec: ['nordic', '#006AA7', '#FECC00'] },
  DK: { name: 'Denmark',       spec: ['nordic', '#C8102E', '#ffffff'] },
  FI: { name: 'Finland',       spec: ['nordic', '#ffffff', '#003580'] },
  NO: { name: 'Norway',        spec: ['nordic', '#BA0C2F', '#ffffff', '#00205B'] },
  CH: { name: 'Switzerland',   spec: ['plus', '#D52B1E', '#ffffff'] },
  US: { name: 'United States', spec: ['usa'] },
};

function Stripes({ dir, parts }: { dir: 'v' | 'h'; parts: [string, number][] }) {
  return (
    <View style={{ flex: 1, flexDirection: dir === 'v' ? 'row' : 'column' }}>
      {parts.map(([color, weight], i) => (
        <View key={i} style={{ flex: weight, backgroundColor: color }} />
      ))}
    </View>
  );
}

function FlagInner({ spec, size }: { spec: Spec; size: number }) {
  const kind = spec[0];
  if (kind === 'v' || kind === 'h') {
    return (
      <Stripes
        dir={kind}
        parts={(spec as ['v' | 'h', string[]])[1].map(c => [c, 1] as [string, number])}
      />
    );
  }
  if (kind === 'vu' || kind === 'hu') {
    return (
      <Stripes
        dir={kind === 'hu' ? 'h' : 'v'}
        parts={(spec as ['vu' | 'hu', [string, number][]])[1]}
      />
    );
  }
  if (kind === 'circle') {
    const [, bg, dot, pct] = spec as ['circle', string, string, number];
    const d = (size * pct) / 100;
    return (
      <View style={{ flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: dot }} />
      </View>
    );
  }
  if (kind === 'nordic') {
    const [, bg, cross, inner] = spec as ['nordic', string, string, string?];
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: '16%', backgroundColor: cross }} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: '42%', height: '16%', backgroundColor: cross }} />
        {inner ? (
          <>
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: '34%', width: '8%', backgroundColor: inner }} />
            <View style={{ position: 'absolute', left: 0, right: 0, top: '46%', height: '8%', backgroundColor: inner }} />
          </>
        ) : null}
      </View>
    );
  }
  if (kind === 'plus') {
    const [, bg, cross] = spec as ['plus', string, string];
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ position: 'absolute', top: '18%', bottom: '18%', left: '40%', width: '20%', backgroundColor: cross }} />
        <View style={{ position: 'absolute', left: '18%', right: '18%', top: '40%', height: '20%', backgroundColor: cross }} />
      </View>
    );
  }
  // usa: 13 stripes + canton (star dots are sub-pixel at pill sizes; omitted)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {Array.from({ length: 13 }, (_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? '#B22234' : '#ffffff' }} />
        ))}
      </View>
      <View style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '53.85%', backgroundColor: '#3C3B6E' }} />
    </View>
  );
}

export function Flag({ code, size, radius = 0 }: { code: string; size: number; radius?: number }) {
  const t = useTheme();
  const f = FLAGS[code];
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={f?.name ?? code}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', backgroundColor: t.colors.surface3 }}
    >
      {f ? <FlagInner spec={f.spec} size={size} /> : null}
    </View>
  );
}
