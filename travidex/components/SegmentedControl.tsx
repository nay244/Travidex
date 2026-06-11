/**
 * SegmentedControl — shared neutral sliding-thumb primitive.
 *
 * Design: Community.jsx `Seg` component. Surface2 track + Surface4 thumb
 * that slides under the active option via Animated.spring. Active label is
 * text1 weight 600; inactive is text3. Amber is NOT used here — this is a
 * neutral navigation control, not an accent.
 *
 * Copy-paste guide: add an entry to `options`, supply matching `value` +
 * `onChange` — everything else is automatic.
 */
import { useRef, useEffect } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/theme';

export type SegOption = {
  key: string;
  label: string;
  testID?: string;
};

type Props = {
  options: readonly SegOption[];
  value: string;
  onChange: (key: string) => void;
};

export function SegmentedControl({ options, value, onChange }: Props) {
  const t = useTheme();
  const segWidthRef = useRef(0);
  const thumbX = useRef(new Animated.Value(0)).current;

  const activeIndex = options.findIndex(o => o.key === value);
  const safeIndex = activeIndex < 0 ? 0 : activeIndex;

  // Animate thumb to new position whenever activeIndex or track width changes
  useEffect(() => {
    if (segWidthRef.current <= 0) return;
    const segmentWidth = segWidthRef.current / options.length;
    Animated.spring(thumbX, {
      toValue: safeIndex * segmentWidth,
      useNativeDriver: false,
      tension: 280,
      friction: 22,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, options.length]);

  function onTrackLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    if (w === segWidthRef.current) return;
    segWidthRef.current = w;
    // Jump without animation on first measurement
    const segmentWidth = w / options.length;
    thumbX.setValue(safeIndex * segmentWidth);
  }

  const segmentWidth = segWidthRef.current > 0
    ? segWidthRef.current / options.length
    : undefined;

  return (
    <View
      onLayout={onTrackLayout}
      style={[
        styles.track,
        {
          backgroundColor: t.colors.surface2,
          borderRadius: t.radii.pill,
          borderColor: t.colors.borderSubtle,
        },
      ]}
    >
      {/* Sliding thumb — rendered below labels */}
      {segmentWidth != null && (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: segmentWidth - THUMB_INSET * 2,
              borderRadius: t.radii.pill,
              backgroundColor: t.colors.surface4,
              transform: [{ translateX: thumbX }],
              // subtle lift shadow
              shadowColor: '#161e30',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.10,
              shadowRadius: 3,
              elevation: 2,
            },
          ]}
        />
      )}

      {/* Labels row */}
      {options.map(opt => {
        const isActive = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            testID={opt.testID}
            onPress={() => onChange(opt.key)}
            style={styles.segment}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[
                styles.label,
                {
                  fontFamily: isActive
                    ? t.fontFamily.sansSemibold
                    : t.fontFamily.sansRegular,
                  color: isActive ? t.colors.text1 : t.colors.text3,
                  fontSize: t.fontSize.caption,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// 3px inset on each side so the thumb has breathing room inside the track
const THUMB_INSET = 3;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: THUMB_INSET,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: THUMB_INSET,
    left: THUMB_INSET,
    bottom: THUMB_INSET,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    zIndex: 1,
  },
  label: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
