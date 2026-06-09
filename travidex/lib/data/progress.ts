import { supabase } from '../supabase';

export type Progress = { found: number; total: number };

export async function getCityProgress(userId: string): Promise<Map<string, Progress>> {
  const { data, error } = await supabase.rpc('city_progress', { p_user: userId });
  if (error) throw new Error(error.message);
  const map = new Map<string, Progress>();
  for (const r of (data ?? []) as any[]) map.set(r.city_id, { found: Number(r.found), total: Number(r.total) });
  return map;
}

export async function getCountryProgress(userId: string): Promise<Map<string, Progress>> {
  const { data, error } = await supabase.rpc('country_progress', { p_user: userId });
  if (error) throw new Error(error.message);
  const map = new Map<string, Progress>();
  for (const r of (data ?? []) as any[]) map.set(r.country_id, { found: Number(r.found), total: Number(r.total) });
  return map;
}
