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
  author_email text,
  seo_status text not null default 'needs_facts'
    check (seo_status in ('needs_facts', 'review', 'approved', 'noindex')),
  author_name text,
  reviewed_by text,
  reviewed_at timestamptz,
  source_notes text,
  source_summary text,
  canonical_slug text,
  project_series_id text,
  series_phase integer check (series_phase is null or series_phase > 0),
  authenticity_data jsonb not null default '{}'::jsonb
);

create index if not exists idx_blog_posts_status_seo_status_published_at
  on public.blog_posts (status, seo_status, published_at desc);

create index if not exists idx_blog_posts_project_series
  on public.blog_posts (project_series_id, series_phase)
  where project_series_id is not null;

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
  to anon
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

revoke select on table public.blog_posts from anon;

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
) on table public.blog_posts to anon;
