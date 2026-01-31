-- Insert existing jobs into Supabase
-- Run this via Supabase SQL Editor or MCP

-- First, insert the jobs
INSERT INTO public.jobs (title, slug, category, location, date, date_formatted, description, featured, display_order) VALUES
('Commercial Concrete Barrier', '2025-01-27-commercial-concrete-barrier', 'Commercial', 'Waco, TX', '2025-01-27', 'January 2025', 'Professional commercial concrete barrier project completed in January 2025. Built to commercial standards with durability and longevity in mind.', true, 1),
('Concrete Slab Finishing', '2024-04-06-concrete-slab-finishing', 'Commercial', 'Waco, TX', '2024-04-06', 'April 2024', 'Professional concrete slab finishing project completed in April 2024. Built to commercial standards with durability and longevity in mind.', true, 2),
('Concrete Formwork', '2024-03-27-concrete-formwork', 'Commercial', 'Waco, TX', '2024-03-27', 'March 2024', 'Professional concrete formwork project completed in March 2024. Built to commercial standards with durability and longevity in mind.', true, 3),
('Foundation Excavation', '2024-02-13-foundation-excavation', 'Commercial', 'Waco, TX', '2024-02-13', 'February 2024', 'Professional foundation excavation project completed in February 2024. Built to commercial standards with durability and longevity in mind.', true, 4),
('Exposed Aggregate Patio', '2017-07-07-exposed-aggregate-patio', 'Stamped', 'Waco, TX', '2017-07-07', 'July 2017', 'Professional exposed aggregate patio project completed in July 2017. Features custom stamped concrete patterns and decorative finishes.', false, 5),
('Foundation Excavation', '2017-06-10-foundation-excavation', 'Commercial', 'Waco, TX', '2017-06-10', 'June 2017', 'Professional foundation excavation project completed in June 2017. Built to commercial standards with durability and longevity in mind.', false, 6),
('Concrete Slab', '2017-05-08-concrete-slab', 'Commercial', 'Waco, TX', '2017-05-08', 'May 2017', 'Professional concrete slab project completed in May 2017. Built to commercial standards with durability and longevity in mind.', false, 7),
('Stained Walkway', '2017-05-01-stained-walkway', 'Stamped', 'Waco, TX', '2017-05-01', 'May 2017', 'Professional stained walkway project completed in May 2017. Features custom stamped concrete patterns and decorative finishes.', false, 8),
('Site Excavation', '2017-04-20-site-excavation', 'Commercial', 'Waco, TX', '2017-04-20', 'April 2017', 'Professional site excavation project completed in April 2017. Built to commercial standards with durability and longevity in mind.', false, 9),
('Rebar Prep', '2017-04-10-rebar-prep', 'Commercial', 'Waco, TX', '2017-04-10', 'April 2017', 'Professional rebar prep project completed in April 2017. Built to commercial standards with durability and longevity in mind.', false, 10),
('Concrete Slab', '2017-03-28-concrete-slab', 'Commercial', 'Waco, TX', '2017-03-28', 'March 2017', 'Professional concrete slab project completed in March 2017. Built to commercial standards with durability and longevity in mind.', false, 11),
('Personal', '2017-03-18-personal', 'Commercial', 'Waco, TX', '2017-03-18', 'March 2017', 'Personal project completed in March 2017. Expertly crafted with attention to detail and quality.', false, 12),
('Concrete Finishing', '2017-03-08-concrete-finishing', 'Commercial', 'Waco, TX', '2017-03-08', 'March 2017', 'Professional concrete finishing project completed in March 2017. Built to commercial standards with durability and longevity in mind.', false, 13),
('Construction Site', '2017-02-18-construction-site', 'Commercial', 'Waco, TX', '2017-02-18', 'February 2017', 'Professional construction site project completed in February 2017. Built to commercial standards with durability and longevity in mind.', false, 14),
('Concrete Slab Pour', '2017-02-02-concrete-slab-pour', 'Commercial', 'Waco, TX', '2017-02-02', 'February 2017', 'Professional concrete slab pour project completed in February 2017. Built to commercial standards with durability and longevity in mind.', false, 15),
('Concrete Staining', '2017-01-28-concrete-staining', 'Stamped', 'Waco, TX', '2017-01-28', 'January 2017', 'Professional concrete staining project completed in January 2017. Features custom stamped concrete patterns and decorative finishes.', false, 16)
ON CONFLICT (slug) DO NOTHING;

-- Now insert images for each job
-- Note: This uses the job slugs to find the job IDs, then inserts images
-- You'll need to run this after the jobs are inserted

