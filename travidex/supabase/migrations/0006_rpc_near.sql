create or replace function sights_near(lat double precision, lng double precision, radius_m double precision)
returns table (
  id uuid, city_id uuid, dex_no int, name text, type_tags text[],
  reference_photo text, about text, hint text, access text, size text, busyness text,
  lat double precision, lng double precision, source text, created_at timestamptz,
  distance_m double precision
)
language sql stable
set search_path = public, extensions
as $$
  select s.id, s.city_id, s.dex_no, s.name, s.type_tags,
         s.reference_photo, s.about, s.hint, s.access, s.size, s.busyness,
         st_y(s.location::geometry) as lat, st_x(s.location::geometry) as lng,
         s.source, s.created_at,
         st_distance(s.location, st_point(lng, lat)::geography) as distance_m
  from sights s
  where st_dwithin(s.location, st_point(lng, lat)::geography, radius_m)
  order by distance_m
$$;
