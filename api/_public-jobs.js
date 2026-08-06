import { createClient } from '@supabase/supabase-js'

const JOB_FIELDS =
  'id, created_at, updated_at, title, slug, category, location, date, date_formatted, description, featured, display_order'
const JOB_IMAGE_FIELDS = 'job_id, image_url, image_order, alt_text'

function envString(value) {
  if (typeof value !== 'string') return ''
  return value.split('\0').join('').trim()
}

function formatJobDate(value) {
  if (!value) return ''

  const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

function normalizeJob(job, images = job?.images || []) {
  return {
    ...job,
    dateFormatted: job?.dateFormatted || job?.date_formatted || formatJobDate(job?.date),
    images: [...images]
      .sort((a, b) => (a?.image_order ?? 0) - (b?.image_order ?? 0))
      .map((image) => (typeof image === 'string' ? image : image?.image_url))
      .filter(Boolean),
  }
}

function sortJobs(jobs = []) {
  return [...jobs].sort((a, b) => {
    const aOrder = a.display_order ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.display_order ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  })
}

export function mergePublicJobs(staticJobs = [], remoteJobs = []) {
  const remoteBySlug = new Map(
    remoteJobs
      .filter((job) => job?.slug)
      .map((job) => [job.slug, normalizeJob(job)]),
  )

  const mergedStaticJobs = staticJobs
    .filter((job) => job?.slug)
    .map((job) => {
      const remoteJob = remoteBySlug.get(job.slug)
      remoteBySlug.delete(job.slug)

      return normalizeJob(
        {
          ...remoteJob,
          ...job,
        },
        remoteJob?.images?.length ? remoteJob.images : job.images,
      )
    })

  return sortJobs([...mergedStaticJobs, ...remoteBySlug.values()])
}

export async function fetchPublicJobs({
  env = globalThis.process?.env || {},
  logger = console,
  required = false,
} = {}) {
  const supabaseUrl = envString(env.SUPABASE_URL || env.VITE_SUPABASE_URL)
  const supabaseKey = envString(
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      env.VITE_SUPABASE_ANON_KEY ||
      env.SUPABASE_ANON_KEY ||
      env.SUPABASE_SERVICE_ROLE_KEY,
  )

  if (!supabaseUrl || !supabaseKey) {
    const message = 'Supabase job fetch requires configured Supabase environment variables.'
    if (required) throw new Error(message)
    logger?.warn?.(`Skipping Supabase job fetch: ${message}`)
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(JOB_FIELDS)
    .not('slug', 'is', null)
    .order('display_order', { ascending: true })
    .order('date', { ascending: false })

  if (jobsError) {
    const message = `Supabase job catalog query failed: ${jobsError.message}`
    if (required) throw new Error(message)
    logger?.warn?.(`Skipping Supabase job fetch: ${message}`)
    return []
  }

  const jobIds = (jobs || []).map((job) => job.id).filter(Boolean)
  let jobImages = []

  if (jobIds.length > 0) {
    const { data, error: imagesError } = await supabase
      .from('job_images')
      .select(JOB_IMAGE_FIELDS)
      .in('job_id', jobIds)
      .order('image_order', { ascending: true })

    if (imagesError) {
      logger?.warn?.(`Supabase jobs loaded without images: ${imagesError.message}`)
    } else {
      jobImages = data || []
    }
  }

  const imagesByJobId = new Map()
  for (const image of jobImages) {
    const images = imagesByJobId.get(image.job_id) || []
    images.push(image)
    imagesByJobId.set(image.job_id, images)
  }

  return (jobs || []).map((job) => normalizeJob(job, imagesByJobId.get(job.id) || []))
}
