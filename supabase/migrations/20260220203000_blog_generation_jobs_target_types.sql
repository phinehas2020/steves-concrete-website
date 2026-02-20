-- Extend generation jobs to support both blog posts and job listings.

alter table public.blog_post_generation_jobs
  add column if not exists target_type text not null default 'blog_post',
  add column if not exists target_job_category text,
  add column if not exists result_job_id uuid references public.jobs(id) on delete set null,
  add column if not exists result_job_slug text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blog_post_generation_jobs_target_type_check'
  ) then
    alter table public.blog_post_generation_jobs
      add constraint blog_post_generation_jobs_target_type_check
      check (target_type in ('blog_post', 'job_listing'));
  end if;
end
$$;

