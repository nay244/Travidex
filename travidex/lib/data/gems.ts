import { supabase } from '../supabase';
import { inferContentType } from './photos';

export type Gem = {
  id: string; author_id: string; author_name: string; name: string; note: string | null;
  photo_url: string; lat: number; lng: number; status: 'pending' | 'approved' | 'rejected' | 'hidden';
  favs_count: number; created_at: string; approved_at: string | null;
  faved: boolean; distance_m: number;
};

export async function getGemsForCity(cityId: string, userId: string): Promise<Gem[]> {
  const { data, error } = await supabase.rpc('gems_for_city', { p_city: cityId, p_user: userId });
  if (error) throw new Error(error.message);
  return (data ?? []) as Gem[];
}

export async function setGemFavorite(userId: string, gemId: string, on: boolean): Promise<void> {
  if (on) {
    const { error } = await supabase
      .from('gem_favorites')
      .upsert({ user_id: userId, gem_id: gemId }, { onConflict: 'user_id,gem_id', ignoreDuplicates: true });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('gem_favorites').delete().eq('user_id', userId).eq('gem_id', gemId);
    if (error) throw new Error(error.message);
  }
}

export async function reportGem(userId: string, gemId: string, reason?: string): Promise<void> {
  const { error } = await supabase
    .from('gem_reports')
    .upsert({ user_id: userId, gem_id: gemId, reason: reason ?? null }, { onConflict: 'user_id,gem_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function submitGem(
  userId: string,
  input: { name: string; note: string | null; cityId: string; lat: number; lng: number; blob: Blob; fileName: string },
): Promise<void> {
  const safeName = input.fileName.split(/[/\\]/).pop() || `${Date.now()}.jpg`;
  const path = `${userId}/${input.cityId}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase.storage.from('gem-photos').upload(path, input.blob, { contentType: inferContentType(safeName) });
  if (upErr) throw new Error(upErr.message);
  const { data } = supabase.storage.from('gem-photos').getPublicUrl(path);
  const { error } = await supabase.from('gems').insert({
    author_id: userId,
    name: input.name,
    note: input.note,
    photo_url: data.publicUrl,
    city_id: input.cityId,
    location: `SRID=4326;POINT(${input.lng} ${input.lat})`,
  });
  if (error) throw new Error(error.message);
}
