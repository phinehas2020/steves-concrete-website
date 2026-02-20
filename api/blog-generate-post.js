/* global process */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openAiApiKey = process.env.OPENAI_API_KEY
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const OPENAI_MODEL = 'gpt-5-mini-2025-08-07'
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

function textFromArray(value) {
  if (!Array.isArray(value)) return ''
  return value
    .map((part) => {
      if (typeof part === 'string') return part
      if ((part?.type === 'text' || part?.type === 'output_text') && typeof part?.text === 'string') {
        return part.text
      }
      if (typeof part?.value === 'string') return part.value
      return ''
    })
    .join(' ')
    .trim()
}

function extractResponseText(responseBody) {
  if (!responseBody || typeof responseBody !== 'object') return ''

  if (typeof responseBody.output_text === 'string' && responseBody.output_text.trim()) {
    return responseBody.output_text.trim()
  }

  if (Array.isArray(responseBody.output)) {
    const outputText = responseBody.output
      .map((item) => textFromArray(item?.content))
      .filter(Boolean)
      .join(' ')
      .trim()

    if (outputText) return outputText
  }

  if (Array.isArray(responseBody.choices) && responseBody.choices.length > 0) {
    const first = responseBody.choices[0]
    if (typeof first?.message?.content === 'string' && first.message.content.trim()) {
      return first.message.content.trim()
    }
    const choiceText = textFromArray(first?.message?.content)
    if (choiceText) return choiceText
  }

  return ''
}

function sanitizeAiParagraph(value) {
  const bannedClauses = [
    /\b(?:i\s+)?think\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+thought\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+figured\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+decided\b[^.!?;]*[.!?;]?/gi,
    /\bit\s+felt\b[^.!?;]*[.!?;]?/gi,
    /\blooks\s+like\b/gi,
  ]

  let paragraph = String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[—–]/g, '-')
    .replace(/\s*--+\s*/g, ' ')
    .replace(/#+\s*/g, '')
    .trim()

  for (const pattern of bannedClauses) {
    paragraph = paragraph.replace(pattern, '')
  }

  paragraph = paragraph.replace(/\s+/g, ' ').trim()
  if (!paragraph) return ''

  if (!/[.!?]$/.test(paragraph)) {
    paragraph = `${paragraph}.`
  }

  return paragraph
}

function buildFallbackParagraph({ title, prompt, photo }) {
  const promptText = toTrimmedString(prompt)
  const photoText = toTrimmedString(photo?.source_caption || photo?.alt_text)
  const locationText = /waco|central texas|mclennan/i.test(`${title} ${photoText}`)
    ? ''
    : ' for Waco and Central Texas homeowners'

  const opening = promptText || `Concrete project update${locationText}`
  const detail = photoText || 'fresh field photos from a recent pour and finish'

  return `${opening}: ${detail}. We focus on prep, proper mix, and a clean finish so the slab looks good and holds up in Texas heat.`
}

async function requestSeoParagraph({ title, prompt, photo, includeImage }) {
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it in Vercel project env vars.')
  }

  const promptParts = [
    'Write exactly one paragraph (90-130 words).',
    'Voice: down-to-earth, practical, and honest.',
    'Goal: local SEO without sounding salesy or robotic.',
    'Naturally include terms only where they fit: concrete contractor Waco TX, concrete driveway, concrete patio, concrete repair, free estimate.',
    'No bullet points, no hashtags, no emojis, no all-caps, no long dashes.',
    'Mention what is visible in the photo and quality of the concrete work.',
    `Title: ${title}`,
  ]

  const promptText = toTrimmedString(prompt)
  if (promptText) {
    promptParts.push(`Extra context: ${promptText}`)
  }

  const photoContext = toTrimmedString(photo?.source_caption || photo?.alt_text)
  if (photoContext) {
    promptParts.push(`Photo details: ${photoContext}`)
  }

  const content = [
    {
      type: 'input_text',
      text: promptParts.join('\n'),
    },
  ]

  if (includeImage && toTrimmedString(photo?.image_url)) {
    content.push({
      type: 'input_image',
      image_url: photo.image_url,
      detail: 'auto',
    })
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: 'user',
          content,
        },
      ],
    }),
  })

  const responseText = await response.text()
  let responseBody = {}
  try {
    responseBody = responseText ? JSON.parse(responseText) : {}
  } catch {
    throw new Error(`OpenAI request failed (${response.status}): invalid JSON response`)
  }

  if (!response.ok) {
    const errMessage =
      toTrimmedString(responseBody?.error?.message) ||
      `OpenAI request failed (${response.status})`
    throw new Error(errMessage)
  }

  const paragraph = sanitizeAiParagraph(extractResponseText(responseBody))
  if (!paragraph) {
    throw new Error('OpenAI returned an empty paragraph.')
  }

  return {
    paragraph,
    responseId: toTrimmedString(responseBody?.id) || null,
  }
}

async function generateSeoParagraphWithPhoto({ title, prompt, photo }) {
  try {
    return await requestSeoParagraph({
      title,
      prompt,
      photo,
      includeImage: true,
    })
  } catch (error) {
    // Signed image URLs can expire; retry once without image but keep the same model.
    const message = String(error?.message || '')
    if (/image|url|download|fetch|invalid_image/i.test(message)) {
      return requestSeoParagraph({
        title,
        prompt,
        photo,
        includeImage: false,
      })
    }
    throw error
  }
}

function buildGeneratedContent({ photos, title, introParagraph }) {
  const introLine = toTrimmedString(introParagraph) || `Concrete project update: ${title}.`

  const markdownImages = photos
    .map((photo, index) => {
      const alt = shortText(photo.alt_text || photo.source_caption || `${title} - Photo ${index + 1}`, 80)
      return `![${alt}](${photo.image_url})`
    })
    .join('\n\n')

  const sections = [introLine]
  if (markdownImages) sections.push(markdownImages)

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
    const primaryPhoto = orderedPhotos[0]

    const useAiParagraph = toBoolean(body.useAiParagraph ?? body.use_ai_paragraph, true)
    let aiMeta = { enabled: false, model: null, responseId: null }
    let introParagraph = buildFallbackParagraph({
      title,
      prompt: body.prompt,
      photo: primaryPhoto,
    })

    if (useAiParagraph) {
      const aiResult = await generateSeoParagraphWithPhoto({
        title,
        prompt: body.prompt,
        photo: primaryPhoto,
      })
      introParagraph = aiResult.paragraph
      aiMeta = {
        enabled: true,
        model: OPENAI_MODEL,
        responseId: aiResult.responseId,
      }
    }

    const content = buildGeneratedContent({
      photos: orderedPhotos,
      title,
      introParagraph,
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
      ai: aiMeta,
    })
  } catch (error) {
    const message = error.message || ''
    const statusCode = /token|authorized|auth/i.test(message)
      ? 401
      : /openai|model|api key|responses/i.test(message)
        ? 500
        : 400
    res.status(statusCode).json({ error: error.message || 'Failed to generate post from photos' })
  }
}
