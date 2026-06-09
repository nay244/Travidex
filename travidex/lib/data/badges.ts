import { supabase } from '../supabase';

export async function awardBadges(userId: string, codes: string[]): Promise<void> {
  if (codes.length === 0) return;
  const rows = codes.map(badge_code => ({ user_id: userId, badge_code }));
  const { error } = await supabase
    .from('user_badges')
    .upsert(rows, { onConflict: 'user_id,badge_code', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function getUserBadges(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_code')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { badge_code: string }) => r.badge_code);
}
