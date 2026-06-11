import { supabase } from '../supabase';

export async function getArtId(userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('art_id')
    .eq('user_id', userId)
    .maybeSingle();
  return (data as { art_id: string } | null)?.art_id ?? 'trailhead';
}

export async function setArtId(userId: string, artId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ art_id: artId })
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
