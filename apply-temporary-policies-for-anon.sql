-- Temporary RLS policies to allow migration with anon key
-- Run this in SQL Editor BEFORE migration

-- Allow anon to insert into jobs
CREATE POLICY IF NOT EXISTS "Allow anon to insert jobs for migration"
ON public.jobs FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to insert into job_images
CREATE POLICY IF NOT EXISTS "Allow anon to insert job_images for migration"
ON public.job_images FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to insert into blog_posts
CREATE POLICY IF NOT EXISTS "Allow anon to insert blog_posts for migration"
ON public.blog_posts FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to insert into admin_users
CREATE POLICY IF NOT EXISTS "Allow anon to insert admin_users for migration"
ON public.admin_users FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to insert into leads
CREATE POLICY IF NOT EXISTS "Allow anon to insert leads for migration"
ON public.leads FOR INSERT
TO anon
WITH CHECK (true);
