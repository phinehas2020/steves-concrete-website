/* global process */
import { createClient } from '@supabase/supabase-js'
import { generateBlogPostFromPhotoSelection } from './blog-generate-post.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const DEFAULT_BATCH_SIZE = 2

function toTrimmedString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeBody(body) {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body
}

function truncate(value, max = 500) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max - 3).trim()}...`
}

function isAuthorizedWorkerRequest(req) {
  const cronSecret = toTrimmedString(process.env.CRON_SECRET)
  if (!cronSecret) return true

  const authHeader = toTrimmedString(req.headers.authorization || '')
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  return Boolean(token) && token === cronSecret
}

function resolveBatchSize() {
  const parsed = Number(process.env.BLOG_GENERATE_WORKER_BATCH_SIZE || DEFAULT_BATCH_SIZE)
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_BATCH_SIZE
  return Math.min(Math.floor(parsed), 10)
}

function getRequestedJobId(req, body) {
  const bodyJobId = toTrimmedString(body?.jobId || body?.job_id)
  if (bodyJobId) return bodyJobId

  try {
    const requestUrl = new URL(req.url || '', 'https://worker.local')
    return toTrimmedString(requestUrl.searchParams.get('jobId') || requestUrl.searchParams.get('job_id'))
  } catch {
    return ''
  }
}

async function listQueuedJobs(supabase, requestedJobId) {
  if (requestedJobId) {
    const { data, error } = await supabase
      .from('blog_post_generation_jobs')
      .select('id, requested_by_email, target_post_status, photo_ids, request_payload, system_prompt, attempts')
      .eq('id', requestedJobId)
      .eq('status', 'queued')
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to load requested generation job: ${error.message}`)
    }

    return data ? [data] : []
  }

  const { data, error } = await supabase
    .from('blog_post_generation_jobs')
    .select('id, requested_by_email, target_post_status, photo_ids, request_payload, system_prompt, attempts')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(resolveBatchSize())

  if (error) {
    throw new Error(`Failed to load queued generation jobs: ${error.message}`)
  }

  return data || []
}

async function claimJob(supabase, candidate) {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('blog_post_generation_jobs')
    .update({
      status: 'processing',
      started_at: nowIso,
      completed_at: null,
      error_message: null,
      attempts: Number(candidate?.attempts || 0) + 1,
      locked_at: nowIso,
      locked_by: `blog-worker:${toTrimmedString(process.env.VERCEL_REGION) || 'local'}`,
    })
    .eq('id', candidate.id)
    .eq('status', 'queued')
    .select('id, requested_by_email, target_post_status, photo_ids, request_payload, system_prompt')
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to claim generation job ${candidate.id}: ${error.message}`)
  }

  return data || null
}

async function markJobCompleted(supabase, job, result) {
  const { error } = await supabase
    .from('blog_post_generation_jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      result_post_id: result?.post?.id || null,
      result_post_slug: result?.post?.slug || null,
      error_message: null,
      locked_at: null,
      locked_by: null,
    })
    .eq('id', job.id)

  if (error) {
    throw new Error(`Failed to mark generation job ${job.id} complete: ${error.message}`)
  }
}

async function markJobFailed(supabase, job, error) {
  const { error: updateError } = await supabase
    .from('blog_post_generation_jobs')
    .update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: truncate(error?.details || error?.message || 'Unknown worker error', 500),
      locked_at: null,
      locked_by: null,
    })
    .eq('id', job.id)

  if (updateError) {
    console.error(`Failed to mark generation job ${job.id} failed:`, updateError)
  }
}

async function processClaimedJob(supabase, job) {
  const requestPayload = job.request_payload && typeof job.request_payload === 'object'
    ? job.request_payload
    : {}

  const body = {
    ...requestPayload,
    photoIds: Array.isArray(job.photo_ids) ? job.photo_ids : [],
    status: toTrimmedString(job.target_post_status) || 'draft',
  }

  if (toTrimmedString(job.system_prompt) && !toTrimmedString(body.systemPrompt)) {
    body.systemPrompt = job.system_prompt
  }

  const result = await generateBlogPostFromPhotoSelection({
    supabase,
    adminEmail: toTrimmedString(job.requested_by_email),
    body,
  })

  await markJobCompleted(supabase, job, result)
  return result
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!isAuthorizedWorkerRequest(req)) {
    res.status(401).json({ error: 'Unauthorized worker request' })
    return
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    res.status(500).json({ error: 'Supabase server config missing' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    const body = req.method === 'POST' ? normalizeBody(req.body) : {}
    const requestedJobId = getRequestedJobId(req, body)
    const candidates = await listQueuedJobs(supabase, requestedJobId)

    if (!candidates.length) {
      res.status(200).json({
        ok: true,
        claimed: 0,
        completed: 0,
        failed: 0,
        message: 'No queued jobs found.',
      })
      return
    }

    let claimed = 0
    let completed = 0
    let failed = 0
    const processedJobIds = []

    for (const candidate of candidates) {
      const job = await claimJob(supabase, candidate)
      if (!job) continue

      claimed += 1
      processedJobIds.push(job.id)

      try {
        await processClaimedJob(supabase, job)
        completed += 1
      } catch (error) {
        failed += 1
        await markJobFailed(supabase, job, error)
      }
    }

    res.status(200).json({
      ok: true,
      claimed,
      completed,
      failed,
      processedJobIds,
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Blog generation worker failed' })
  }
}
