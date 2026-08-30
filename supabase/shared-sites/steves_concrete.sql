-- Shared Supabase target for Steve's Concrete. Generated from the hosted production bootstrap.
create schema if not exists steves_concrete;
grant usage on schema steves_concrete to anon, authenticated, service_role;

-- Hosted Supabase bootstrap for this project.
-- Paste this into the hosted project's SQL editor, run it once,
-- then rerun the repo migration script to copy rows and storage objects.

create extension if not exists "pgcrypto";

create or replace function steves_concrete.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists steves_concrete.leads (
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

alter table steves_concrete.leads
  add column if not exists lead_quality text not null default 'unreviewed';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_lead_quality_check'
      and conrelid = 'steves_concrete.leads'::regclass
  ) then
    alter table steves_concrete.leads
      add constraint leads_lead_quality_check
      check (lead_quality in ('unreviewed', 'qualified', 'solicitation', 'spam'));
  end if;
end
$$;

create table if not exists steves_concrete.admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  role text not null default 'admin',
  user_id uuid unique references auth.users(id) on delete cascade
);

create table if not exists steves_concrete.blog_posts (
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
  author_email text,
  seo_status text not null default 'needs_facts',
  author_name text,
  reviewed_by text,
  reviewed_at timestamptz,
  source_notes text,
  source_summary text,
  canonical_slug text,
  project_series_id text,
  series_phase integer,
  authenticity_data jsonb not null default '{}'::jsonb
);

alter table steves_concrete.blog_posts
  add column if not exists seo_status text not null default 'needs_facts',
  add column if not exists author_name text,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists source_notes text,
  add column if not exists source_summary text,
  add column if not exists canonical_slug text,
  add column if not exists project_series_id text,
  add column if not exists series_phase integer,
  add column if not exists authenticity_data jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'blog_posts_seo_status_check'
      and conrelid = 'steves_concrete.blog_posts'::regclass
  ) then
    alter table steves_concrete.blog_posts
      add constraint blog_posts_seo_status_check
      check (seo_status in ('needs_facts', 'review', 'approved', 'noindex'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'blog_posts_series_phase_check'
      and conrelid = 'steves_concrete.blog_posts'::regclass
  ) then
    alter table steves_concrete.blog_posts
      add constraint blog_posts_series_phase_check
      check (series_phase is null or series_phase > 0);
  end if;
end
$$;

create table if not exists steves_concrete.jobs (
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

create table if not exists steves_concrete.job_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid not null references steves_concrete.jobs(id) on delete cascade,
  image_url text not null,
  image_order integer not null default 0,
  alt_text text
);

create table if not exists steves_concrete.hero_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url text not null,
  display_order integer not null default 0,
  alt_text text,
  active boolean not null default true
);

create table if not exists steves_concrete.email_recipients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  active boolean not null default true,
  notes text
);

create table if not exists steves_concrete.blog_photo_albums (
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

create table if not exists steves_concrete.blog_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  album_id uuid references steves_concrete.blog_photo_albums(id) on delete set null,
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

create table if not exists steves_concrete.blog_post_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references steves_concrete.blog_posts(id) on delete cascade,
  photo_id uuid not null references steves_concrete.blog_photos(id) on delete cascade,
  image_order integer not null default 0,
  is_cover boolean not null default false,
  caption text,
  alt_text text,
  unique (post_id, photo_id)
);

create table if not exists steves_concrete.blog_ai_prompt_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,
  label text,
  system_prompt text not null
);

