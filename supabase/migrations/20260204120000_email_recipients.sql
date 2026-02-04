-- Create email_recipients table for managing lead notification emails
create table if not exists public.email_recipients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  active boolean not null default true,
  notes text
);

-- Enable RLS
alter table public.email_recipients enable row level security;

-- Admins can read email recipients
create policy "Admins can read email recipients"
  on public.email_recipients for select
  to authenticated
  using (public.is_admin());

-- Admins can insert email recipients
create policy "Admins can insert email recipients"
  on public.email_recipients for insert
  to authenticated
  with check (public.is_admin());

-- Admins can update email recipients
create policy "Admins can update email recipients"
  on public.email_recipients for update
  to authenticated
  using (public.is_admin());

-- Admins can delete email recipients
create policy "Admins can delete email recipients"
  on public.email_recipients for delete
  to authenticated
  using (public.is_admin());
