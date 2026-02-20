/* global process */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const VALID_STATUSES = new Set(['draft', 'published'])

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

function toTrimmedString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null) return defaultValue
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  const normalized = String(value).trim().toLowerCase()
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true
  if (['false', '0', 'no', 'n'].includes(normalized)) return false
  return defaultValue
}

function buildSiteBaseUrl(req) {
  const host = toTrimmedString(req.headers['x-forwarded-host'] || req.headers.host)
  const protocol = toTrimmedString(req.headers['x-forwarded-proto']) || 'https'
  if (host) return `${protocol}://${host}`
  if (toTrimmedString(process.env.VERCEL_URL)) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

async function requireAdminUser(req, supabase) {
  const authHeader = req.headers.authorization || ''
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i)

  if (!tokenMatch) {
    throw new Error('Missing auth token')
  }

  const token = tokenMatch[1]
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user?.email) {
    throw new Error('Invalid auth token')
  }

  const userEmail = userData.user.email
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('email', userEmail)
    .single()

  if (adminError || !adminUser) {
    throw new Error('Not authorized')
  }

  return adminUser
}

function normalizePhotoIds(body) {
  const rawPhotoIds = Array.isArray(body.photoIds)
    ? body.photoIds
    : Array.isArray(body.photo_ids)
      ? body.photo_ids
      : []

  return rawPhotoIds
    .map((id) => toTrimmedString(id))
    .filter(Boolean)
}

async function triggerWorkerKickoff(baseUrl, jobId) {
  const workerSecret = toTrimmedString(process.env.CRON_SECRET)
  const headers = {
    'Content-Type': 'application/json',
  }

  if (workerSecret) {
    headers.Authorization = `Bearer ${workerSecret}`
  }

  await fetch(`${baseUrl}/api/blog-generate-worker?once=1`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ jobId }),
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
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
    const adminUser = await requireAdminUser(req, supabase)
    const body = normalizeBody(req.body)
    const photoIds = normalizePhotoIds(body)

    if (photoIds.length === 0) {
      res.status(400).json({ error: 'photoIds is required.' })
      return
    }

    const statusInput = toTrimmedString(body.status || '').toLowerCase()
    const targetStatus = toBoolean(body.publish, false)
      ? 'published'
      : VALID_STATUSES.has(statusInput)
        ? statusInput
        : 'draft'

    const systemPrompt = toTrimmedString(body.systemPrompt ?? body.system_prompt) || null
    const requestPayload = {
      title: toTrimmedString(body.title) || null,
      slug: toTrimmedString(body.slug) || null,
      prompt: toTrimmedString(body.prompt) || null,
      excerpt: toTrimmedString(body.excerpt) || null,
      useAiParagraph: toBoolean(body.useAiParagraph ?? body.use_ai_paragraph, true),
    }

    if (systemPrompt) {
      requestPayload.systemPrompt = systemPrompt
    }

    const { data: job, error: insertError } = await supabase
      .from('blog_post_generation_jobs')
      .insert({
        requested_by_email: adminUser.email,
        status: 'queued',
        target_post_status: targetStatus,
        photo_ids: photoIds,
        request_payload: requestPayload,
        system_prompt: systemPrompt,
      })
      .select('id, status, target_post_status, photo_ids, created_at, requested_by_email')
      .single()

    if (insertError) {
      res.status(500).json({ error: 'Failed to queue generation job', details: insertError.message })
      return
    }

    try {
      await triggerWorkerKickoff(buildSiteBaseUrl(req), job.id)
    } catch (kickoffError) {
      console.error('Failed to trigger immediate blog generation worker run:', kickoffError)
    }

    res.status(202).json({
      ok: true,
      job,
      message: 'Blog generation queued. It will continue even if you leave this page.',
    })
  } catch (error) {
    const message = error.message || ''
    const statusCode = /token|authorized|auth/i.test(message) ? 401 : 400
    res.status(statusCode).json({ error: error.message || 'Failed to queue blog generation job' })
  }
}
