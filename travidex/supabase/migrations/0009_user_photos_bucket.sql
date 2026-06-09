-- Storage bucket for user-uploaded sight photos (read by public URL; written by owner only).
insert into storage.buckets (id, name, public)
values ('user-photos', 'user-photos', true)
on conflict (id) do nothing;

-- Public read (bucket is public; objects are world-readable via getPublicUrl).
create policy "user-photos read" on storage.objects for select to authenticated
  using (bucket_id = 'user-photos');

-- Owner-only writes: object key must live under the uploader's own folder
-- (`${auth.uid()}/...`), which also pins uploads to the caller's prefix.
create policy "user-photos insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'user-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "user-photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'user-photos' and (storage.foldername(name))[1] = auth.uid()::text);