-- For 2025-01-27-commercial-concrete-barrier (2 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2025-01-27-commercial-concrete-barrier-1.jpeg', 0, 'Commercial Concrete Barrier - Image 1'
FROM public.jobs WHERE slug = '2025-01-27-commercial-concrete-barrier'
ON CONFLICT DO NOTHING;

INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2025-01-27-commercial-concrete-barrier-2.jpeg', 1, 'Commercial Concrete Barrier - Image 2'
FROM public.jobs WHERE slug = '2025-01-27-commercial-concrete-barrier'
ON CONFLICT DO NOTHING;

-- For 2024-04-06-concrete-slab-finishing (3 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2024-04-06-concrete-slab-finishing-' || (generate_series(1, 3))::text || '.jpeg', generate_series(0, 2), 'Concrete Slab Finishing - Image ' || (generate_series(1, 3))::text
FROM public.jobs WHERE slug = '2024-04-06-concrete-slab-finishing'
ON CONFLICT DO NOTHING;

-- For 2024-03-27-concrete-formwork (6 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2024-03-27-concrete-formwork-' || (generate_series(1, 6))::text || '.jpeg', generate_series(0, 5), 'Concrete Formwork - Image ' || (generate_series(1, 6))::text
FROM public.jobs WHERE slug = '2024-03-27-concrete-formwork'
ON CONFLICT DO NOTHING;

-- For 2024-02-13-foundation-excavation (16 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2024-02-13-foundation-excavation-' || (generate_series(1, 16))::text || '.jpeg', generate_series(0, 15), 'Foundation Excavation - Image ' || (generate_series(1, 16))::text
FROM public.jobs WHERE slug = '2024-02-13-foundation-excavation'
ON CONFLICT DO NOTHING;

-- For 2017-07-07-exposed-aggregate-patio (10 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-07-07-exposed-aggregate-patio-' || (generate_series(1, 10))::text || '.jpeg', generate_series(0, 9), 'Exposed Aggregate Patio - Image ' || (generate_series(1, 10))::text
FROM public.jobs WHERE slug = '2017-07-07-exposed-aggregate-patio'
ON CONFLICT DO NOTHING;

-- For 2017-06-10-foundation-excavation (3 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-06-10-foundation-excavation-' || (generate_series(1, 3))::text || '.jpeg', generate_series(0, 2), 'Foundation Excavation - Image ' || (generate_series(1, 3))::text
FROM public.jobs WHERE slug = '2017-06-10-foundation-excavation'
ON CONFLICT DO NOTHING;

-- For 2017-05-08-concrete-slab (4 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-05-08-concrete-slab-' || (generate_series(1, 4))::text || '.jpeg', generate_series(0, 3), 'Concrete Slab - Image ' || (generate_series(1, 4))::text
FROM public.jobs WHERE slug = '2017-05-08-concrete-slab'
ON CONFLICT DO NOTHING;

-- For 2017-05-01-stained-walkway (1 image)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-05-01-stained-walkway-1.jpeg', 0, 'Stained Walkway - Image 1'
FROM public.jobs WHERE slug = '2017-05-01-stained-walkway'
ON CONFLICT DO NOTHING;

-- For 2017-04-20-site-excavation (10 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-04-20-site-excavation-' || (generate_series(1, 10))::text || '.jpeg', generate_series(0, 9), 'Site Excavation - Image ' || (generate_series(1, 10))::text
FROM public.jobs WHERE slug = '2017-04-20-site-excavation'
ON CONFLICT DO NOTHING;

-- For 2017-04-10-rebar-prep (8 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-04-10-rebar-prep-' || (generate_series(1, 8))::text || '.jpeg', generate_series(0, 7), 'Rebar Prep - Image ' || (generate_series(1, 8))::text
FROM public.jobs WHERE slug = '2017-04-10-rebar-prep'
ON CONFLICT DO NOTHING;

-- For 2017-03-28-concrete-slab (3 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-03-28-concrete-slab-' || (generate_series(1, 3))::text || '.jpeg', generate_series(0, 2), 'Concrete Slab - Image ' || (generate_series(1, 3))::text
FROM public.jobs WHERE slug = '2017-03-28-concrete-slab'
ON CONFLICT DO NOTHING;

-- For 2017-03-18-personal (1 image)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-03-18-personal-1.jpeg', 0, 'Personal - Image 1'
FROM public.jobs WHERE slug = '2017-03-18-personal'
ON CONFLICT DO NOTHING;

-- For 2017-03-08-concrete-finishing (11 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-03-08-concrete-finishing-' || (generate_series(1, 11))::text || '.jpeg', generate_series(0, 10), 'Concrete Finishing - Image ' || (generate_series(1, 11))::text
FROM public.jobs WHERE slug = '2017-03-08-concrete-finishing'
ON CONFLICT DO NOTHING;

-- For 2017-02-18-construction-site (2 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-02-18-construction-site-' || (generate_series(1, 2))::text || '.jpeg', generate_series(0, 1), 'Construction Site - Image ' || (generate_series(1, 2))::text
FROM public.jobs WHERE slug = '2017-02-18-construction-site'
ON CONFLICT DO NOTHING;

-- For 2017-02-02-concrete-slab-pour (2 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-02-02-concrete-slab-pour-' || (generate_series(1, 2))::text || '.jpeg', generate_series(0, 1), 'Concrete Slab Pour - Image ' || (generate_series(1, 2))::text
FROM public.jobs WHERE slug = '2017-02-02-concrete-slab-pour'
ON CONFLICT DO NOTHING;

-- For 2017-01-28-concrete-staining (4 images)
INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
SELECT id, '/jobs/2017-01-28-concrete-staining-' || (generate_series(1, 4))::text || '.jpeg', generate_series(0, 3), 'Concrete Staining - Image ' || (generate_series(1, 4))::text
FROM public.jobs WHERE slug = '2017-01-28-concrete-staining'
ON CONFLICT DO NOTHING;
