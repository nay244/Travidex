import { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { CompletionBar } from './CompletionBar';
import { SightRow } from './SightRow';
import { useTheme } from '@/theme';
import { filterSights, sortSights, completion } from '../lib/sightList';
import type { SightWithFind } from '../lib/types';

export function DexSheet({ cityName, sights, onSelect, selectedId, onSeeMore }: {
  cityName: string;
  sights: SightWithFind[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
  onSeeMore?: (id: string) => void;
}) {
  const t = useTheme();
  const [query, setQuery] = useState('');
  const { found, total } = completion(sights);
  const visible = sortSights(filterSights(sights, query), 'dex');
  return (
    <View style={{ flex: 1, padding: t.spacing.s4 }}>
      <CompletionBar label={cityName} found={found} total={total} />
      <TextInput
        placeholder="Search sights"
        placeholderTextColor={t.colors.text3}
        value={query}
        onChangeText={setQuery}
        style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s3, borderRadius: t.radii.sm, marginVertical: t.spacing.s3 }]}
      />
      <FlatList
        data={visible}
        keyExtractor={s => s.id}
        renderItem={({ item }) => (
          <SightRow
            sight={item}
            onPress={onSelect}
            selected={selectedId === item.id}
            onSeeMore={onSeeMore}
          />
        )}
      />
    </View>
  );
}
