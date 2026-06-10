import 'react-native-gesture-handler';
import { ReactNode, useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Slot } from 'expo-router';
import {
  useFonts,
  SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import Purchases from 'react-native-purchases';
import { ThemeProvider } from '@/theme';
import { AuthProvider, useAuth } from '../context/AuthProvider';
import { EntitlementProvider } from '../context/EntitlementProvider';

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

  useEffect(() => {
    const key = process.env.EXPO_PUBLIC_RC_IOS_KEY;
    if (Platform.OS === 'ios' && key) Purchases.configure({ apiKey: key });
    else console.warn('RevenueCat not configured (missing EXPO_PUBLIC_RC_IOS_KEY or non-iOS)');
  }, []);

  if (!loaded) return null;
  return (
    <ThemeProvider>
      <EntitlementProvider>
        <AuthProvider>
          <AuthGate>
            <Slot />
          </AuthGate>
        </AuthProvider>
      </EntitlementProvider>
    </ThemeProvider>
  );
}
