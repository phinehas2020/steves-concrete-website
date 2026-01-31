-- Export script to get all data from current Supabase
-- Run this on the OLD Supabase instance to export data

-- Export admin_users
SELECT json_agg(row_to_json(t)) FROM (
  SELECT * FROM public.admin_users
) t;

-- Export jobs with their images
SELECT json_agg(row_to_json(t)) FROM (
  SELECT 
    j.*,
    (
      SELECT json_agg(row_to_json(img))
      FROM (
        SELECT * FROM public.job_images 
        WHERE job_id = j.id 
        ORDER BY image_order
      ) img
    ) as images
  FROM public.jobs j
  ORDER BY display_order, date DESC
) t;

-- Export leads (recent 1000)
SELECT json_agg(row_to_json(t)) FROM (
  SELECT * FROM public.leads
  ORDER BY created_at DESC
  LIMIT 1000
) t;

-- Export blog_posts
SELECT json_agg(row_to_json(t)) FROM (
  SELECT * FROM public.blog_posts
  ORDER BY created_at DESC
) t;
