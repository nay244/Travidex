-- PostgREST cannot evaluate functions like st_y(...) inside select strings
-- (it parses them as relationship embeds), which broke every coordinate read
-- in the app. Store the projections as generated columns so clients select
-- plain lat/lng. (0013's default privileges cover the new columns.)
alter table cities  add column lat double precision generated always as (st_y(center::geometry))   stored;
alter table cities  add column lng double precision generated always as (st_x(center::geometry))   stored;
alter table sights  add column lat double precision generated always as (st_y(location::geometry)) stored;
alter table sights  add column lng double precision generated always as (st_x(location::geometry)) stored;
