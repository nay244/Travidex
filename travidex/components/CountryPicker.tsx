import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { Flag } from './Flag';
import type { Country } from '../lib/types';
import type { Progress } from '../lib/data/progress';

type Props = {
  visible: boolean;
  countries: Country[];
  progress: Map<string, Progress>;
  currentId: string | null;
  onPick: (countryId: string) => void;
  onClose: () => void;
};

export function CountryPicker({ visible, countries, progress, currentId, onPick, onClose }: Props) {
  const t = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: t.colors.surfaceScrim, justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            maxHeight: '80%',
            backgroundColor: t.colors.surface1,
            borderTopLeftRadius: t.radii.lg,
            borderTopRightRadius: t.radii.lg,
            padding: t.spacing.s4,
            gap: t.spacing.s3,
          }}
        >
          {/* Grabber */}
          <View
            style={{
              width: 38,
              height: 5,
              borderRadius: 999,
              backgroundColor: t.colors.borderStrong,
              alignSelf: 'center',
            }}
          />

          <Text style={[t.type.h3, { color: t.colors.text1 }]}>Choose a country</Text>

          <FlatList
            data={countries}
            keyExtractor={c => c.id}
            renderItem={({ item }) => {
              const p = progress.get(item.id) ?? { found: 0, total: 0 };
              const active = item.id === currentId;
              return (
                <Pressable
                  onPress={() => onPick(item.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: t.spacing.s3,
                    padding: t.spacing.s3,
                    borderRadius: t.radii.sm,
                    backgroundColor: active ? t.colors.surface3 : t.colors.surface2,
                    borderWidth: 1,
                    borderColor: active ? t.colors.greenLine : t.colors.borderSubtle,
                    marginBottom: t.spacing.s2,
                  }}
                >
                  <Flag code={item.code} size={34} radius={6} />
                  <View style={{ flex: 1 }}>
                    <Text style={[t.type.body, { color: t.colors.text1 }]}>{item.name}</Text>
                    <Text style={[t.type.caption, { color: t.colors.text3 }]}>
                      {`${p.found}/${p.total} sights`}
                    </Text>
                  </View>
                  {active && <Text style={{ color: t.colors.green }}>{'✓'}</Text>}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
