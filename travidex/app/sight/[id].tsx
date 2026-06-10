import { ScrollView, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme';
import { useSight } from '../../hooks/useSight';
import { LogFindSheet } from '../../components/LogFindSheet';
import { YourPhotos } from '../../components/YourPhotos';

export default function SightDetail() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sight, found, recentFinds, loading, reload } = useSight(id!);

  const [hintOpen, setHintOpen] = useState(false);

  if (loading || !sight) return <View style={{ flex: 1, backgroundColor: t.colors.bg }} />;

  const Stat = ({ label, value }: { label: string; value: string | null }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={[t.type.stat, { color: t.colors.text1 }]}>{value ?? '—'}</Text>
      <Text style={[t.type.label, { color: t.colors.text3 }]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {found ? (
        <View testID="hero-found" style={{ height: 160, backgroundColor: t.colors.foundBg, borderWidth: 1, borderColor: t.colors.green, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[t.type.dexNo, { color: t.colors.green }]}>#{sight.dex_no}</Text>
        </View>
      ) : (
        <View testID="hero-unfound" style={{ height: 160, backgroundColor: 'transparent', borderWidth: 1, borderColor: t.colors.locked, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[t.type.dexNo, { color: t.colors.text3 }]}>#{sight.dex_no}</Text>
        </View>
      )}
      <View style={{ padding: t.spacing.s5, gap: t.spacing.s4 }}>
        <Text style={[t.type.h1, { color: t.colors.text1 }]}>{sight.name}</Text>
        <Text style={[t.type.caption, { color: t.colors.info }]}>{sight.type_tags.join(' · ')}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: t.spacing.s3 }}>
          <Stat label="Access" value={sight.access} />
          <Stat label="Size" value={sight.size} />
          <Stat label="Busyness" value={sight.busyness} />
        </View>

        <View style={{ flexDirection: 'row', gap: t.spacing.s3 }}>
          <Pressable onPress={() => router.push(`/sight/${sight.id}/navigate`)} style={{ flex: 1, backgroundColor: t.colors.actionPositive, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
            <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Navigate</Text>
          </Pressable>
        </View>

        {!found && <LogFindSheet sightId={sight.id} onLogged={reload} />}

        {sight.hint && (
          <View>
            <Pressable testID="hint-toggle" onPress={() => setHintOpen(o => !o)} style={{ flexDirection: 'row', gap: t.spacing.s2 }}>
              <Text style={[t.type.label, { color: t.colors.text2 }]}>Find hint {hintOpen ? '▾' : '▸'}</Text>
            </Pressable>
            {hintOpen && <Text style={[t.type.body, { color: t.colors.text2 }]}>{sight.hint}</Text>}
          </View>
        )}
        {sight.about && <Text style={[t.type.body, { color: t.colors.text2 }]}>{sight.about}</Text>}

        {found && <YourPhotos sightId={sight.id} />}

        <Text style={[t.type.label, { color: t.colors.text3 }]}>Recent finds</Text>
        {recentFinds.map(f => (
          <Text key={f.id} style={[t.type.body, { color: t.colors.text2 }]}>{f.comment ?? 'Found!'}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
