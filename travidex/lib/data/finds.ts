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

export type RecentFind = { id: string; comment: string | null; found_at: string; user_id: string };

export async function getRecentFinds(sightId: string, limit = 10): Promise<RecentFind[]> {
  const { data, error } = await supabase
    .from('finds')
    .select('id, comment, found_at, user_id')
    .eq('sight_id', sightId)
    .order('found_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as RecentFind[];
}

export async function getUserFindCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('finds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Months (as 'YYYY-MM') in which the user logged at least one find — drives the monthly badges page.
export async function getFindMonths(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('finds')
    .select('found_at')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r: { found_at: string }) => r.found_at.slice(0, 7)));
}
