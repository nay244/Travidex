import { useState } from 'react';
import { FlatList, TextInput, Text, View } from 'react-native';
import { CompletionBar } from './CompletionBar';
import { SightRow } from './SightRow';
import { useTheme } from '@/theme';
import { filterSights, sortSights, completion } from '../lib/sightList';
import type { SightWithFind } from '../lib/types';

/**
 * DexSheet — bottom sheet listing sights for a city.
 *
 * Controlled search (new, for map overlay):
 *   query + onQueryChange → the search input becomes controlled; the sheet
 *   does NOT render its own TextInput in this mode.
 *
 * Uncontrolled search (existing behaviour for city/[id], find/pick, etc.):
 *   Neither prop provided → renders its own TextInput (same as before).
 *
 * Drag handle (map snap sheet):
 *   dragHandleProps → spread onto the grabber+header zone so map.tsx can
 *   attach its PanResponder without knowing DexSheet's internal layout.
 */
export function DexSheet({ cityName, sights, onSelect, selectedId, onSeeMore, query: externalQuery, onQueryChange, dragHandleProps }: {
  cityName: string;
  sights: SightWithFind[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
  onSeeMore?: (id: string) => void;
  /** Controlled search query. When provided the DexSheet's own input is hidden. */
  query?: string;
  /** Fires as the user types in the internal input; never fires in controlled mode (the input is hidden). */
  onQueryChange?: (q: string) => void;
  /** Spread onto the grabber+header container for drag-snap from map.tsx (optional, backward-compatible). */
  dragHandleProps?: object;
}) {
  const t = useTheme();
  const [internalQuery, setInternalQuery] = useState('');

  const isControlled = externalQuery !== undefined;
  const query = isControlled ? externalQuery : internalQuery;

  const { found, total } = completion(sights);
  const visible = sortSights(filterSights(sights, query), 'dex');

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.surface1, borderTopLeftRadius: t.radii.xl, borderTopRightRadius: t.radii.xl }}>
      {/* Grabber + header zone: dragHandleProps spreads here so map.tsx PanResponder attaches */}
      <View {...dragHandleProps} testID="dex-drag-handle">
        {/* Grabber pill */}
        <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: t.colors.borderStrong, alignSelf: 'center', marginTop: t.spacing.s3, marginBottom: t.spacing.s4 }} />

        {/* Header: city name (h2-weight) + "X / Y found" mono right-aligned */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: t.spacing.s5, marginBottom: t.spacing.s3 }}>
          <Text style={[t.type.h3, { color: t.colors.text1, fontFamily: t.fontFamily.sansBold, fontSize: t.fontSize.h2 }]}>{cityName}</Text>
          <Text style={[t.type.caption, { fontFamily: t.fontFamily.monoBold, letterSpacing: 0.04 * t.fontSize.caption }]}>
            <Text style={{ color: t.colors.amber }}>{found}</Text>
            <Text style={{ color: t.colors.text3 }}>{` / ${total} found`}</Text>
          </Text>
        </View>

        {/* CompletionBar: thin 7px progress bar, no label */}
        <View style={{ paddingHorizontal: t.spacing.s5, marginBottom: t.spacing.s3 }}>
          <CompletionBar found={found} total={total} />
        </View>
      </View>

      {/* Uncontrolled search input (only shown when not driven from the map overlay) */}
      {!isControlled && (
        <TextInput
          placeholder="Search sights"
          placeholderTextColor={t.colors.text3}
          value={internalQuery}
          onChangeText={text => {
            setInternalQuery(text);
            onQueryChange?.(text);
          }}
          style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s3, borderRadius: t.radii.sm, marginHorizontal: t.spacing.s5, marginBottom: t.spacing.s3 }]}
        />
      )}

      <FlatList
        data={visible}
        keyExtractor={s => s.id}
        contentContainerStyle={{ paddingHorizontal: t.spacing.s2 }}
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