create table if not exists steves_concrete.blog_post_generation_jobs (
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
  result_post_id uuid references steves_concrete.blog_posts(id) on delete set null,
  result_post_slug text,
  result_job_id uuid references steves_concrete.jobs(id) on delete set null,
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
  on steves_concrete.leads (created_at desc);

create index if not exists idx_leads_quality_created_at
  on steves_concrete.leads (lead_quality, created_at desc);

create index if not exists idx_leads_ip_created_at
  on steves_concrete.leads (ip, created_at desc)
  where ip is not null;

create index if not exists idx_leads_phone_created_at
  on steves_concrete.leads (phone, created_at desc);

create index if not exists idx_leads_email_created_at
  on steves_concrete.leads (email, created_at desc)
  where email is not null;

create index if not exists idx_jobs_slug on steves_concrete.jobs(slug);
create index if not exists idx_jobs_category on steves_concrete.jobs(category);
create index if not exists idx_jobs_featured on steves_concrete.jobs(featured);
create index if not exists idx_job_images_job_id on steves_concrete.job_images(job_id);
create index if not exists idx_job_images_order on steves_concrete.job_images(job_id, image_order);
create index if not exists idx_hero_images_active on steves_concrete.hero_images(active);
create index if not exists idx_hero_images_order on steves_concrete.hero_images(display_order);
create index if not exists idx_blog_photo_albums_active on steves_concrete.blog_photo_albums(active);
create index if not exists idx_blog_photos_album_id on steves_concrete.blog_photos(album_id);
create index if not exists idx_blog_photos_guid on steves_concrete.blog_photos(source_photo_guid);
create index if not exists idx_blog_photos_batch on steves_concrete.blog_photos(source_batch_key);
create index if not exists idx_blog_photos_taken_at on steves_concrete.blog_photos(source_taken_at desc);
create unique index if not exists idx_blog_photos_album_guid
  on steves_concrete.blog_photos(album_id, source_photo_guid)
  where source_photo_guid is not null;
create index if not exists idx_blog_post_photos_post_order on steves_concrete.blog_post_photos(post_id, image_order);
create index if not exists idx_blog_ai_prompt_settings_key
  on steves_concrete.blog_ai_prompt_settings(key);
create index if not exists idx_blog_posts_status_seo_status_published_at
  on steves_concrete.blog_posts(status, seo_status, published_at desc);
create index if not exists idx_blog_posts_project_series
  on steves_concrete.blog_posts(project_series_id, series_phase)
  where project_series_id is not null;
create index if not exists idx_blog_post_generation_jobs_status_created
  on steves_concrete.blog_post_generation_jobs(status, created_at);
create index if not exists idx_blog_post_generation_jobs_requester_created
  on steves_concrete.blog_post_generation_jobs(requested_by_email, created_at desc);
create index if not exists idx_blog_post_generation_jobs_result_post
  on steves_concrete.blog_post_generation_jobs(result_post_id);

create or replace function steves_concrete.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from steves_concrete.admin_users
    where user_id = (select auth.uid())
  );
$$;

create or replace function steves_concrete.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from steves_concrete.admin_users
    where user_id = (select auth.uid())
      and role = 'super_admin'
  );
$$;

create or replace function steves_concrete.claim_admin_membership()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
begin
  if v_user_id is null or v_email = '' then
    return false;
  end if;

  update steves_concrete.admin_users
  set user_id = v_user_id
  where user_id is null
    and lower(email) = v_email;

  return exists (
    select 1
    from steves_concrete.admin_users
    where user_id = v_user_id
      and lower(email) = v_email
  );
end;
$$;

revoke all on function steves_concrete.is_admin() from public, anon;
revoke all on function steves_concrete.is_super_admin() from public, anon;
revoke all on function steves_concrete.claim_admin_membership() from public, anon;
grant execute on function steves_concrete.is_admin() to authenticated, service_role;
grant execute on function steves_concrete.is_super_admin() to authenticated, service_role;
grant execute on function steves_concrete.claim_admin_membership() to authenticated, service_role;

alter table steves_concrete.leads enable row level security;
alter table steves_concrete.admin_users enable row level security;
alter table steves_concrete.blog_posts enable row level security;
alter table steves_concrete.jobs enable row level security;
alter table steves_concrete.job_images enable row level security;
alter table steves_concrete.hero_images enable row level security;
alter table steves_concrete.email_recipients enable row level security;
alter table steves_concrete.blog_photo_albums enable row level security;
alter table steves_concrete.blog_photos enable row level security;
alter table steves_concrete.blog_post_photos enable row level security;
alter table steves_concrete.blog_ai_prompt_settings enable row level security;
alter table steves_concrete.blog_post_generation_jobs enable row level security;

drop policy if exists "Admins can read leads" on steves_concrete.leads;
create policy "Admins can read leads"
  on steves_concrete.leads for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can update leads" on steves_concrete.leads;
create policy "Admins can update leads"
  on steves_concrete.leads for update
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can delete leads" on steves_concrete.leads;
create policy "Admins can delete leads"
  on steves_concrete.leads for delete
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Allow lead inserts" on steves_concrete.leads;
drop policy if exists "Service role can insert leads" on steves_concrete.leads;
create policy "Service role can insert leads"
  on steves_concrete.leads for insert
  to service_role
  with check (true);

