-- Create hero_images table
create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url text not null,
  display_order integer not null default 0,
  alt_text text,
  active boolean not null default true
);

-- Create indexes
create index if not exists idx_hero_images_active on public.hero_images(active);
create index if not exists idx_hero_images_order on public.hero_images(display_order);

-- Enable RLS
alter table public.hero_images enable row level security;

-- Public can read active hero images
create policy "Public can read active hero images"
  on public.hero_images for select
  using (active = true);

-- Admins can manage hero images
create policy "Admins can manage hero images"
  on public.hero_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images',
  'hero-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to hero-images bucket
CREATE POLICY "Public can view hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload hero images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hero-images' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update hero images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'hero-images' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete hero images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'hero-images' AND
  (SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  ))
);
