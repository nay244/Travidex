import { supabase } from '../supabase';

export type UserPhoto = { id: string; sight_id: string; photo_url: string };

export function inferContentType(safeName: string): string {
  const ext = safeName.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'heic') return 'image/heic';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
}

export async function getUserPhotos(userId: string): Promise<UserPhoto[]> {
  const { data, error } = await supabase
    .from('user_photos')
    .select('id, sight_id, photo_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as UserPhoto[];
}

export async function uploadUserPhoto(userId: string, sightId: string, blob: Blob, fileName: string): Promise<void> {
  const safeName = fileName.split(/[/\\]/).pop() || `${Date.now()}.jpg`; // strip any path segments
  const path = `${userId}/${sightId}/${safeName}`;
  const { error: upErr } = await supabase.storage.from('user-photos').upload(path, blob, { contentType: inferContentType(safeName) });
  if (upErr) throw new Error(upErr.message);
  const { data } = supabase.storage.from('user-photos').getPublicUrl(path);
  const { error } = await supabase.from('user_photos').insert({ user_id: userId, sight_id: sightId, photo_url: data.publicUrl });
  if (error) throw new Error(error.message);
}
