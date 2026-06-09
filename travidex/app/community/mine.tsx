import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useAuth } from '../../context/AuthProvider';
import { getMySubmissions, Submission } from '../../lib/data/community';

export default function Mine() {
  const t = useTheme();
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
    <FlatList
      style={{ flex: 1, backgroundColor: t.colors.bg }}
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
  );
}
