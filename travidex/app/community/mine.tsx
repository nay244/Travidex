import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getMySubmissions, Submission } from '../../lib/data/community';
import { Screen } from '../../components/Screen';

export default function Mine() {
  const t = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const [rows, setRows] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    getMySubmissions(session.user.id)
      .then(setRows)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoaded(true));
  }, [session?.user?.id]);

  const statusColor = (s: Submission['status']) =>
    s === 'approved' ? t.colors.green : s === 'rejected' ? t.colors.danger : t.colors.progress;

  return (
    <Screen>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: 52,
      paddingHorizontal: t.spacing.s4,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.borderSubtle,
    }}>
      <Pressable
        testID="back-btn"
        onPress={() => router.back()}
        hitSlop={8}
        style={({ pressed }) => ({
          width: 40, height: 40, borderRadius: 20,
          alignItems: 'center', justifyContent: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Ionicons name="chevron-back" size={24} color={t.colors.text1} />
      </Pressable>
      <Text style={[t.type.h2, { flex: 1, textAlign: 'center', color: t.colors.text1 }]}>
        My submissions
      </Text>
      <View style={{ width: 40 }} />
    </View>
    <FlatList
      style={{ flex: 1 }}
      data={rows}
      keyExtractor={s => s.id}
      ListHeaderComponent={error ? <Text style={[t.type.caption, { color: t.colors.danger, padding: t.spacing.s5 }]}>{error}</Text> : null}
      ListEmptyComponent={loaded && !error ? <Text style={[t.type.body, { color: t.colors.text3, padding: t.spacing.s5 }]}>No submissions yet</Text> : null}
      renderItem={({ item }) => (
        <View style={{ padding: t.spacing.s5, borderBottomColor: t.colors.divider, borderBottomWidth: 1 }}>
          <Text style={[t.type.h3, { color: t.colors.text1 }]}>{item.name}</Text>
          <Text style={[t.type.label, { color: statusColor(item.status) }]}>{item.status}</Text>
          {item.reject_reason && <Text style={[t.type.caption, { color: t.colors.text2 }]}>{item.reject_reason}</Text>}
        </View>
      )}
    />
    </Screen>
  );
}
