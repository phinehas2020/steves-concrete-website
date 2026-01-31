-- Create jobs table
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

-- Create job_images table
create table if not exists public.job_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  image_url text not null,
  image_order integer not null default 0,
  alt_text text
);

-- Create indexes
create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_featured on public.jobs(featured);
create index if not exists idx_job_images_job_id on public.job_images(job_id);
create index if not exists idx_job_images_order on public.job_images(job_id, image_order);

-- Enable RLS
alter table public.jobs enable row level security;
alter table public.job_images enable row level security;

-- Public can read published jobs
create policy "Public can read jobs"
  on public.jobs for select
  using (true);

-- Public can read job images
create policy "Public can read job images"
  on public.job_images for select
  using (true);

-- Admins can manage jobs
create policy "Admins can manage jobs"
  on public.jobs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can manage job images
create policy "Admins can manage job images"
  on public.job_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_jobs_updated_at
  before update on public.jobs
  for each row
  execute function update_updated_at_column();
