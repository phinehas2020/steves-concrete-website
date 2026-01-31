-- Temporary RLS policies to allow migration
-- Run this BEFORE migration, then remove after migration is complete

-- Allow service_role to insert into jobs (bypasses RLS)
CREATE POLICY "Allow service_role to insert jobs"
ON public.jobs FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service_role to insert into job_images
CREATE POLICY "Allow service_role to insert job_images"
ON public.job_images FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service_role to insert into blog_posts
CREATE POLICY "Allow service_role to insert blog_posts"
ON public.blog_posts FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service_role to insert into admin_users
CREATE POLICY "Allow service_role to insert admin_users"
ON public.admin_users FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service_role to insert into leads
CREATE POLICY "Allow service_role to insert leads"
ON public.leads FOR INSERT
TO service_role
WITH CHECK (true);
