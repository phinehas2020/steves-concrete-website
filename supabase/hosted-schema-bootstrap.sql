-- Hosted Supabase bootstrap for this project.
-- Paste this into the hosted project's SQL editor, run it once,
-- then rerun the repo migration script to copy rows and storage objects.

create extension if not exists "pgcrypto";

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  service text,
  message text not null,
  status text not null default 'new',
  lead_quality text not null default 'unreviewed',
  source text default 'website',
  page_url text,
  user_agent text,
  ip text
);

alter table public.leads
  add column if not exists lead_quality text not null default 'unreviewed';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_lead_quality_check'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_lead_quality_check
      check (lead_quality in ('unreviewed', 'qualified', 'solicitation', 'spam'));
  end if;
end
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  role text not null default 'admin'
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  published_at timestamptz,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  status text not null default 'draft',
  cover_image_url text,
  author_email text
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  category text not null default 'Commercial',
  location text not null default 'Waco, TX',
  date date not null,
  date_formatted text,
  description text,
  featured boolean not null default false,
  display_order integer default 0
);

create table if not exists public.job_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  image_url text not null,
  image_order integer not null default 0,
  alt_text text
);

create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url text not null,
  display_order integer not null default 0,
  alt_text text,
  active boolean not null default true
);

create table if not exists public.email_recipients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  active boolean not null default true,
  notes text
);

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

create table if not exists public.blog_ai_prompt_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,
  label text,
  system_prompt text not null
);

create table if not exists public.blog_post_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  requested_by_email text not null,
  status text not null default 'queued',
  target_post_status text not null default 'draft',
  target_type text not null default 'blog_post',
  target_job_category text,
  photo_ids uuid[] not null default '{}',
  request_payload jsonb not null default '{}'::jsonb,
  system_prompt text,
  result_post_id uuid references public.blog_posts(id) on delete set null,
  result_post_slug text,
  result_job_id uuid references public.jobs(id) on delete set null,
  result_job_slug text,
  error_message text,
  attempts integer not null default 0,
  locked_at timestamptz,
  locked_by text,
  constraint blog_post_generation_jobs_status_check
    check (status in ('queued', 'processing', 'completed', 'failed')),
  constraint blog_post_generation_jobs_target_status_check
    check (target_post_status in ('draft', 'published')),
  constraint blog_post_generation_jobs_target_type_check
    check (target_type in ('blog_post', 'job_listing'))
);

create index if not exists idx_leads_created_at
  on public.leads (created_at desc);

create index if not exists idx_leads_quality_created_at
  on public.leads (lead_quality, created_at desc);

create index if not exists idx_leads_ip_created_at
  on public.leads (ip, created_at desc)
  where ip is not null;

create index if not exists idx_leads_phone_created_at
  on public.leads (phone, created_at desc);

create index if not exists idx_leads_email_created_at
  on public.leads (email, created_at desc)
  where email is not null;

create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_featured on public.jobs(featured);
create index if not exists idx_job_images_job_id on public.job_images(job_id);
create index if not exists idx_job_images_order on public.job_images(job_id, image_order);
create index if not exists idx_hero_images_active on public.hero_images(active);
create index if not exists idx_hero_images_order on public.hero_images(display_order);
create index if not exists idx_blog_photo_albums_active on public.blog_photo_albums(active);
create index if not exists idx_blog_photos_album_id on public.blog_photos(album_id);
create index if not exists idx_blog_photos_guid on public.blog_photos(source_photo_guid);
create index if not exists idx_blog_photos_batch on public.blog_photos(source_batch_key);
create index if not exists idx_blog_photos_taken_at on public.blog_photos(source_taken_at desc);
create unique index if not exists idx_blog_photos_album_guid
  on public.blog_photos(album_id, source_photo_guid)
  where source_photo_guid is not null;
create index if not exists idx_blog_post_photos_post_order on public.blog_post_photos(post_id, image_order);
create index if not exists idx_blog_ai_prompt_settings_key
  on public.blog_ai_prompt_settings(key);
create index if not exists idx_blog_post_generation_jobs_status_created
  on public.blog_post_generation_jobs(status, created_at);
create index if not exists idx_blog_post_generation_jobs_requester_created
  on public.blog_post_generation_jobs(requested_by_email, created_at desc);
create index if not exists idx_blog_post_generation_jobs_result_post
  on public.blog_post_generation_jobs(result_post_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = (auth.jwt() ->> 'email')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = (auth.jwt() ->> 'email')
      and role = 'super_admin'
  );
$$;

alter table public.leads enable row level security;
alter table public.admin_users enable row level security;
alter table public.blog_posts enable row level security;
alter table public.jobs enable row level security;
alter table public.job_images enable row level security;
alter table public.hero_images enable row level security;
alter table public.email_recipients enable row level security;
alter table public.blog_photo_albums enable row level security;
alter table public.blog_photos enable row level security;
alter table public.blog_post_photos enable row level security;
alter table public.blog_ai_prompt_settings enable row level security;
alter table public.blog_post_generation_jobs enable row level security;

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Allow lead inserts" on public.leads;
drop policy if exists "Service role can insert leads" on public.leads;
create policy "Service role can insert leads"
  on public.leads for insert
  to service_role
  with check (true);

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Super admins can manage admins" on public.admin_users;
create policy "Super admins can manage admins"
  on public.admin_users for insert
  to authenticated
  with check (public.is_super_admin());

