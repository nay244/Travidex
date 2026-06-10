import { supabase } from '../supabase';

export async function getFavoriteSightIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('favorites')
    .select('sight_id')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r: { sight_id: string }) => r.sight_id));
}

export async function setFavorite(userId: string, sightId: string, on: boolean): Promise<void> {
  if (on) {
    const { error } = await supabase
      .from('favorites')
      .upsert({ user_id: userId, sight_id: sightId }, { onConflict: 'user_id,sight_id', ignoreDuplicates: true });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('sight_id', sightId);
    if (error) throw new Error(error.message);
  }
}
