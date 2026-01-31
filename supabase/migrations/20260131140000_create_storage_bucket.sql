-- Create storage bucket for job images
-- Note: This needs to be run manually in Supabase Dashboard -> Storage
-- Or use the Supabase CLI/MCP to create the bucket

-- Create the jobs bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'jobs',
  'jobs',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to jobs bucket
CREATE POLICY "Public can view job images"
ON storage.objects FOR SELECT
USING (bucket_id = 'jobs');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload job images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update job images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete job images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'jobs' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);
