create or replace function sights_near(lat double precision, lng double precision, radius_m double precision)
returns setof sights
language sql stable
as $$
  select *
  from sights
  where st_dwithin(location, st_point(lng, lat)::geography, radius_m)
  order by location <-> st_point(lng, lat)::geography;
$$;
