import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthProvider';

export default function AuthLayout() {
  const { session } = useAuth();
  if (session) return <Redirect href="/(tabs)/map" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
