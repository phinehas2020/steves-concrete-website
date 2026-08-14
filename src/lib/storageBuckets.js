function envBucket(name, fallback) {
  return import.meta.env[name]?.trim() || fallback
}

export const JOBS_BUCKET = envBucket('VITE_JOBS_BUCKET', 'steves-concrete-jobs')
export const HERO_IMAGES_BUCKET = envBucket(
  'VITE_HERO_IMAGES_BUCKET',
  'steves-concrete-hero-images',
)
