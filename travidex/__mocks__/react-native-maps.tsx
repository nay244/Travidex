import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

// Stable spy — tests can import this directly to assert calls.
export const mockAnimateToRegion = jest.fn();

const MockMapView = forwardRef<{ animateToRegion: typeof mockAnimateToRegion }, any>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      animateToRegion: mockAnimateToRegion,
    }));
    return <View testID="map-view">{props.children}</View>;
  },
);
MockMapView.displayName = 'MockMapView';

export const Marker = (props: any) => (
  <View testID={`marker-${props.identifier ?? ''}`}>{props.children}</View>
);

export default MockMapView;
