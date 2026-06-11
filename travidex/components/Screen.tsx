import { ReactNode } from 'react';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

// Every screen's root. Default: respect the top notch; bottom is handled by the tab bar.
export function Screen({ children, edges = ['top'] }: { children: ReactNode; edges?: Edge[] }) {
  const t = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {children}
    </SafeAreaView>
  );
}