drop policy if exists "Admins can read admin list" on steves_concrete.admin_users;
create policy "Admins can read admin list"
  on steves_concrete.admin_users for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Super admins can manage admins" on steves_concrete.admin_users;
create policy "Super admins can manage admins"
  on steves_concrete.admin_users for insert
  to authenticated
  with check (steves_concrete.is_super_admin());

drop policy if exists "Super admins can update admins" on steves_concrete.admin_users;
create policy "Super admins can update admins"
  on steves_concrete.admin_users for update
  to authenticated
  using (steves_concrete.is_super_admin());

drop policy if exists "Super admins can delete admins" on steves_concrete.admin_users;
create policy "Super admins can delete admins"
  on steves_concrete.admin_users for delete
  to authenticated
  using (steves_concrete.is_super_admin());

drop policy if exists "Public can read published posts" on steves_concrete.blog_posts;
create policy "Public can read published posts"
  on steves_concrete.blog_posts for select
  to anon
  using (status = 'published');

revoke select on table steves_concrete.blog_posts from anon;

grant select (
  id,
  created_at,
  updated_at,
  published_at,
  title,
  slug,
  excerpt,
  content,
  status,
  cover_image_url,
  seo_status,
  author_name,
  reviewed_by,
  reviewed_at,
  source_summary,
  canonical_slug,
  project_series_id,
  series_phase
) on table steves_concrete.blog_posts to anon;

drop policy if exists "Admins can read posts" on steves_concrete.blog_posts;
create policy "Admins can read posts"
  on steves_concrete.blog_posts for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can manage posts" on steves_concrete.blog_posts;
create policy "Admins can manage posts"
  on steves_concrete.blog_posts for insert
  to authenticated
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can update posts" on steves_concrete.blog_posts;
create policy "Admins can update posts"
  on steves_concrete.blog_posts for update
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can delete posts" on steves_concrete.blog_posts;
create policy "Admins can delete posts"
  on steves_concrete.blog_posts for delete
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Public can read jobs" on steves_concrete.jobs;
create policy "Public can read jobs"
  on steves_concrete.jobs for select
  using (true);

drop policy if exists "Public can read job images" on steves_concrete.job_images;
create policy "Public can read job images"
  on steves_concrete.job_images for select
  using (true);

drop policy if exists "Admins can manage jobs" on steves_concrete.jobs;
create policy "Admins can manage jobs"
  on steves_concrete.jobs for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can manage job images" on steves_concrete.job_images;
create policy "Admins can manage job images"
  on steves_concrete.job_images for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Public can read active hero images" on steves_concrete.hero_images;
create policy "Public can read active hero images"
  on steves_concrete.hero_images for select
  using (active = true);

drop policy if exists "Admins can manage hero images" on steves_concrete.hero_images;
create policy "Admins can manage hero images"
  on steves_concrete.hero_images for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can read email recipients" on steves_concrete.email_recipients;
create policy "Admins can read email recipients"
  on steves_concrete.email_recipients for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can insert email recipients" on steves_concrete.email_recipients;
create policy "Admins can insert email recipients"
  on steves_concrete.email_recipients for insert
  to authenticated
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can update email recipients" on steves_concrete.email_recipients;
create policy "Admins can update email recipients"
  on steves_concrete.email_recipients for update
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can delete email recipients" on steves_concrete.email_recipients;
create policy "Admins can delete email recipients"
  on steves_concrete.email_recipients for delete
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can read blog photo albums" on steves_concrete.blog_photo_albums;
create policy "Admins can read blog photo albums"
  on steves_concrete.blog_photo_albums for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can manage blog photo albums" on steves_concrete.blog_photo_albums;
create policy "Admins can manage blog photo albums"
  on steves_concrete.blog_photo_albums for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can read blog photos" on steves_concrete.blog_photos;
create policy "Admins can read blog photos"
  on steves_concrete.blog_photos for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can manage blog photos" on steves_concrete.blog_photos;
create policy "Admins can manage blog photos"
  on steves_concrete.blog_photos for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Public can read photos for published blog posts" on steves_concrete.blog_post_photos;
create policy "Public can read photos for published blog posts"
  on steves_concrete.blog_post_photos for select
  using (
    exists (
      select 1
      from steves_concrete.blog_posts p
      where p.id = post_id and p.status = 'published'
    )
  );

