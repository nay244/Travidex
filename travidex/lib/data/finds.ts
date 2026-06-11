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

export type RecentFind = { id: string; comment: string | null; found_at: string; user_id: string; username: string | null };

export async function getRecentFinds(sightId: string, limit = 10): Promise<RecentFind[]> {
  const { data, error } = await supabase
    .from('finds')
    .select('id, comment, found_at, user_id')
    .eq('sight_id', sightId)
    .order('found_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  const finds = (data ?? []) as Omit<RecentFind, 'username'>[];
  if (finds.length === 0) return [];

  // finds.user_id has no FK to profiles, so PostgREST can't embed — merge usernames manually.
  const userIds = [...new Set(finds.map(f => f.user_id))];
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('user_id, username')
    .in('user_id', userIds);
  if (pErr) throw new Error(pErr.message);
  const names = new Map((profiles ?? []).map((p: { user_id: string; username: string }) => [p.user_id, p.username]));
  return finds.map(f => ({ ...f, username: names.get(f.user_id) ?? null }));
}

export async function getUserFindCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('finds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Remove a logged find (accidental log) — deletes the user's find row for the sight.
export async function unlogFind(userId: string, sightId: string): Promise<void> {
  const { error } = await supabase
    .from('finds')
    .delete()
    .eq('user_id', userId)
    .eq('sight_id', sightId);
  if (error) throw new Error(error.message);
}

// Months (as 'YYYY-MM', in the device's local time) in which the user logged at
// least one find — drives the monthly badges page.
export async function getFindMonths(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('finds')
    .select('found_at')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r: { found_at: string }) => {
    const d = new Date(r.found_at);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }));
}
