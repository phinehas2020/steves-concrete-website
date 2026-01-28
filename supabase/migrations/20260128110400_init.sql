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
