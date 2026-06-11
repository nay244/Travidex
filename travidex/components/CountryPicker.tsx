import { useEffect, useRef } from 'react';
import { Animated, FlatList, Modal, PanResponder, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
  const insets = useSafeAreaInsets();

  // drag-down to dismiss — copy this pattern for new sheets
  const translateY = useRef(new Animated.Value(0)).current;
  const dragPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 4,
      onPanResponderGrant: () => {
        (translateY as any).setOffset((translateY as any)._value);
        (translateY as any).setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        // clamp: only allow dragging downward
        translateY.setValue(Math.max(0, gs.dy));
      },
      onPanResponderRelease: (_, gs) => {
        (translateY as any).flattenOffset();
        if (gs.dy > 120 || gs.vy > 0.8) {
          // Dismiss: animate off-screen then call onClose
          Animated.timing(translateY, { toValue: 600, duration: 220, useNativeDriver: true }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          // Snap back
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
      onPanResponderTerminate: () => {
        (translateY as any).flattenOffset();
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      },
    }),
  ).current;

  // Reset translateY when sheet opens
  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: t.colors.surfaceScrim, justifyContent: 'flex-end' }}
      >
        {/* Height lives on the wrapper (its parent, the scrim, is flex:1) so the
            percentage resolves and the sheet runs flush to the screen bottom. */}
        <Animated.View style={{ height: '75%', transform: [{ translateY }] }}>
        <Pressable
          onPress={() => {}}
          style={{
            flex: 1,
            backgroundColor: t.colors.surface1,
            borderTopLeftRadius: t.radii.lg,
            borderTopRightRadius: t.radii.lg,
            padding: t.spacing.s4,
            gap: t.spacing.s3,
          }}
        >
          {/* Grabber — drag handle to dismiss */}
          <View
            {...dragPan.panHandlers}
            style={{
              paddingBottom: t.spacing.s2,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 38,
                height: 5,
                borderRadius: 999,
                backgroundColor: t.colors.borderStrong,
              }}
            />
          </View>

          <Text style={[t.type.h3, { color: t.colors.text1 }]}>Choose a country</Text>

          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + t.spacing.s6 }}
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
                  <Ionicons name="chevron-forward" size={18} color={t.colors.text3} />
                </Pressable>
              );
            }}
          />
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
