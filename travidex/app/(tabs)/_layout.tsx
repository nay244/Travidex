import { GestureResponderEvent, Pressable, View } from 'react-native';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { CityProvider } from '../../context/CityProvider';
import { SelectionProvider, useSelection } from '../../context/SelectionProvider';
import { useAuth } from '../../context/AuthProvider';

function StampFab(props: { onPress?: (e: GestureResponderEvent) => void }) {
  const t = useTheme();
  const router = useRouter();
  const { selected, requestLog } = useSelection();
  const enabled = selected !== null;

  const handlePress = (e: GestureResponderEvent) => {
    if (enabled) {
      router.navigate('/(tabs)/map');
      requestLog();
    } else {
      props.onPress?.(e);
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
      <Pressable
        testID="stamp-fab"
        onPress={handlePress}
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,
          marginTop: -22,
          borderWidth: 3,
          borderColor: t.colors.bg,
          backgroundColor: enabled ? t.colors.actionPrimary : t.colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: enabled ? t.colors.amberGlow : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: enabled ? 1 : 0.10,
          shadowRadius: enabled ? 12 : 4,
          elevation: enabled ? 10 : 3,
        }}
      >
        <MaterialCommunityIcons
          name="stamper"
          size={26}
          color={enabled ? t.colors.textOnAccent : t.colors.text3}
        />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const t = useTheme();
  const { session, loading } = useAuth();
  if (!loading && !session) return <Redirect href="/(auth)/welcome" />;
  return (
    <CityProvider>
      <SelectionProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: t.colors.green,
            tabBarInactiveTintColor: t.colors.text3,
            tabBarStyle: {
              backgroundColor: t.colors.surface1,
              borderTopColor: t.colors.divider,
              overflow: 'visible',
            },
          }}
        >
          <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
          <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Ionicons name="compass" color={color} size={size} /> }} />
          <Tabs.Screen
            name="find"
            options={{
              title: 'Find',
              tabBarButton: (props) => <StampFab onPress={props.onPress ?? undefined} />,
            }}
          />
          <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} /> }} />
          <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
        </Tabs>
      </SelectionProvider>
    </CityProvider>
  );
}
