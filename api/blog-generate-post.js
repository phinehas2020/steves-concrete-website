import { createClient } from '@supabase/supabase-js'
import {
  sanitizePlainTextInline,
  sanitizePlainTextParagraph,
  toSafeMarkdownImageUrl,
} from '../src/lib/blogMarkdown.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openAiApiKey = process.env.OPENAI_API_KEY
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const OPENAI_MODEL = 'gpt-5-mini-2025-08-07'
const BLOG_AI_PROMPT_KEY = 'blog_photo_post'
const BLOG_SOURCE_PACKET_SCHEMA = 'sla_blog_source_packet_v1'
const GENERATED_BLOG_STATUS = 'draft'
const GENERATED_BLOG_DEFAULT_SEO_STATUS = 'needs_facts'
const GENERATED_BLOG_REVIEW_SEO_STATUS = 'review'
const UNCAPTIONED_PHOTO_ALT = 'Uncaptioned field photo - add job-specific context before review'
const DEFAULT_JOB_LISTING_SYSTEM_PROMPT = [
  'You write short job listing copy for a concrete contractor in Waco, Texas.',
  'Return valid JSON only: {"title":"...","description":"..."}.',
  'Title: 6-14 words, plain language, no quotes.',
  'Description: one short paragraph of 1-2 sentences, practical and down-to-earth.',
  'Do not invent facts. Use only provided context and visible photo details.',
  'No hashtags, no emojis, no bullet points, no markdown.',
].join('\n')
export const DEFAULT_BLOG_SYSTEM_PROMPT = [
  'You turn verified field evidence into a concise project-note draft for SLA Concrete Works.',
  'Use only the supplied job/source packet, Stephen observation, verified facts, and photo captions.',
  'Let the amount of verified evidence determine the length. Do not target a word count.',
  'Write in practical, plain language. Prefer a useful field detail or decision over promotional copy.',
  'Do not add search phrases, calls to action, sales claims, rankings, ratings, or offers.',
  'Do not infer dimensions, quantities, materials, mix design, finish, location, client identity, code compliance, permits, warranty, schedule, or outcome from a photo.',
  'If the evidence does not support a detail, omit it. Never fill gaps with a typical concrete-work assumption.',
  'Do not use bullet points, hashtags, emojis, all caps, or long dashes.',
  'Output only one concise paragraph with no label or markdown.',
].join('\n')

