import { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot } from 'expo-router';
import {
  useFonts,
  SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { ThemeProvider } from '@/theme';
import { AuthProvider, useAuth } from '../context/AuthProvider';

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <View testID="auth-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
    SpaceMono_400Regular, SpaceMono_700Bold,
  });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  );
}
