import { supabase } from '../supabase';
import type { Sight } from '../types';

const SIGHT_COLUMNS =
  'id, city_id, dex_no, name, type_tags, reference_photo, about, hint, access, size, busyness, source, created_at, lat, lng';

export async function getSightsForCity(cityId: string): Promise<Sight[]> {
  const { data, error } = await supabase
    .from('sights')
    .select(SIGHT_COLUMNS)
    .eq('city_id', cityId)
    .order('dex_no', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Sight[];
}

export async function getSightById(id: string): Promise<Sight | null> {
  const { data, error } = await supabase
    .from('sights')
    .select(SIGHT_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Sight) ?? null;
}
