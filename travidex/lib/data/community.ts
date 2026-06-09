import { supabase } from '../supabase';

export type SubmitInput = {
  name: string; cityId: string; typeTags: string[];
  about: string | null; hint: string | null; lat: number; lng: number;
};
export type Submission = { id: string; name: string; status: 'pending' | 'approved' | 'rejected'; reject_reason: string | null; created_at: string };

export async function submitSight(userId: string, input: SubmitInput) {
  const { error } = await supabase.from('community_submissions').insert({
    user_id: userId,
    city_id: input.cityId,
    name: input.name,
    type_tags: input.typeTags,
    about: input.about,
    hint: input.hint,
    location: `SRID=4326;POINT(${input.lng} ${input.lat})`,
  });
  if (error) throw new Error(error.message);
}

export async function getMySubmissions(userId: string): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('community_submissions')
    .select('id, name, status, reject_reason, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Submission[];
}
