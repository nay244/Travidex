import { supabase } from '../supabase';
import type { City } from '../types';

export async function getCitiesForCountry(countryId: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, country_id, name, region, lat, lng')
    .eq('country_id', countryId)
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as City[];
}

export type CityWithCountry = City & { country_code: string; country_name: string };

export async function getCityWithCountry(cityId: string): Promise<CityWithCountry | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, country_id, name, region, lat, lng, countries(code, name)')
    .eq('id', cityId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  type Row = City & { countries: { code: string; name: string } | null };
  const { countries, ...city } = data as unknown as Row;
  return { ...city, country_code: countries?.code ?? '', country_name: countries?.name ?? '' };
}
