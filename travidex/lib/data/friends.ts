import { supabase } from '../supabase';

export type FriendOverview = { friend_id: string; username: string; sights_count: number; last_find: string | null };
export type ProfileHit = { user_id: string; username: string };

export async function getFriendsOverview(userId: string): Promise<FriendOverview[]> {
  const { data, error } = await supabase.rpc('friends_overview', { p_user: userId });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({ ...r, sights_count: Number(r.sights_count) }));
}

export async function searchProfiles(query: string, selfId: string): Promise<ProfileHit[]> {
  const escaped = query.replace(/[\\%_]/g, m => `\\${m}`); // treat LIKE wildcards as literals
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, username')
    .ilike('username', `%${escaped}%`)
    .neq('user_id', selfId)
    .limit(10);
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileHit[];
}

export async function addFriend(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase
    .from('friendships')
    .upsert({ user_id: userId, friend_id: friendId }, { onConflict: 'user_id,friend_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase.from('friendships').delete().eq('user_id', userId).eq('friend_id', friendId);
  if (error) throw new Error(error.message);
}
