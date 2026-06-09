import { supabase } from './supabase';

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data === null;
}

export async function createProfile(userId: string, username: string, avatarUrl: string | null) {
  const { error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, username, avatar_url: avatarUrl });
  if (error) throw new Error(error.message);
}
