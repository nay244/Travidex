create or replace function get_feed(p_limit int default 30)
returns table(id uuid, comment text, found_at timestamptz, sight_name text, username text, city_name text)
language sql stable
set search_path = public
as $$
  select f.id, f.comment, f.found_at, s.name as sight_name, p.username, c.name as city_name
  from finds f
  join sights s on s.id = f.sight_id
  left join profiles p on p.user_id = f.user_id
  left join cities c on c.id = s.city_id
  order by f.found_at desc
  limit p_limit;
$$;
