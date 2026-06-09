import { supabase } from '../supabase';

export type FeedItem = { id: string; comment: string | null; found_at: string; sight_name: string; username: string | null };

export async function getFeed(limit = 30): Promise<FeedItem[]> {
  const { data, error } = await supabase.rpc('get_feed', { p_limit: limit });
  if (error) throw new Error(error.message);
  return (data ?? []) as FeedItem[];
}
