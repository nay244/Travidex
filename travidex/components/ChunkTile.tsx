import { Pressable, Text } from 'react-native';
import { useTheme } from '@/theme';
import { progressState } from '../lib/claim';

export function ChunkTile({ name, found, total, onPress }: { name: string; found: number; total: number; onPress: () => void }) {
  const t = useTheme();
  const state = progressState(found, total);
  // found/unfound spine: an untouched chunk is HOLLOW (transparent fill), not dimmed
  const fill = state === 'claimed' ? t.colors.foundBg : state === 'in-progress' ? t.colors.progressBg : 'transparent';
  const border = state === 'claimed' ? t.colors.chunkClaimed : state === 'in-progress' ? t.colors.chunkProgress : t.colors.chunkUntouched;
  return (
    <Pressable onPress={onPress} style={{ width: 96, height: 80, margin: t.spacing.s2, borderRadius: t.radii.sm, borderWidth: 1.5, borderColor: border, backgroundColor: fill, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[t.type.h3, { color: t.colors.text1 }]}>{name}</Text>
      <Text style={[t.type.monoSm, { color: t.colors.text2 }]}>{`${found}/${total}`}</Text>
      {state === 'claimed' && <Text testID="claimed" style={[t.type.label, { color: t.colors.green }]}>✓ claimed</Text>}
    </Pressable>
  );
}
