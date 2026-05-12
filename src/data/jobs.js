// Jobs data - now fetches from Supabase
import { supabase } from '../lib/supabase'
import { clientProjects } from './clientProjects'

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
  const categoriesWithJobs = new Set()
  jobs.forEach((job) => {
    if (job?.category) {
      categoriesWithJobs.add(job.category)
    }
  })

  const orderedCategories = [
    ...DEFAULT_JOB_CATEGORIES.filter((category) => categoriesWithJobs.has(category)),
    ...Array.from(categoriesWithJobs)
      .filter((category) => !DEFAULT_JOB_CATEGORIES.includes(category))
      .sort((a, b) => a.localeCompare(b)),
  ]

  return ['All', ...orderedCategories]
}

function sortJobs(jobs = []) {
  return [...jobs].sort((a, b) => {
    const aOrder = a.display_order ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.display_order ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  })
}

function mergeClientProjects(jobsData = []) {
  const existingSlugs = new Set(jobsData.map((job) => job.slug))
  return sortJobs([
    ...clientProjects.filter((project) => !existingSlugs.has(project.slug)),
    ...jobsData,
  ])
}

// Fetch jobs from Supabase
export async function fetchJobs() {
  try {
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
      return mergeClientProjects([])
    }

    if (!jobsData || jobsData.length === 0) {
      console.log('No jobs found in database')
      return mergeClientProjects([])
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

    return mergeClientProjects(jobsWithImages)
  } catch (error) {
    console.error('Error in fetchJobs:', error)
    return mergeClientProjects([])
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
