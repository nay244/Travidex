-- found/total sights per city for a given user
create or replace function city_progress(p_user uuid)
returns table(city_id uuid, total bigint, found bigint)
language sql stable
set search_path = public
as $$
  select s.city_id,
         count(s.id) as total,
         count(f.id) as found
  from sights s
  left join finds f on f.sight_id = s.id and f.user_id = p_user
  group by s.city_id;
$$;

-- found/total sights per country for a given user
create or replace function country_progress(p_user uuid)
returns table(country_id uuid, total bigint, found bigint)
language sql stable
set search_path = public
as $$
  select c.country_id,
         count(s.id) as total,
         count(f.id) as found
  from cities c
  join sights s on s.city_id = c.id
  left join finds f on f.sight_id = s.id and f.user_id = p_user
  group by c.country_id;
$$;