drop policy if exists "Super admins can update admins" on public.admin_users;
create policy "Super admins can update admins"
  on public.admin_users for update
  to authenticated
  using (public.is_super_admin());

drop policy if exists "Super admins can delete admins" on public.admin_users;
create policy "Super admins can delete admins"
  on public.admin_users for delete
  to authenticated
  using (public.is_super_admin());

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts for select
  using (status = 'published');

drop policy if exists "Admins can read posts" on public.blog_posts;
create policy "Admins can read posts"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage posts" on public.blog_posts;
create policy "Admins can manage posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update posts" on public.blog_posts;
create policy "Admins can update posts"
  on public.blog_posts for update
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can delete posts" on public.blog_posts;
create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Public can read jobs" on public.jobs;
create policy "Public can read jobs"
  on public.jobs for select
  using (true);

drop policy if exists "Public can read job images" on public.job_images;
create policy "Public can read job images"
  on public.job_images for select
  using (true);

drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs"
  on public.jobs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage job images" on public.job_images;
create policy "Admins can manage job images"
  on public.job_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read active hero images" on public.hero_images;
create policy "Public can read active hero images"
  on public.hero_images for select
  using (active = true);

drop policy if exists "Admins can manage hero images" on public.hero_images;
create policy "Admins can manage hero images"
  on public.hero_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read email recipients" on public.email_recipients;
create policy "Admins can read email recipients"
  on public.email_recipients for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert email recipients" on public.email_recipients;
create policy "Admins can insert email recipients"
  on public.email_recipients for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update email recipients" on public.email_recipients;
create policy "Admins can update email recipients"
  on public.email_recipients for update
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can delete email recipients" on public.email_recipients;
create policy "Admins can delete email recipients"
  on public.email_recipients for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can read blog photo albums" on public.blog_photo_albums;
create policy "Admins can read blog photo albums"
  on public.blog_photo_albums for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage blog photo albums" on public.blog_photo_albums;
create policy "Admins can manage blog photo albums"
  on public.blog_photo_albums for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read blog photos" on public.blog_photos;
create policy "Admins can read blog photos"
  on public.blog_photos for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage blog photos" on public.blog_photos;
create policy "Admins can manage blog photos"
  on public.blog_photos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read photos for published blog posts" on public.blog_post_photos;
create policy "Public can read photos for published blog posts"
  on public.blog_post_photos for select
  using (
    exists (
      select 1
      from public.blog_posts p
      where p.id = post_id and p.status = 'published'
    )
  );

drop policy if exists "Admins can manage blog post photos" on public.blog_post_photos;
create policy "Admins can manage blog post photos"
  on public.blog_post_photos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read blog AI prompt settings" on public.blog_ai_prompt_settings;
create policy "Admins can read blog AI prompt settings"
  on public.blog_ai_prompt_settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage blog AI prompt settings" on public.blog_ai_prompt_settings;
create policy "Admins can manage blog AI prompt settings"
  on public.blog_ai_prompt_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read blog post generation jobs" on public.blog_post_generation_jobs;
create policy "Admins can read blog post generation jobs"
  on public.blog_post_generation_jobs for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage blog post generation jobs" on public.blog_post_generation_jobs;
create policy "Admins can manage blog post generation jobs"
  on public.blog_post_generation_jobs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('jobs', 'jobs', true, 52428800, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('hero-images', 'hero-images', true, 52428800, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('blog-images', 'blog-images', true, 10485760, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "Public can view job images" on storage.objects;
create policy "Public can view job images"
on storage.objects for select
using (bucket_id = 'jobs');

drop policy if exists "Admins can upload job images" on storage.objects;
create policy "Admins can upload job images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'jobs' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Admins can update job images" on storage.objects;
create policy "Admins can update job images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'jobs' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Admins can delete job images" on storage.objects;
create policy "Admins can delete job images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'jobs' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Public can view hero images" on storage.objects;
create policy "Public can view hero images"
on storage.objects for select
using (bucket_id = 'hero-images');

drop policy if exists "Admins can upload hero images" on storage.objects;
create policy "Admins can upload hero images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'hero-images' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Admins can update hero images" on storage.objects;
create policy "Admins can update hero images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'hero-images' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Admins can delete hero images" on storage.objects;
create policy "Admins can delete hero images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'hero-images' and
  (select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  ))
);

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
on storage.objects for select
using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
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

drop policy if exists "Admins can update blog images" on storage.objects;
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

drop policy if exists "Admins can delete blog images" on storage.objects;
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

drop trigger if exists update_jobs_updated_at on public.jobs;
create trigger update_jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_blog_photo_albums_updated_at on public.blog_photo_albums;
create trigger update_blog_photo_albums_updated_at
  before update on public.blog_photo_albums
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_blog_photos_updated_at on public.blog_photos;
create trigger update_blog_photos_updated_at
  before update on public.blog_photos
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_blog_ai_prompt_settings_updated_at on public.blog_ai_prompt_settings;
create trigger update_blog_ai_prompt_settings_updated_at
  before update on public.blog_ai_prompt_settings
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_blog_post_generation_jobs_updated_at on public.blog_post_generation_jobs;
create trigger update_blog_post_generation_jobs_updated_at
  before update on public.blog_post_generation_jobs
  for each row
  execute function public.update_updated_at_column();
