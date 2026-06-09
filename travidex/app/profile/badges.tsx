import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { BADGES } from '../../lib/badges';
import { getUserBadges } from '../../lib/data/badges';

export default function Badges() {
  const t = useTheme();
  const { session } = useAuth();
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) getUserBadges(session.user.id).then(setEarned).catch(err => console.warn('getUserBadges failed', err));
  }, [session?.user?.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: t.spacing.s5, gap: t.spacing.s3 }}>
      {BADGES.map(b => {
        const has = earned.includes(b.code);
        // earned = full color; locked = HOLLOW (transparent fill + outline), never opacity-dim
        return (
          <View key={b.code} testID={`badge-${b.code}-${has ? 'earned' : 'locked'}`}
            style={{ padding: t.spacing.s5, borderRadius: t.radii.sm,
              backgroundColor: has ? t.colors.foundBg : 'transparent',
              borderWidth: has ? 0 : 1, borderColor: t.colors.locked }}>
            <Text style={[t.type.h3, { color: has ? t.colors.text1 : t.colors.text3 }]}>{b.label}</Text>
            <Text style={[t.type.label, { color: has ? t.colors.green : t.colors.text3 }]}>{has ? 'Earned' : 'Locked'}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
