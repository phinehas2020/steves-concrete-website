-- Background jobs for blog post generation from selected photos.

create table if not exists public.blog_post_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  requested_by_email text not null,
  status text not null default 'queued',
  target_post_status text not null default 'draft',
  photo_ids uuid[] not null default '{}',
  request_payload jsonb not null default '{}'::jsonb,
  system_prompt text,
  result_post_id uuid references public.blog_posts(id) on delete set null,
  result_post_slug text,
  error_message text,
  attempts integer not null default 0,
  locked_at timestamptz,
  locked_by text,
  constraint blog_post_generation_jobs_status_check
    check (status in ('queued', 'processing', 'completed', 'failed')),
  constraint blog_post_generation_jobs_target_status_check
    check (target_post_status in ('draft', 'published'))
);

create index if not exists idx_blog_post_generation_jobs_status_created
  on public.blog_post_generation_jobs(status, created_at);

create index if not exists idx_blog_post_generation_jobs_requester_created
  on public.blog_post_generation_jobs(requested_by_email, created_at desc);

create index if not exists idx_blog_post_generation_jobs_result_post
  on public.blog_post_generation_jobs(result_post_id);

alter table public.blog_post_generation_jobs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_post_generation_jobs'
      and policyname = 'Admins can read blog post generation jobs'
  ) then
    create policy "Admins can read blog post generation jobs"
      on public.blog_post_generation_jobs for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_post_generation_jobs'
      and policyname = 'Admins can manage blog post generation jobs'
  ) then
    create policy "Admins can manage blog post generation jobs"
      on public.blog_post_generation_jobs for all
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
      where tgname = 'update_blog_post_generation_jobs_updated_at'
    ) then
      create trigger update_blog_post_generation_jobs_updated_at
        before update on public.blog_post_generation_jobs
        for each row
        execute function update_updated_at_column();
    end if;
  end if;
end
$$;
