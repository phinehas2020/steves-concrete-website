-- Complete schema for new Supabase instance
-- Apply all migrations in order

-- ============================================
-- Migration 1: Initial schema (leads, admin_users, blog_posts)
-- ============================================

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  service text,
  message text not null,
  status text not null default 'new',
  source text default 'website',
  page_url text,
  user_agent text,
  ip text
);

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

create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (public.is_admin());

create policy "Admins can read admin list"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

create policy "Super admins can manage admins"
  on public.admin_users for insert
  to authenticated
  with check (public.is_super_admin());

create policy "Super admins can update admins"
  on public.admin_users for update
  to authenticated
  using (public.is_super_admin());

create policy "Super admins can delete admins"
  on public.admin_users for delete
  to authenticated
  using (public.is_super_admin());

create policy "Public can read published posts"
  on public.blog_posts for select
  using (status = 'published');

create policy "Admins can read posts"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin());

create policy "Admins can manage posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update posts"
  on public.blog_posts for update
  to authenticated
  using (public.is_admin());

create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.is_admin());

-- ============================================
-- Migration 2: Jobs tables
-- ============================================

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

create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_featured on public.jobs(featured);
create index if not exists idx_job_images_job_id on public.job_images(job_id);
create index if not exists idx_job_images_order on public.job_images(job_id, image_order);

alter table public.jobs enable row level security;
alter table public.job_images enable row level security;

create policy "Public can read jobs"
  on public.jobs for select
  using (true);

create policy "Public can read job images"
  on public.job_images for select
  using (true);

create policy "Admins can manage jobs"
  on public.jobs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage job images"
  on public.job_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_jobs_updated_at
  before update on public.jobs
  for each row
  execute function update_updated_at_column();

-- ============================================
-- Migration 3: Storage bucket for jobs
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'jobs',
  'jobs',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view job images"
ON storage.objects FOR SELECT
USING (bucket_id = 'jobs');

CREATE POLICY "Admins can upload job images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

CREATE POLICY "Admins can update job images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

CREATE POLICY "Admins can delete job images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);
