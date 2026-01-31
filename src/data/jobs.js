// Jobs data - now fetches from Supabase
import { supabase } from '../lib/supabase'

export const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial']

// Fetch jobs from Supabase
export async function fetchJobs() {
  const { data: jobsData, error } = await supabase
    .from('jobs')
    .select('*')
    .order('display_order', { ascending: true })
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  // Fetch images for each job
  const jobsWithImages = await Promise.all(
    (jobsData || []).map(async (job) => {
      const { data: images } = await supabase
        .from('job_images')
        .select('*')
        .eq('job_id', job.id)
        .order('image_order', { ascending: true })

      return {
        ...job,
        images: (images || []).map((img) => img.image_url),
      }
    })
  )

  return jobsWithImages
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
