// Jobs data - now fetches from Supabase
import { supabase } from '../lib/supabase'

export const DEFAULT_JOB_CATEGORIES = [
  'Driveways',
  'Patios',
  'Stamped',
  'Commercial',
  'Residential',
  'Sidewalk Concrete Paving',
  'Parking Lot Repairs',
  'Retaining Walls',
  'Shop Foundations'
]

export function buildCategoryOptions(jobs = []) {
  const mergedCategories = [...DEFAULT_JOB_CATEGORIES]
  jobs.forEach((job) => {
    if (job?.category && !mergedCategories.includes(job.category)) {
      mergedCategories.push(job.category)
    }
  })
  return ['All', ...mergedCategories]
}

function normalizeJobsWithImages(jobs = []) {
  return jobs.map((job) => {
    const nestedImages = Array.isArray(job.job_images) ? job.job_images : []
    const images = nestedImages
      .slice()
      .sort((a, b) => (a.image_order ?? 0) - (b.image_order ?? 0))
      .map((image) => image.image_url)
      .filter(Boolean)

    const { job_images: _jobImages, ...jobWithoutNestedImages } = job
    return {
      ...jobWithoutNestedImages,
      images,
    }
  })
}

// Fetch jobs from Supabase
export async function fetchJobs() {
  try {
    const { data: jobsWithNestedImages, error: nestedError } = await supabase
      .from('jobs')
      .select('*, job_images(image_url, image_order)')
      .order('display_order', { ascending: true })
      .order('date', { ascending: false })

    if (!nestedError && Array.isArray(jobsWithNestedImages)) {
      // This is the fast path when FK relationship discovery works in PostgREST.
      const includesNestedImages =
        jobsWithNestedImages.length === 0 ||
        jobsWithNestedImages.some((job) => Array.isArray(job.job_images))

      if (includesNestedImages) {
        return normalizeJobsWithImages(jobsWithNestedImages)
      }
    }

    if (nestedError) {
      console.warn('Falling back to multi-query jobs fetch:', nestedError.message)
    }

    const { data: jobsData, error } = await supabase
      .from('jobs')
      .select('*')
      .order('display_order', { ascending: true })
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    if (!jobsData || jobsData.length === 0) {
      console.log('No jobs found in database')
      return []
    }

    // Fetch images for each job
    const jobsWithImages = await Promise.all(
      jobsData.map(async (job) => {
        const { data: images, error: imagesError } = await supabase
          .from('job_images')
          .select('*')
          .eq('job_id', job.id)
          .order('image_order', { ascending: true })

        if (imagesError) {
          console.error(`Error fetching images for job ${job.id}:`, imagesError)
        }

        return {
          ...job,
          images: (images || []).map((img) => img.image_url),
        }
      })
    )

    return jobsWithImages
  } catch (error) {
    console.error('Error in fetchJobs:', error)
    throw error
  }
}

// For backward compatibility, export a jobs array that will be populated
// Components should use fetchJobs() instead
export let jobs = []

// Initialize jobs (call this on app load)
export async function initializeJobs() {
  jobs = await fetchJobs()
  return jobs
}

export function getJobBySlug(slug) {
  return jobs.find((job) => job.slug === slug)
}

export function getFeaturedJobs() {
  return jobs.filter((job) => job.featured).slice(0, 4)
}

export function getJobsByCategory(category) {
  if (category === 'All') return jobs
  return jobs.filter((job) => job.category === category)
}
