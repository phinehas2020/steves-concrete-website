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

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function buildExcerpt(markdown, maxLength = 180) {
  const plain = String(markdown || '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!plain) return null
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength).trim()}...`
}

function firstLine(value) {
  const lines = String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  return lines[0] || ''
}

function shortText(value, max = 120) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 3).trim()}...`
}

function buildTitle(photos, requestedTitle) {
  const provided = toTrimmedString(requestedTitle)
  if (provided) return provided

  const captionFromPhoto = photos
    .map((photo) => firstLine(photo.source_caption || photo.alt_text || ''))
    .find(Boolean)

  if (captionFromPhoto) {
    return shortText(captionFromPhoto, 95)
  }

  const dateLabel = new Date().toISOString().slice(0, 10)
  return `Project Update ${dateLabel}`
}

function buildGeneratedContent({ photos, title, prompt }) {
  const normalizedPrompt = toTrimmedString(prompt)
  const introLine = normalizedPrompt
    ? `${normalizedPrompt.replace(/\s+/g, ' ')}`
    : 'New field photo update from Concrete Works LLC.'

  const details = photos
    .map((photo, index) => {
      const caption = shortText(photo.source_caption || photo.alt_text || `Photo ${index + 1}`, 140)
      return `- Photo ${index + 1}: ${caption}`
    })
    .join('\n')

  const markdownImages = photos
    .map((photo, index) => {
      const alt = shortText(photo.alt_text || photo.source_caption || `${title} - Photo ${index + 1}`, 80)
      return `![${alt}](${photo.image_url})`
    })
    .join('\n\n')

  const sections = [
    introLine,
    `Photos included: ${photos.length}.`,
  ]

  if (details) {
    sections.push('## Photo Notes')
    sections.push(details)
  }

  if (markdownImages) {
    sections.push('## Project Photos')
    sections.push(markdownImages)
  }

  return sections.join('\n\n').trim()
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

async function createUniqueSlug(supabase, title, preferredSlug) {
  const base = toTrimmedString(preferredSlug) || slugify(title) || 'project-update'

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`

    const { data: existing, error } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to check slug availability: ${error.message}`)
    }

    if (!existing) {
      return candidate
    }
  }

  return `${base}-${Date.now().toString(36)}`
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

    const rawPhotoIds = Array.isArray(body.photoIds)
      ? body.photoIds
      : Array.isArray(body.photo_ids)
        ? body.photo_ids
        : []

    const requestedPhotoIds = rawPhotoIds
      .map((id) => toTrimmedString(id))
      .filter(Boolean)

    if (requestedPhotoIds.length === 0) {
      res.status(400).json({ error: 'photoIds is required.' })
      return
    }

    const statusInput = toTrimmedString(body.status || '').toLowerCase()
    const status = toBoolean(body.publish, false)
      ? 'published'
      : VALID_STATUSES.has(statusInput)
        ? statusInput
        : 'draft'

    const { data: photos, error: photosError } = await supabase
      .from('blog_photos')
      .select('id, image_url, alt_text, source_caption, source_taken_at, source_batch_key')
      .in('id', requestedPhotoIds)

    if (photosError) {
      res.status(500).json({ error: 'Failed to load selected photos', details: photosError.message })
      return
    }

    const photoMap = new Map((photos || []).map((photo) => [photo.id, photo]))
    const orderedPhotos = requestedPhotoIds.map((id) => photoMap.get(id)).filter(Boolean)

    if (orderedPhotos.length === 0) {
      res.status(404).json({ error: 'No valid photos found for selected IDs.' })
      return
    }

    const title = buildTitle(orderedPhotos, body.title)
    const slug = await createUniqueSlug(supabase, title, body.slug)
    const content = buildGeneratedContent({
      photos: orderedPhotos,
      title,
      prompt: body.prompt,
    })
    const excerpt = toTrimmedString(body.excerpt) || buildExcerpt(content)
    const coverImageUrl = orderedPhotos[0]?.image_url || null

    const payload = {
      title,
      slug,
      excerpt,
      content,
      status,
      cover_image_url: coverImageUrl,
      author_email: adminUser.email,
      published_at: status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const { data: savedPost, error: saveError } = await supabase
      .from('blog_posts')
      .insert(payload)
      .select('id, title, slug, status, cover_image_url, published_at, updated_at')
      .single()

    if (saveError) {
      res.status(500).json({ error: 'Failed to save generated blog post', details: saveError.message })
      return
    }

    const linkRows = orderedPhotos.map((photo, index) => ({
      post_id: savedPost.id,
      photo_id: photo.id,
      image_order: index,
      is_cover: index === 0,
      caption: photo.source_caption || null,
      alt_text: photo.alt_text || null,
    }))

    const { error: linkError } = await supabase.from('blog_post_photos').insert(linkRows)

    if (linkError) {
      res.status(500).json({ error: 'Post saved but linking photos failed', details: linkError.message })
      return
    }

    res.status(200).json({
      ok: true,
      post: savedPost,
      photosUsed: orderedPhotos.length,
      missingPhotoIds: requestedPhotoIds.filter((id) => !photoMap.has(id)),
    })
  } catch (error) {
    const statusCode = /token|authorized|auth/i.test(error.message || '') ? 401 : 400
    res.status(statusCode).json({ error: error.message || 'Failed to generate post from photos' })
  }
}
