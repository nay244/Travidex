-- Catalog: world-readable to authenticated users, no client writes.
alter table countries enable row level security;
alter table cities enable row level security;
alter table sights enable row level security;
create policy "catalog read countries" on countries for select to authenticated using (true);
create policy "catalog read cities" on cities for select to authenticated using (true);
create policy "catalog read sights" on sights for select to authenticated using (true);

-- Profiles: public read, owner write.
alter table profiles enable row level security;
create policy "profiles read" on profiles for select to authenticated using (true);
create policy "profiles insert own" on profiles for insert to authenticated with check (user_id = auth.uid());
create policy "profiles update own" on profiles for update to authenticated using (user_id = auth.uid());

-- Finds: public read (feed/completion), owner write.
alter table finds enable row level security;
create policy "finds read" on finds for select to authenticated using (true);
create policy "finds insert own" on finds for insert to authenticated with check (user_id = auth.uid());
create policy "finds delete own" on finds for delete to authenticated using (user_id = auth.uid());

-- User photos: public read, owner write.
alter table user_photos enable row level security;
create policy "photos read" on user_photos for select to authenticated using (true);
create policy "photos insert own" on user_photos for insert to authenticated with check (user_id = auth.uid());
create policy "photos delete own" on user_photos for delete to authenticated using (user_id = auth.uid());

-- Badges: public read, owner insert.
alter table user_badges enable row level security;
create policy "badges read" on user_badges for select to authenticated using (true);
create policy "badges insert own" on user_badges for insert to authenticated with check (user_id = auth.uid());

-- Community submissions: owner + approved are readable; owner inserts (forced pending); owner edits only while pending.
alter table community_submissions enable row level security;
create policy "subs read own or approved" on community_submissions for select to authenticated
  using (user_id = auth.uid() or status = 'approved');
create policy "subs insert own pending" on community_submissions for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
create policy "subs update own pending" on community_submissions for update to authenticated
  using (user_id = auth.uid() and status = 'pending');
