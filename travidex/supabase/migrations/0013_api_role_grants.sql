-- Tables created via CLI db push (as supabase_admin) don't inherit the default
-- grants Supabase gives the API roles, so PostgREST gets "permission denied".
-- Grant table/function/sequence access to the API roles; RLS policies remain
-- the actual row-level gate (anon has no policies, so it still sees nothing).
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- Future objects too, regardless of which admin role creates them.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
