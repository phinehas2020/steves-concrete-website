-- Blog photo library: albums, reusable photos, and post-photo relationships

create table if not exists public.blog_photo_albums (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  source_type text not null default 'icloud_shared',
  source_url text not null,
  source_token text,
  source_base_url text,
  active boolean not null default true,
  auto_publish boolean not null default false,
  last_synced_at timestamptz,
  last_sync_status text,
  last_sync_error text,
  unique (source_type, source_url)
);

create table if not exists public.blog_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  album_id uuid references public.blog_photo_albums(id) on delete set null,
  dedupe_key text not null unique,
  source_photo_guid text,
  source_asset_key text,
  source_batch_key text,
  source_caption text,
  source_taken_at timestamptz,
  image_url text not null,
  storage_path text,
  alt_text text,
  ai_caption text,
  width integer,
  height integer,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.blog_post_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  photo_id uuid not null references public.blog_photos(id) on delete cascade,
  image_order integer not null default 0,
  is_cover boolean not null default false,
  caption text,
  alt_text text,
  unique (post_id, photo_id)
);

create index if not exists idx_blog_photo_albums_active on public.blog_photo_albums(active);
create index if not exists idx_blog_photos_album_id on public.blog_photos(album_id);
create index if not exists idx_blog_photos_guid on public.blog_photos(source_photo_guid);
create index if not exists idx_blog_photos_batch on public.blog_photos(source_batch_key);
create index if not exists idx_blog_photos_taken_at on public.blog_photos(source_taken_at desc);
create unique index if not exists idx_blog_photos_album_guid
  on public.blog_photos(album_id, source_photo_guid)
  where source_photo_guid is not null;
create index if not exists idx_blog_post_photos_post_order on public.blog_post_photos(post_id, image_order);

alter table public.blog_photo_albums enable row level security;
alter table public.blog_photos enable row level security;
alter table public.blog_post_photos enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_photo_albums' and policyname = 'Admins can read blog photo albums'
  ) then
    create policy "Admins can read blog photo albums"
      on public.blog_photo_albums for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_photo_albums' and policyname = 'Admins can manage blog photo albums'
  ) then
    create policy "Admins can manage blog photo albums"
      on public.blog_photo_albums for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_photos' and policyname = 'Admins can read blog photos'
  ) then
    create policy "Admins can read blog photos"
      on public.blog_photos for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_photos' and policyname = 'Admins can manage blog photos'
  ) then
    create policy "Admins can manage blog photos"
      on public.blog_photos for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_post_photos' and policyname = 'Public can read photos for published blog posts'
  ) then
    create policy "Public can read photos for published blog posts"
      on public.blog_post_photos for select
      using (
        exists (
          select 1
          from public.blog_posts p
          where p.id = post_id and p.status = 'published'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_post_photos' and policyname = 'Admins can manage blog post photos'
  ) then
    create policy "Admins can manage blog post photos"
      on public.blog_post_photos for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$$;

do $$
begin
  if exists (select 1 from pg_proc where proname = 'update_updated_at_column') then
    if not exists (
      select 1 from pg_trigger
      where tgname = 'update_blog_photo_albums_updated_at'
    ) then
      create trigger update_blog_photo_albums_updated_at
        before update on public.blog_photo_albums
        for each row
        execute function update_updated_at_column();
    end if;

    if not exists (
      select 1 from pg_trigger
      where tgname = 'update_blog_photos_updated_at'
    ) then
      create trigger update_blog_photos_updated_at
        before update on public.blog_photos
        for each row
        execute function update_updated_at_column();
    end if;
  end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  10485760,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can view blog images'
  ) then
    create policy "Public can view blog images"
    on storage.objects for select
    using (bucket_id = 'blog-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can upload blog images'
  ) then
    create policy "Admins can upload blog images"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'blog-images' and
      (select exists (
        select 1 from public.admin_users
        where email = (auth.jwt() ->> 'email')
      ))
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can update blog images'
  ) then
    create policy "Admins can update blog images"
    on storage.objects for update
    to authenticated
    using (
      bucket_id = 'blog-images' and
      (select exists (
        select 1 from public.admin_users
        where email = (auth.jwt() ->> 'email')
      ))
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can delete blog images'
  ) then
    create policy "Admins can delete blog images"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'blog-images' and
      (select exists (
        select 1 from public.admin_users
        where email = (auth.jwt() ->> 'email')
      ))
    );
  end if;
end
$$;
