-- Create bucket
insert into storage.buckets(id, name) values ('test-bucket', 'test-bucket');

-- Create a public select policy for access to buckets, don't try this at home!!!!
create policy "Public Bucket Select" on storage.buckets for select using ( true );

-- Create a public select and insert policy for access to test-bucket, don't try this at home!!!!
create policy "Public Object Select" on storage.objects for select using ( bucket_id = 'test-bucket' );
create policy "Public Object Insert" on storage.objects for insert with check (bucket_id = 'test-bucket' );
create policy "Public Object Update" on storage.objects for update using (bucket_id = 'test-bucket' );