drop policy if exists "Admins can manage blog post photos" on steves_concrete.blog_post_photos;
create policy "Admins can manage blog post photos"
  on steves_concrete.blog_post_photos for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can read blog AI prompt settings" on steves_concrete.blog_ai_prompt_settings;
create policy "Admins can read blog AI prompt settings"
  on steves_concrete.blog_ai_prompt_settings for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can manage blog AI prompt settings" on steves_concrete.blog_ai_prompt_settings;
create policy "Admins can manage blog AI prompt settings"
  on steves_concrete.blog_ai_prompt_settings for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

drop policy if exists "Admins can read blog post generation jobs" on steves_concrete.blog_post_generation_jobs;
create policy "Admins can read blog post generation jobs"
  on steves_concrete.blog_post_generation_jobs for select
  to authenticated
  using (steves_concrete.is_admin());

drop policy if exists "Admins can manage blog post generation jobs" on steves_concrete.blog_post_generation_jobs;
create policy "Admins can manage blog post generation jobs"
  on steves_concrete.blog_post_generation_jobs for all
  to authenticated
  using (steves_concrete.is_admin())
  with check (steves_concrete.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('steves-concrete-jobs', 'steves-concrete-jobs', true, 52428800, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('steves-concrete-hero-images', 'steves-concrete-hero-images', true, 52428800, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('steves-concrete-blog-images', 'steves-concrete-blog-images', true, 10485760, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "Public can view job images" on storage.objects;
create policy "Public can view job images"
on storage.objects for select
using (bucket_id = 'steves-concrete-jobs');

drop policy if exists "Admins can upload job images" on storage.objects;
create policy "Admins can upload job images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'steves-concrete-jobs' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can update job images" on storage.objects;
create policy "Admins can update job images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'steves-concrete-jobs' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can delete job images" on storage.objects;
create policy "Admins can delete job images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'steves-concrete-jobs' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Public can view hero images" on storage.objects;
create policy "Public can view hero images"
on storage.objects for select
using (bucket_id = 'steves-concrete-hero-images');

drop policy if exists "Admins can upload hero images" on storage.objects;
create policy "Admins can upload hero images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'steves-concrete-hero-images' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can update hero images" on storage.objects;
create policy "Admins can update hero images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'steves-concrete-hero-images' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can delete hero images" on storage.objects;
create policy "Admins can delete hero images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'steves-concrete-hero-images' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
on storage.objects for select
using (bucket_id = 'steves-concrete-blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'steves-concrete-blog-images' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'steves-concrete-blog-images' and
  (select steves_concrete.is_admin())
);

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'steves-concrete-blog-images' and
  (select steves_concrete.is_admin())
);

drop trigger if exists update_jobs_updated_at on steves_concrete.jobs;
create trigger update_jobs_updated_at
  before update on steves_concrete.jobs
  for each row
  execute function steves_concrete.update_updated_at_column();

drop trigger if exists update_blog_photo_albums_updated_at on steves_concrete.blog_photo_albums;
create trigger update_blog_photo_albums_updated_at
  before update on steves_concrete.blog_photo_albums
  for each row
  execute function steves_concrete.update_updated_at_column();

drop trigger if exists update_blog_photos_updated_at on steves_concrete.blog_photos;
create trigger update_blog_photos_updated_at
  before update on steves_concrete.blog_photos
  for each row
  execute function steves_concrete.update_updated_at_column();

drop trigger if exists update_blog_ai_prompt_settings_updated_at on steves_concrete.blog_ai_prompt_settings;
create trigger update_blog_ai_prompt_settings_updated_at
  before update on steves_concrete.blog_ai_prompt_settings
  for each row
  execute function steves_concrete.update_updated_at_column();

drop trigger if exists update_blog_post_generation_jobs_updated_at on steves_concrete.blog_post_generation_jobs;
create trigger update_blog_post_generation_jobs_updated_at
  before update on steves_concrete.blog_post_generation_jobs
  for each row
  execute function steves_concrete.update_updated_at_column();


grant select, insert, update, delete on all tables in schema steves_concrete to anon, authenticated, service_role;
grant usage, select on all sequences in schema steves_concrete to anon, authenticated, service_role;
grant execute on all functions in schema steves_concrete to anon, authenticated, service_role;
alter default privileges in schema steves_concrete grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema steves_concrete grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema steves_concrete grant execute on functions to anon, authenticated, service_role;
