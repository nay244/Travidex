import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';
import { logFind } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';

export function LogFindSheet({ sightId, onLogged }: { sightId: string; onLogged: () => void }) {
  const t = useTheme();
  const { session } = useAuth();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!session?.user) return;
    setBusy(true);
    setError(null);
    try {
      await logFind(session.user.id, sightId, comment.trim() || 'Found!');
      onLogged();
    } catch (e: any) {
      console.warn('logFind error:', e.message);
      if (e.message?.includes('duplicate key') || e.message?.includes('23505')) {
        setError('Already in your dex.');
      } else {
        setError('Could not log this find. Try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: t.spacing.s5, backgroundColor: t.colors.surface1, borderRadius: t.radii.md }}>
      <TextInput
        placeholder="Add a note (optional)"
        placeholderTextColor={t.colors.text3}
        value={comment}
        onChangeText={setComment}
        style={[t.type.body, { backgroundColor: t.colors.surface2, color: t.colors.text1, padding: t.spacing.s4, borderRadius: t.radii.sm, marginBottom: t.spacing.s3 }]}
      />
      {error && <Text style={[t.type.caption, { color: t.colors.danger, marginBottom: t.spacing.s3 }]}>{error}</Text>}
      <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: t.colors.actionPrimary, padding: t.spacing.s4, borderRadius: t.radii.sm }}>
        <Text style={[t.type.h3, { textAlign: 'center', color: t.colors.textOnAccent }]}>Log find</Text>
      </Pressable>
    </View>
  );
}
