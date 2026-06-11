// Jest mock for expo-blur (native module): BlurView renders as a plain View.
import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

export function BlurView({ children, ...props }: ViewProps & { children?: ReactNode; intensity?: number; tint?: string }) {
  return <View {...props}>{children}</View>;
}
