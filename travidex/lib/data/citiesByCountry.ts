import { supabase } from '../supabase';
import type { City } from '../types';

export async function getCitiesForCountry(countryId: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, country_id, name, region, lat:st_y(center::geometry), lng:st_x(center::geometry)')
    .eq('country_id', countryId)
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as City[];
}
