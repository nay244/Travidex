import { supabase } from '../supabase';

export async function logFind(userId: string, sightId: string, comment: string) {
  const { error } = await supabase
    .from('finds')
    .insert({ user_id: userId, sight_id: sightId, comment });
  if (error) throw new Error(error.message);
}

export async function getFoundSightIds(userId: string, sightIds: string[]): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('finds')
    .select('sight_id')
    .eq('user_id', userId)
    .in('sight_id', sightIds);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r: { sight_id: string }) => r.sight_id));
}
