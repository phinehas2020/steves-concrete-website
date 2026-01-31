-- Remove temporary migration policies after migration is complete
-- Run this AFTER successful migration

DROP POLICY IF EXISTS "Allow service_role to insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow service_role to insert job_images" ON public.job_images;
DROP POLICY IF EXISTS "Allow service_role to insert blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow service_role to insert admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow service_role to insert leads" ON public.leads;