function createHttpError(message, statusCode, details) {
  const error = new Error(message)
  error.statusCode = statusCode
  if (details) {
    error.details = details
  }
  return error
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

export function containsLegacyBlogFormulaPrompt(value) {
  const prompt = toTrimmedString(value)
  if (!prompt) return false

  return (
    /\b90\s*(?:-|to|and)\s*130\s+words?\b/i.test(prompt) ||
    /\bconcrete contractor waco tx\b/i.test(prompt) ||
    /\bfree estimate\b/i.test(prompt)
  )
}

function safeBlogSystemPrompt(value) {
  const prompt = toTrimmedString(value)
  if (!prompt || containsLegacyBlogFormulaPrompt(prompt)) {
    return DEFAULT_BLOG_SYSTEM_PROMPT
  }
  return prompt
}

function isGenericPhotoLabel(value) {
  const text = toTrimmedString(value)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  if (!text) return true

  return (
    /^project photo(?:\s+#?\d+)?$/.test(text) ||
    /^photo(?:\s+#?\d+)?$/.test(text) ||
    /^image(?:\s+#?\d+)?$/.test(text) ||
    /^(?:img|dsc|pic)[_\s-]?\d+$/.test(text)
  )
}

function getMeaningfulPhotoText(photo) {
  const sourceCaption = firstLine(photo?.source_caption || '')
  if (sourceCaption && !isGenericPhotoLabel(sourceCaption)) {
    return sourceCaption
  }

  const altText = firstLine(photo?.alt_text || '')
  if (altText && !isGenericPhotoLabel(altText)) {
    return altText
  }

  return ''
}

function isGenericProjectTitle(value) {
  const title = toTrimmedString(value).replace(/\s+/g, ' ').trim().toLowerCase()
  if (!title) return true

  return (
    /^project update(?:\s+\d{4}(?:-\d{2})?(?:-\d{2})?)?$/.test(title) ||
    /^concrete project update(?:\s+\d{4}(?:-\d{2})?(?:-\d{2})?)?$/.test(title) ||
    /^field draft(?:\s+\d{4}(?:-\d{2})?(?:-\d{2})?)?$/.test(title) ||
    /^untitled(?:\s+(?:project|post|draft))?$/.test(title)
  )
}

function normalizeStringList(value) {
  const items = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/\r?\n/)
      : []

  const seen = new Set()
  const normalized = []
  for (const item of items) {
    const clean = sanitizePlainTextInline(String(item || '').replace(/^[-*\d.)\s]+/, ''), 240)
    const key = clean.toLowerCase()
    if (!clean || seen.has(key)) continue
    seen.add(key)
    normalized.push(clean)
  }
  return normalized
}

function parseSourcePacketPrompt(value) {
  const prompt = toTrimmedString(value)
  if (!prompt || !prompt.startsWith('{')) return null

  try {
    const parsed = JSON.parse(prompt)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    if (parsed.schema && parsed.schema !== BLOG_SOURCE_PACKET_SCHEMA) return null
    return parsed
  } catch {
    return null
  }
}

export function evaluateBlogGenerationEvidence({ body = {}, photos = [], title = '' } = {}) {
  const normalizedBody = normalizeBody(body)
  const parsedPromptPacket = parseSourcePacketPrompt(normalizedBody.prompt)
  const embeddedPacket = parsedPromptPacket || {}
  const explicitPacket =
    normalizedBody.sourcePacket && typeof normalizedBody.sourcePacket === 'object'
      ? normalizedBody.sourcePacket
      : normalizedBody.source_packet && typeof normalizedBody.source_packet === 'object'
        ? normalizedBody.source_packet
        : {}
  const packet = { ...embeddedPacket, ...explicitPacket }

  const sourcePacketId = sanitizePlainTextInline(
    normalizedBody.sourcePacketId ??
      normalizedBody.source_packet_id ??
      packet.sourcePacketId ??
      packet.source_packet_id,
    120
  )
  const stephenObservation = sanitizePlainTextParagraph(
    normalizedBody.stephenObservation ??
      normalizedBody.stephen_observation ??
      packet.stephenObservation ??
      packet.stephen_observation
  )
  const projectContext = sanitizePlainTextParagraph(
    normalizedBody.projectContext ??
      normalizedBody.project_context ??
      packet.projectContext ??
      packet.project_context ??
      (parsedPromptPacket ? '' : normalizedBody.prompt)
  )
  const uniqueFacts = normalizeStringList(
    normalizedBody.uniqueFacts ??
      normalizedBody.unique_facts ??
      packet.uniqueFacts ??
      packet.unique_facts
  )
  const scopeBoundary = sanitizePlainTextParagraph(
    normalizedBody.scopeBoundary ??
      normalizedBody.scope_boundary ??
      packet.scopeBoundary ??
      packet.scope_boundary
  )
  const localDecision = sanitizePlainTextParagraph(
    normalizedBody.localDecision ??
      normalizedBody.local_decision ??
      packet.localDecision ??
      packet.local_decision
  )

  const requestedSeoStatus = toTrimmedString(
    normalizedBody.seoStatus ??
      normalizedBody.seo_status ??
      packet.requestedSeoStatus ??
      packet.requested_seo_status
  ).toLowerCase()
  const meaningfulCaptions = photos.map((photo) => getMeaningfulPhotoText(photo)).filter(Boolean)
  const missingCaptionCount = Math.max(photos.length - meaningfulCaptions.length, 0)

  const missingReviewEvidence = []
  if (!sourcePacketId) missingReviewEvidence.push('job/source packet ID')
  if (!stephenObservation) missingReviewEvidence.push("Stephen's first-hand observation")
  if (uniqueFacts.length < 3) missingReviewEvidence.push('three verified facts unique to this job')
  if (!photos.length || missingCaptionCount > 0) {
    missingReviewEvidence.push('a useful job-specific caption for every selected photo')
  }
  if (isGenericProjectTitle(title)) missingReviewEvidence.push('a job-specific title')

  const reviewRequested = requestedSeoStatus === GENERATED_BLOG_REVIEW_SEO_STATUS
  const seoStatus =
    reviewRequested && missingReviewEvidence.length === 0
      ? GENERATED_BLOG_REVIEW_SEO_STATUS
      : GENERATED_BLOG_DEFAULT_SEO_STATUS

  const sourceNotes = [
    sourcePacketId ? `Job/source packet ID: ${sourcePacketId}` : '',
    projectContext ? `Project context: ${projectContext}` : '',
    stephenObservation ? `Stephen field observation: ${stephenObservation}` : '',
    uniqueFacts.length ? `Verified facts:\n- ${uniqueFacts.join('\n- ')}` : '',
    meaningfulCaptions.length ? `Photo captions:\n- ${meaningfulCaptions.join('\n- ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const sourceSummary =
    missingReviewEvidence.length === 0
      ? `Draft assembled from the internal job record, Stephen Alexander's field observation, and ${meaningfulCaptions.length} captioned field photo${meaningfulCaptions.length === 1 ? '' : 's'}.`
      : 'Draft assembled from selected field photos; first-hand source verification is still incomplete.'

  return {
    schema: BLOG_SOURCE_PACKET_SCHEMA,
    sourcePacketId,
    stephenObservation,
    projectContext,
    uniqueFacts,
    scopeBoundary,
    localDecision,
    meaningfulCaptions,
    missingCaptionCount,
    missingReviewEvidence,
    requestedSeoStatus,
    seoStatus,
    sourceNotes,
    sourceSummary,
  }
}

function chooseLeadPhoto(photos) {
  return photos.find((photo) => getMeaningfulPhotoText(photo)) || photos[0] || null
}

function prioritizePhotosByLead(photos, leadPhoto) {
  if (!leadPhoto?.id) return photos
  const prioritized = [leadPhoto]
  for (const photo of photos) {
    if (photo.id !== leadPhoto.id) {
      prioritized.push(photo)
    }
  }
  return prioritized
}

function collectPhotoComments(photos, maxCount = 4) {
  const seen = new Set()
  const comments = []

  for (const photo of photos) {
    const text = getMeaningfulPhotoText(photo)
    if (!text) continue

    const normalized = text.toLowerCase()
    if (seen.has(normalized)) continue

    seen.add(normalized)
    comments.push(text)

    if (comments.length >= maxCount) break
  }

  return comments
}

function buildDateFormatted(dateInput) {
  const date = new Date(String(dateInput || ''))
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function normalizePhotoIdsFromBody(body) {
  const rawPhotoIds = Array.isArray(body.photoIds)
    ? body.photoIds
    : Array.isArray(body.photo_ids)
      ? body.photo_ids
      : []

  return rawPhotoIds
    .map((id) => toTrimmedString(id))
    .filter(Boolean)
}

async function loadSelectedPhotosForGeneration(supabase, requestedPhotoIds) {
  const { data: photos, error: photosError } = await supabase
    .from('blog_photos')
    .select('id, image_url, alt_text, source_caption, source_taken_at, source_batch_key')
    .in('id', requestedPhotoIds)

  if (photosError) {
    throw createHttpError('Failed to load selected photos', 500, photosError.message)
  }

  const photoMap = new Map((photos || []).map((photo) => [photo.id, photo]))
  const orderedPhotos = requestedPhotoIds.map((id) => photoMap.get(id)).filter(Boolean)

  if (orderedPhotos.length === 0) {
    throw createHttpError('No valid photos found for selected IDs.', 404)
  }

  const leadPhoto = chooseLeadPhoto(orderedPhotos)
  const prioritizedPhotos = prioritizePhotosByLead(orderedPhotos, leadPhoto)
  const photoComments = collectPhotoComments(prioritizedPhotos)

  return {
    photoMap,
    orderedPhotos,
    leadPhoto,
    prioritizedPhotos,
    photoComments,
  }
}

function buildTitle(photos, requestedTitle, leadPhoto) {
  const provided = toTrimmedString(requestedTitle)
  if (provided && !isGenericProjectTitle(provided)) return provided

  const titleCandidates = [leadPhoto, ...photos]
    .filter(Boolean)
    .map((photo) => getMeaningfulPhotoText(photo))
    .filter(Boolean)

  const captionFromPhoto = titleCandidates[0] || ''

  if (captionFromPhoto) {
    return shortText(captionFromPhoto, 95)
  }

  const dateLabel = new Date().toISOString().slice(0, 10)
  return `Field Draft ${dateLabel}`
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

export function sanitizeAiParagraph(value) {
  const bannedClauses = [
    /\b(?:i\s+)?think\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+thought\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+figured\b[^.!?;]*[.!?;]?/gi,
    /\bwe\s+decided\b[^.!?;]*[.!?;]?/gi,
    /\bit\s+felt\b[^.!?;]*[.!?;]?/gi,
    /\blooks\s+like\b/gi,
    /\bconcrete contractor waco tx\b/gi,
    /\b[^.!?;]*(?:call|contact|request|schedule)[^.!?;]*\bfree estimate\b[^.!?;]*[.!?;]?/gi,
    /\bfree estimate\b/gi,
  ]

  let paragraph = sanitizePlainTextParagraph(value)

  for (const pattern of bannedClauses) {
    paragraph = paragraph.replace(pattern, '')
  }

  paragraph = paragraph
    .replace(/\s+([.!?])/g, '$1')
    .replace(/(?:\.\s*){2,}/g, '. ')
  paragraph = sanitizePlainTextParagraph(paragraph)
  if (!paragraph) return ''

  return paragraph
}

function buildFallbackParagraph({ title, evidence, photo }) {
  const facts = Array.isArray(evidence?.uniqueFacts) ? evidence.uniqueFacts.slice(0, 3) : []
  const photoText = getMeaningfulPhotoText(photo)
  const parts = []

  if (facts.length) parts.push(facts.join(' '))
  if (evidence?.stephenObservation) {
    parts.push(`Stephen's field note: ${evidence.stephenObservation}`)
  }
  if (photoText && !facts.some((fact) => fact.toLowerCase() === photoText.toLowerCase())) {
    parts.push(`Photo context: ${photoText}`)
  }

  if (!parts.length) {
    return `Draft for ${title}. Add the internal job record, Stephen's field observation, and job-specific photo captions before review.`
  }

  return sanitizePlainTextParagraph(parts.join(' '))
}

async function loadStoredBlogSystemPrompt(supabase) {
  const { data, error } = await supabase
    .from('blog_ai_prompt_settings')
    .select('system_prompt')
    .eq('key', BLOG_AI_PROMPT_KEY)
    .maybeSingle()

  if (error) {
    console.error('Failed to load blog AI prompt setting:', error)
    return ''
  }

  return toTrimmedString(data?.system_prompt)
}

async function resolveBlogSystemPrompt(supabase, overridePrompt) {
  const override = toTrimmedString(overridePrompt)
  if (override) {
    return {
      systemPrompt: safeBlogSystemPrompt(override),
      source: containsLegacyBlogFormulaPrompt(override) ? 'request-safety-fallback' : 'request',
    }
  }

  const storedPrompt = await loadStoredBlogSystemPrompt(supabase)
  if (storedPrompt) {
    return {
      systemPrompt: safeBlogSystemPrompt(storedPrompt),
      source: containsLegacyBlogFormulaPrompt(storedPrompt) ? 'database-safety-fallback' : 'database',
    }
  }

  return {
    systemPrompt: DEFAULT_BLOG_SYSTEM_PROMPT,
    source: 'default',
  }
}

async function requestSeoParagraph({
  title,
  evidence,
  photo,
  includeImage,
  systemPrompt,
  photoComments = [],
}) {
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it in Vercel project env vars.')
  }

  const promptParts = [
    'Create one evidence-backed field-note paragraph for this draft.',
    'Use only the labeled evidence below. Do not add keywords, a sales offer, or a call to action.',
    'A visible detail is not proof of a dimension, material, client, location, compliance result, or completed scope.',
    'Return only the paragraph with no extra labels or markdown.',
    `Title: ${title}`,
  ]

  if (evidence?.sourcePacketId) {
    promptParts.push(`Internal job/source packet ID: ${evidence.sourcePacketId}`)
  }
  if (evidence?.projectContext) {
    promptParts.push(`Verified project context: ${evidence.projectContext}`)
  }
  if (Array.isArray(evidence?.uniqueFacts) && evidence.uniqueFacts.length) {
    promptParts.push(`Verified job facts: ${evidence.uniqueFacts.join(' | ')}`)
  }
  if (evidence?.stephenObservation) {
    promptParts.push(`Stephen's first-hand observation: ${evidence.stephenObservation}`)
  }
  if (evidence?.scopeBoundary) {
    promptParts.push(`Verified scope boundary: ${evidence.scopeBoundary}`)
  }
  if (evidence?.localDecision) {
    promptParts.push(`Verified local decision: ${evidence.localDecision}`)
  }

  const photoContext =
    getMeaningfulPhotoText(photo) ||
    toTrimmedString(photo?.source_caption || photo?.alt_text)
  if (photoContext) {
    promptParts.push(`Photo details: ${photoContext}`)
  }

  const cleanedComments = Array.isArray(photoComments)
    ? photoComments
      .map((value) => toTrimmedString(value))
      .filter(Boolean)
    : []
  if (cleanedComments.length) {
    promptParts.push(`Selected photo comments: ${cleanedComments.join(' | ')}`)
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
      instructions: safeBlogSystemPrompt(systemPrompt),
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

async function generateSeoParagraphWithPhoto({
  title,
  evidence,
  photo,
  systemPrompt,
  photoComments,
}) {
  try {
    return await requestSeoParagraph({
      title,
      evidence,
      photo,
      includeImage: true,
      systemPrompt,
      photoComments,
    })
  } catch (error) {
    // Signed image URLs can expire; retry once without image but keep the same model.
    const message = String(error?.message || '')
    if (/image|url|download|fetch|invalid_image/i.test(message)) {
      return requestSeoParagraph({
        title,
        evidence,
        photo,
        includeImage: false,
        systemPrompt,
        photoComments,
      })
    }
    throw error
  }
}

function parseStructuredJson(text) {
  const value = toTrimmedString(text)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    const match = value.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function sanitizeJobTitle(value, fallback = '') {
  const cleaned = toTrimmedString(value)
    .replace(/[*#`"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return fallback
  return shortText(cleaned, 95)
}

function sanitizeJobDescription(value, fallback = '') {
  let cleaned = String(value || '')
    .replace(/[*#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return fallback
  if (cleaned.length > 300) {
    cleaned = `${cleaned.slice(0, 297).trim()}...`
  }
  if (!/[.!?]$/.test(cleaned)) {
    cleaned = `${cleaned}.`
  }
  return cleaned
}

function buildFallbackJobCopy({ leadPhoto, comments, category, location }) {
  const primaryText = getMeaningfulPhotoText(leadPhoto) || comments[0] || ''
  const fallbackTitle = primaryText
    ? shortText(primaryText, 95)
    : `${category} Concrete Project in ${location}`

  const detailText = comments.length
    ? comments.join(' ')
    : 'Concrete project photos from the latest field update.'

  const fallbackDescription = sanitizeJobDescription(
    `${detailText} Built with careful prep, clean form work, and durable finish details for long-term performance.`,
    `Concrete project update in ${location}.`
  )

  return {
    title: fallbackTitle,
    description: fallbackDescription,
  }
}

async function requestJobListingCopy({
  leadPhoto,
  comments,
  category,
  location,
  includeImage,
}) {
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it in Vercel project env vars.')
  }

  const promptParts = [
    'Create short copy for a job listing from selected concrete project photos.',
    'Return valid JSON only with keys "title" and "description".',
    `Category: ${category}`,
    `Location: ${location}`,
  ]

  const leadText = getMeaningfulPhotoText(leadPhoto) || ''
  if (leadText) {
    promptParts.push(`Lead photo comment: ${leadText}`)
  }
  if (comments.length) {
    promptParts.push(`Other photo comments: ${comments.join(' | ')}`)
  }

  const content = [
    {
      type: 'input_text',
      text: promptParts.join('\n'),
    },
  ]

  if (includeImage && toTrimmedString(leadPhoto?.image_url)) {
    content.push({
      type: 'input_image',
      image_url: leadPhoto.image_url,
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
      instructions: DEFAULT_JOB_LISTING_SYSTEM_PROMPT,
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

  const output = parseStructuredJson(extractResponseText(responseBody))
  if (!output || typeof output !== 'object') {
    throw new Error('OpenAI did not return valid JSON for job copy.')
  }

  return {
    title: toTrimmedString(output.title),
    description: toTrimmedString(output.description),
    responseId: toTrimmedString(responseBody?.id) || null,
  }
}

async function generateJobListingCopyWithPhoto({ leadPhoto, comments, category, location }) {
  try {
    return await requestJobListingCopy({
      leadPhoto,
      comments,
      category,
      location,
      includeImage: true,
    })
  } catch (error) {
    const message = String(error?.message || '')
    if (/image|url|download|fetch|invalid_image/i.test(message)) {
      return requestJobListingCopy({
        leadPhoto,
        comments,
        category,
        location,
        includeImage: false,
      })
    }
    throw error
  }
}

export function buildGeneratedContent({ photos, title, introParagraph }) {
  const safeTitle = sanitizePlainTextInline(title, 95) || 'Untitled field draft'
  const introLine =
    sanitizePlainTextParagraph(introParagraph) ||
    sanitizePlainTextParagraph(`Draft for ${safeTitle}. Add verified field context before review`)

  const markdownImages = photos
    .map((photo) => {
      const imageUrl = toSafeMarkdownImageUrl(photo?.image_url)
      if (!imageUrl) return ''

      const altSource =
        getMeaningfulPhotoText(photo) || UNCAPTIONED_PHOTO_ALT
      const alt = shortText(sanitizePlainTextInline(altSource), 100) || UNCAPTIONED_PHOTO_ALT

      return `![${alt}](${imageUrl})`
    })
    .filter(Boolean)
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
  const base = toTrimmedString(preferredSlug) || slugify(title) || 'field-draft'

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

async function createUniqueJobSlug(supabase, title, preferredSlug) {
  const base = toTrimmedString(preferredSlug) || slugify(title) || 'concrete-project'

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`

    const { data: existing, error } = await supabase
      .from('jobs')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to check job slug availability: ${error.message}`)
    }

    if (!existing) {
      return candidate
    }
  }

  return `${base}-${Date.now().toString(36)}`
}

async function getNextJobDisplayOrder(supabase) {
  const { data, error } = await supabase
    .from('jobs')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(`Unable to determine next job display order: ${error.message}`)
  }

  if (!Array.isArray(data) || data.length === 0) return 0
  return Number(data[0]?.display_order || 0) + 1
}

export async function generateBlogPostFromPhotoSelection({ supabase, adminEmail, body }) {
  const normalizedBody = normalizeBody(body)
  const requestedPhotoIds = normalizePhotoIdsFromBody(normalizedBody)

  if (requestedPhotoIds.length === 0) {
    throw createHttpError('photoIds is required.', 400)
  }

  const {
    photoMap,
    leadPhoto,
    prioritizedPhotos,
    photoComments,
  } = await loadSelectedPhotosForGeneration(supabase, requestedPhotoIds)

  const title = buildTitle(prioritizedPhotos, normalizedBody.title, leadPhoto)
  const evidence = evaluateBlogGenerationEvidence({
    body: normalizedBody,
    photos: prioritizedPhotos,
    title,
  })
  const slug = await createUniqueSlug(supabase, title, normalizedBody.slug)
  const primaryPhoto = leadPhoto || prioritizedPhotos[0]

  const useAiParagraph = toBoolean(normalizedBody.useAiParagraph ?? normalizedBody.use_ai_paragraph, true)
  let aiMeta = { enabled: false, model: null, responseId: null, systemPromptSource: null }
  let introParagraph = buildFallbackParagraph({
    title,
    evidence,
    photo: primaryPhoto,
  })

  if (useAiParagraph) {
    const { systemPrompt, source: systemPromptSource } = await resolveBlogSystemPrompt(
      supabase,
      normalizedBody.systemPrompt ?? normalizedBody.system_prompt
    )
    const aiResult = await generateSeoParagraphWithPhoto({
      title,
      evidence,
      photo: primaryPhoto,
      systemPrompt,
      photoComments,
    })
    introParagraph = aiResult.paragraph
    aiMeta = {
      enabled: true,
      model: OPENAI_MODEL,
      responseId: aiResult.responseId,
      systemPromptSource,
    }
  }

  const content = buildGeneratedContent({
    photos: prioritizedPhotos,
    title,
    introParagraph,
  })
  const excerpt = toTrimmedString(normalizedBody.excerpt) || buildExcerpt(content)
  const coverImageUrl = prioritizedPhotos[0]?.image_url || null

  const payload = {
    title,
    slug,
    excerpt,
    content,
    status: GENERATED_BLOG_STATUS,
    seo_status: evidence.seoStatus,
    cover_image_url: coverImageUrl,
    author_email: toTrimmedString(adminEmail) || null,
    source_notes: evidence.sourceNotes || null,
    source_summary: evidence.sourceSummary,
    authenticity_data: {
      unique_facts: evidence.uniqueFacts,
      first_hand_observation: evidence.stephenObservation,
      scope_boundary: evidence.scopeBoundary,
      local_decision: evidence.localDecision,
      exact_project_photos: false,
      photo_captions_reviewed: evidence.missingCaptionCount === 0,
      claims_verified: false,
      client_permission_checked: false,
      generator_source_packet_id: evidence.sourcePacketId || null,
      generator_schema: evidence.schema,
      generator_missing_review_evidence: evidence.missingReviewEvidence,
    },
    published_at: null,
    updated_at: new Date().toISOString(),
  }

  const { data: savedPost, error: saveError } = await supabase
    .from('blog_posts')
    .insert(payload)
    .select('id, title, slug, status, seo_status, cover_image_url, published_at, updated_at')
    .single()

  if (saveError) {
    throw createHttpError('Failed to save generated blog post', 500, saveError.message)
  }

  const linkRows = prioritizedPhotos.map((photo, index) => ({
    post_id: savedPost.id,
    photo_id: photo.id,
    image_order: index,
    is_cover: index === 0,
    caption: getMeaningfulPhotoText(photo) || null,
    alt_text: getMeaningfulPhotoText(photo) || null,
  }))

  const { error: linkError } = await supabase.from('blog_post_photos').insert(linkRows)

  if (linkError) {
    throw createHttpError('Post saved but linking photos failed', 500, linkError.message)
  }

  return {
    post: savedPost,
    photosUsed: prioritizedPhotos.length,
    leadPhotoId: prioritizedPhotos[0]?.id || null,
    photoCommentsUsed: photoComments.length,
    missingPhotoIds: requestedPhotoIds.filter((id) => !photoMap.has(id)),
    editorial: {
      status: GENERATED_BLOG_STATUS,
      seoStatus: evidence.seoStatus,
      requestedSeoStatus: evidence.requestedSeoStatus || GENERATED_BLOG_DEFAULT_SEO_STATUS,
      sourcePacketId: evidence.sourcePacketId || null,
      missingReviewEvidence: evidence.missingReviewEvidence,
    },
    ai: aiMeta,
  }
}

export async function generateJobListingFromPhotoSelection({ supabase, body }) {
  const normalizedBody = normalizeBody(body)
  const requestedPhotoIds = normalizePhotoIdsFromBody(normalizedBody)

  if (requestedPhotoIds.length === 0) {
    throw createHttpError('photoIds is required.', 400)
  }

  const {
    photoMap,
    leadPhoto,
    prioritizedPhotos,
    photoComments,
  } = await loadSelectedPhotosForGeneration(supabase, requestedPhotoIds)

  const category = toTrimmedString(
    normalizedBody.jobCategory || normalizedBody.job_category || normalizedBody.category
  ) || 'Commercial'
  const location = toTrimmedString(
    normalizedBody.jobLocation || normalizedBody.job_location || normalizedBody.location
  ) || 'Waco, TX'
  const featured = toBoolean(normalizedBody.featured, false)

  const fallbackCopy = buildFallbackJobCopy({
    leadPhoto,
    comments: photoComments,
    category,
    location,
  })

  const providedTitle = toTrimmedString(normalizedBody.title)
  const providedDescription = toTrimmedString(normalizedBody.description || normalizedBody.prompt)
  const useAiJobCopy = toBoolean(
    normalizedBody.useAiJobCopy ?? normalizedBody.use_ai_job_copy ?? normalizedBody.useAiParagraph,
    true
  )

  let aiMeta = { enabled: false, model: null, responseId: null }
  let aiCopy = { title: '', description: '' }

  if (useAiJobCopy && (!providedTitle || !providedDescription)) {
    try {
      const aiResult = await generateJobListingCopyWithPhoto({
        leadPhoto,
        comments: photoComments,
        category,
        location,
      })
      aiCopy = {
        title: toTrimmedString(aiResult.title),
        description: toTrimmedString(aiResult.description),
      }
      aiMeta = {
        enabled: true,
        model: OPENAI_MODEL,
        responseId: aiResult.responseId,
      }
    } catch {
      aiMeta = {
        enabled: false,
        model: OPENAI_MODEL,
        responseId: null,
      }
    }
  }

  const title = sanitizeJobTitle(providedTitle || aiCopy.title, fallbackCopy.title)
  const description = sanitizeJobDescription(
    providedDescription || aiCopy.description,
    fallbackCopy.description
  )

  const slug = await createUniqueJobSlug(supabase, title, normalizedBody.slug)
  const dateInput = toTrimmedString(normalizedBody.date) || new Date().toISOString().slice(0, 10)
  const parsedDate = new Date(dateInput)
  const safeDate = Number.isNaN(parsedDate.getTime())
    ? new Date().toISOString().slice(0, 10)
    : parsedDate.toISOString().slice(0, 10)
  const dateFormatted = toTrimmedString(normalizedBody.date_formatted) || buildDateFormatted(safeDate)

  const parsedDisplayOrder = Number(normalizedBody.display_order)
  const displayOrder = Number.isFinite(parsedDisplayOrder)
    ? parsedDisplayOrder
    : await getNextJobDisplayOrder(supabase)

  const payload = {
    title,
    slug,
    category,
    location,
    date: safeDate,
    date_formatted: dateFormatted,
    description,
    featured,
    display_order: displayOrder,
  }

  const { data: savedJob, error: saveError } = await supabase
    .from('jobs')
    .insert(payload)
    .select('id, title, slug, category, location, date, date_formatted, featured, display_order')
    .single()

  if (saveError) {
    throw createHttpError('Failed to save generated job listing', 500, saveError.message)
  }

  const imageRows = prioritizedPhotos.map((photo, index) => ({
    job_id: savedJob.id,
    image_url: photo.image_url,
    image_order: index,
    alt_text: shortText(getMeaningfulPhotoText(photo) || photo.alt_text || `${title} photo ${index + 1}`, 100),
  }))

  const { error: imageError } = await supabase.from('job_images').insert(imageRows)

  if (imageError) {
    throw createHttpError('Job saved but adding job images failed', 500, imageError.message)
  }

  return {
    job: savedJob,
    photosUsed: prioritizedPhotos.length,
    leadPhotoId: prioritizedPhotos[0]?.id || null,
    photoCommentsUsed: photoComments.length,
    missingPhotoIds: requestedPhotoIds.filter((id) => !photoMap.has(id)),
    ai: aiMeta,
  }
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
    const result = await generateBlogPostFromPhotoSelection({
      supabase,
      adminEmail: adminUser.email,
      body: req.body,
    })

    res.status(200).json({
      ok: true,
      ...result,
    })
  } catch (error) {
    const message = error.message || ''
    const statusCode = Number.isInteger(error.statusCode)
      ? error.statusCode
      : /token|authorized|auth/i.test(message)
        ? 401
        : /openai|model|api key|responses/i.test(message)
          ? 500
          : 400
    const response = { error: error.message || 'Failed to generate post from photos' }
    if (error?.details) {
      response.details = error.details
    }
    res.status(statusCode).json(response)
  }
}
