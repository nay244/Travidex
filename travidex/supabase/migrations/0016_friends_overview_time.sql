-- friends_overview gains last_find_at so the Friends list can show "· 2h ago".
drop function if exists friends_overview(uuid);
create or replace function friends_overview(p_user uuid)
returns table (friend_id uuid, username text, sights_count bigint, last_find text, last_find_at timestamptz)
language sql stable
set search_path = public
as $$
  select f.friend_id,
         p.username,
         (select count(*) from finds fi where fi.user_id = f.friend_id) as sights_count,
         (select s.name from finds fi join sights s on s.id = fi.sight_id
            where fi.user_id = f.friend_id order by fi.found_at desc limit 1) as last_find,
         (select fi.found_at from finds fi
            where fi.user_id = f.friend_id order by fi.found_at desc limit 1) as last_find_at
  from friendships f
  join profiles p on p.user_id = f.friend_id
  where f.user_id = p_user
  order by p.username asc
$$;
