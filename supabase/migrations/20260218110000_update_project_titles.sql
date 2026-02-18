-- Refresh portfolio project titles for featured jobs

update public.jobs
set
  title = 'Sidewalk Concrete Paving',
  description = 'Commercial sidewalk paving project completed in Waco with reinforced sections and clean expansion joint spacing for long-term durability.'
where slug = '2025-01-27-commercial-concrete-barrier';

update public.jobs
set
  title = 'Parking Lot Repairs',
  description = 'Parking lot repair project completed in Waco, including concrete patching, joint cleanup, and surface restoration for daily traffic use.'
where slug = '2024-04-06-concrete-slab-finishing';

update public.jobs
set
  title = 'Retaining Walls',
  description = 'Retaining wall concrete project completed in Waco to stabilize grade changes and improve drainage around the property.'
where slug = '2024-03-27-concrete-formwork';

update public.jobs
set
  title = 'Shop Foundations',
  description = 'Shop foundation slab project completed in Waco with reinforced prep and precise leveling for long-term structural performance.'
where slug = '2024-02-13-foundation-excavation';

update public.job_images
set alt_text = 'Sidewalk Concrete Paving - Image ' || (image_order + 1)
where job_id in (
  select id from public.jobs where slug = '2025-01-27-commercial-concrete-barrier'
);

update public.job_images
set alt_text = 'Parking Lot Repairs - Image ' || (image_order + 1)
where job_id in (
  select id from public.jobs where slug = '2024-04-06-concrete-slab-finishing'
);

update public.job_images
set alt_text = 'Retaining Walls - Image ' || (image_order + 1)
where job_id in (
  select id from public.jobs where slug = '2024-03-27-concrete-formwork'
);

update public.job_images
set alt_text = 'Shop Foundations - Image ' || (image_order + 1)
where job_id in (
  select id from public.jobs where slug = '2024-02-13-foundation-excavation'
);
