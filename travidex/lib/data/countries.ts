import { supabase } from '../supabase';
import type { Country } from '../types';

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase.from('countries').select('*').order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Country[];
}
