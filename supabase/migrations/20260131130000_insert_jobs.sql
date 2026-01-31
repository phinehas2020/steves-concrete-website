-- Insert existing jobs into Supabase
-- This migration populates the database with the 16 existing jobs

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

-- Insert images for each job
-- Note: Using a function to insert images for each job based on slug

DO $$
DECLARE
  job_record RECORD;
  img_count INTEGER;
  img_num INTEGER;
BEGIN
  -- 2025-01-27-commercial-concrete-barrier (2 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2025-01-27-commercial-concrete-barrier' LOOP
    FOR img_num IN 1..2 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2025-01-27-commercial-concrete-barrier-' || img_num || '.jpeg', img_num - 1, 'Commercial Concrete Barrier - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2024-04-06-concrete-slab-finishing (3 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2024-04-06-concrete-slab-finishing' LOOP
    FOR img_num IN 1..3 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2024-04-06-concrete-slab-finishing-' || img_num || '.jpeg', img_num - 1, 'Concrete Slab Finishing - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2024-03-27-concrete-formwork (6 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2024-03-27-concrete-formwork' LOOP
    FOR img_num IN 1..6 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2024-03-27-concrete-formwork-' || img_num || '.jpeg', img_num - 1, 'Concrete Formwork - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2024-02-13-foundation-excavation (16 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2024-02-13-foundation-excavation' LOOP
    FOR img_num IN 1..16 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2024-02-13-foundation-excavation-' || img_num || '.jpeg', img_num - 1, 'Foundation Excavation - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-07-07-exposed-aggregate-patio (10 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-07-07-exposed-aggregate-patio' LOOP
    FOR img_num IN 1..10 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-07-07-exposed-aggregate-patio-' || img_num || '.jpeg', img_num - 1, 'Exposed Aggregate Patio - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-06-10-foundation-excavation (3 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-06-10-foundation-excavation' LOOP
    FOR img_num IN 1..3 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-06-10-foundation-excavation-' || img_num || '.jpeg', img_num - 1, 'Foundation Excavation - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-05-08-concrete-slab (4 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-05-08-concrete-slab' LOOP
    FOR img_num IN 1..4 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-05-08-concrete-slab-' || img_num || '.jpeg', img_num - 1, 'Concrete Slab - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-05-01-stained-walkway (1 image)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-05-01-stained-walkway' LOOP
    INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
    VALUES (job_record.id, '/jobs/2017-05-01-stained-walkway-1.jpeg', 0, 'Stained Walkway - Image 1')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- 2017-04-20-site-excavation (10 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-04-20-site-excavation' LOOP
    FOR img_num IN 1..10 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-04-20-site-excavation-' || img_num || '.jpeg', img_num - 1, 'Site Excavation - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-04-10-rebar-prep (8 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-04-10-rebar-prep' LOOP
    FOR img_num IN 1..8 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-04-10-rebar-prep-' || img_num || '.jpeg', img_num - 1, 'Rebar Prep - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-03-28-concrete-slab (3 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-03-28-concrete-slab' LOOP
    FOR img_num IN 1..3 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-03-28-concrete-slab-' || img_num || '.jpeg', img_num - 1, 'Concrete Slab - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-03-18-personal (1 image)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-03-18-personal' LOOP
    INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
    VALUES (job_record.id, '/jobs/2017-03-18-personal-1.jpeg', 0, 'Personal - Image 1')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- 2017-03-08-concrete-finishing (11 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-03-08-concrete-finishing' LOOP
    FOR img_num IN 1..11 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-03-08-concrete-finishing-' || img_num || '.jpeg', img_num - 1, 'Concrete Finishing - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-02-18-construction-site (2 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-02-18-construction-site' LOOP
    FOR img_num IN 1..2 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-02-18-construction-site-' || img_num || '.jpeg', img_num - 1, 'Construction Site - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-02-02-concrete-slab-pour (2 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-02-02-concrete-slab-pour' LOOP
    FOR img_num IN 1..2 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-02-02-concrete-slab-pour-' || img_num || '.jpeg', img_num - 1, 'Concrete Slab Pour - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2017-01-28-concrete-staining (4 images)
  FOR job_record IN SELECT id FROM public.jobs WHERE slug = '2017-01-28-concrete-staining' LOOP
    FOR img_num IN 1..4 LOOP
      INSERT INTO public.job_images (job_id, image_url, image_order, alt_text)
      VALUES (job_record.id, '/jobs/2017-01-28-concrete-staining-' || img_num || '.jpeg', img_num - 1, 'Concrete Staining - Image ' || img_num)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
