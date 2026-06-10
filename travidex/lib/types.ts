export type Country = { id: string; name: string; code: string; created_at: string; tier: 'cities' | 'states' };
export type City = { id: string; country_id: string; name: string; region: string | null; lat: number; lng: number };
export type Sight = {
  id: string; city_id: string; dex_no: number; name: string; type_tags: string[];
  reference_photo: string | null; about: string | null; hint: string | null;
  access: string | null; size: string | null; busyness: string | null;
  lat: number; lng: number; source: 'curated' | 'community'; created_at: string;
};
export type Find = { id: string; user_id: string; sight_id: string; comment: string | null; found_at: string };
export type SightWithFind = Sight & { found: boolean };
