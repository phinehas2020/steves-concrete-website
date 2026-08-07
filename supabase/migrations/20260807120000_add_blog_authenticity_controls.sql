-- Separate public publishing from search approval and retain the evidence used
-- to review first-hand project content.
alter table public.blog_posts
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
    select 1
    from pg_constraint
    where conname = 'blog_posts_seo_status_check'
      and conrelid = 'public.blog_posts'::regclass
  ) then
    alter table public.blog_posts
      add constraint blog_posts_seo_status_check
      check (seo_status in ('needs_facts', 'review', 'approved', 'noindex'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'blog_posts_series_phase_check'
      and conrelid = 'public.blog_posts'::regclass
  ) then
    alter table public.blog_posts
      add constraint blog_posts_series_phase_check
      check (series_phase is null or series_phase > 0);
  end if;
end
$$;

-- Preserve the search state of the existing catalog except for the exact URLs
-- identified in the August 7, 2026 authenticity audit. New posts retain the
-- needs_facts default until a human completes the approval checklist.
update public.blog_posts
set seo_status = 'approved'
where status = 'published';

update public.blog_posts
set seo_status = 'needs_facts'
where slug in (
  'morton-building-barn-dominium-in-chappell-hill-texas',
  'finished-the-burnet-shop-foundation-9600-ft',
  'for-concrete-or-circle-k-lacy-lake-view',
  'shop-foundation-burnet-texas-9600-ft-getting-ready-to-pour-tomorrow-morning-3-am-200-yards',
  'mount-calm-morton-building-shop-foundation-2500-ft',
  'concrete-work-at-magnolia-rv-waco-texas-texas',
  'pouring-sidewalk-city-of-waco',
  'concrete-pour-in-hewitt-texas',
  'concrete-pour-at-cameron-park-zoo',
  'parking-lot-that-we-just-poured-at-melody-grove-housing-complex-waco-texas',
  'resurface-1600-ft-of-old-concrete-in-hubbard-texas',
  'project-update-2026-02-25',
  'shop-foundation-in-georgetown-texas',
  'concrete-retaining-walls-in-resiel-texas-for-oncor-power-transfer-station',
  'we-re-pouring-some-rv-pads-today-at-magnolia-rv',
  'installing-400-feet-of-drainage-channel-in-temple',
  'poured-another-rv-pad-today-in-china-springs',
  'work-completed-today-at-magnolia-rv',
  'adding-handicap-parking-for-melody-grove-housing-in-waco'
);

update public.blog_posts
set canonical_slug = 'circle-k-concrete-flatwork-lacy-lakeview-tx'
where slug = 'for-concrete-or-circle-k-lacy-lake-view'
  and canonical_slug is null;

create index if not exists idx_blog_posts_status_seo_status_published_at
  on public.blog_posts (status, seo_status, published_at desc);

create index if not exists idx_blog_posts_project_series
  on public.blog_posts (project_series_id, series_phase)
  where project_series_id is not null;

comment on column public.blog_posts.seo_status is
  'Search approval is independent from public publishing. Only approved posts belong in the sitemap.';
comment on column public.blog_posts.authenticity_data is
  'Structured first-hand facts and review checklist used before SEO approval.';

-- The original public SELECT policy is row-scoped, not column-scoped. Remove
-- the anonymous table-wide privilege so private review notes, checklist data,
-- and author email cannot be requested directly through the REST API. Public
-- readers retain access only to fields used by published blog pages.
-- Scope the published-row policy to anon as well: authenticated admins retain
-- full-row access through the existing "Admins can read posts" policy, while a
-- signed-in non-admin cannot use the public policy to inspect private columns.
drop policy if exists "Public can read published posts" on public.blog_posts;

create policy "Public can read published posts"
  on public.blog_posts for select
  to anon
  using (status = 'published');

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
