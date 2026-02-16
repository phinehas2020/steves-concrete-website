import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const blogApiKey = process.env.N8N_BLOG_API_KEY || process.env.BLOG_API_KEY
const blogImageBucket = process.env.BLOG_IMAGES_BUCKET || 'blog-images'

const MAX_IMAGES = 20
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])
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

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
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

function toInteger(value) {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value !== 'string') return null
  if (!/^-?\d+$/.test(value.trim())) return null
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) ? parsed : null
}

function isAllowedUrl(value) {
  if (!value) return false
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-z0-9+.-]+);base64,([a-z0-9+/=\s]+)$/i)
  if (!match) return null
  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2].replace(/\s+/g, ''),
  }
}

function fileExtensionForMime(mimeType) {
  const type = String(mimeType || '').toLowerCase()
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpg'
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}

function sanitizeFileName(value) {
  const safe = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return safe || 'image'
}

function buildExcerpt(markdown, maxLength = 180) {
  const plain = String(markdown || '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!plain) return null
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength).trim()}...`
}

function escapeMarkdownAlt(value) {
  return String(value || '').replace(/[\[\]]/g, '')
}

function parsePublishedAt(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

async function ensureBucketExists(supabase, bucketName) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    throw new Error(`Unable to verify storage bucket: ${listError.message}`)
  }

  const exists = (buckets || []).some((bucket) => bucket.name === bucketName)
  if (exists) return

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: `${MAX_IMAGE_BYTES}`,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_MIME_TYPES),
  })

  if (createError && !/already exists/i.test(createError.message || '')) {
    throw new Error(`Unable to create storage bucket "${bucketName}": ${createError.message}`)
  }
}

function parseImageInput(rawInput) {
  if (typeof rawInput === 'string') {
    const dataUrl = parseDataUrl(rawInput)
    if (dataUrl) {
      return {
        url: null,
        base64: dataUrl.base64,
        mimeType: dataUrl.mimeType,
        fileName: '',
        alt: '',
        isHeader: false,
      }
    }

    return {
      url: toTrimmedString(rawInput),
      base64: '',
      mimeType: '',
      fileName: '',
      alt: '',
      isHeader: false,
    }
  }

  if (!rawInput || typeof rawInput !== 'object') {
    return {
      url: '',
      base64: '',
      mimeType: '',
      fileName: '',
      alt: '',
      isHeader: false,
    }
  }

  const dataUrl = parseDataUrl(rawInput.dataUrl || rawInput.data_url || '')

  return {
    url: toTrimmedString(rawInput.url),
    base64: toTrimmedString(dataUrl?.base64 || rawInput.base64 || rawInput.data).replace(/\s+/g, ''),
    mimeType: toTrimmedString(dataUrl?.mimeType || rawInput.mimeType || rawInput.mime_type).toLowerCase(),
    fileName: toTrimmedString(rawInput.fileName || rawInput.filename || rawInput.name),
    alt: toTrimmedString(rawInput.alt || rawInput.caption || ''),
    isHeader: toBoolean(rawInput.isHeader ?? rawInput.header, false),
  }
}

async function resolveImage(supabase, imageInput, postSlug, index, bucketName) {
  const parsed = parseImageInput(imageInput)

  if (parsed.url) {
    if (!isAllowedUrl(parsed.url)) {
      throw new Error(`Image ${index + 1} has an invalid URL.`)
    }
    return {
      url: parsed.url,
      alt: parsed.alt,
      isHeader: parsed.isHeader,
      uploaded: false,
    }
  }

  if (!parsed.base64) {
    throw new Error(`Image ${index + 1} is missing URL or base64 data.`)
  }

  if (!parsed.mimeType || !ALLOWED_IMAGE_MIME_TYPES.has(parsed.mimeType)) {
    throw new Error(`Image ${index + 1} has an unsupported mime type.`)
  }

  const imageBuffer = Buffer.from(parsed.base64, 'base64')
  if (!imageBuffer.length) {
    throw new Error(`Image ${index + 1} is empty.`)
  }

  if (imageBuffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image ${index + 1} exceeds ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.`)
  }

  const extension = fileExtensionForMime(parsed.mimeType)
  const baseName = sanitizeFileName(parsed.fileName || `blog-image-${index + 1}`)
  const filePath = `${postSlug}/${Date.now()}-${index + 1}-${baseName}.${extension}`

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, imageBuffer, {
    contentType: parsed.mimeType,
    cacheControl: '31536000',
    upsert: false,
  })

  if (uploadError) {
    throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(filePath)

  return {
    url: publicUrl,
    alt: parsed.alt,
    isHeader: parsed.isHeader,
    uploaded: true,
  }
}

function buildContentWithImages(content, images, title) {
  if (!images.length) return content

  const imageMarkdown = images
    .filter((image) => image.url && !content.includes(image.url))
    .map((image) => {
      const alt = escapeMarkdownAlt(image.alt || title || 'Blog image')
      return `![${alt}](${image.url})`
    })

  if (!imageMarkdown.length) return content
  return `${content.trim()}\n\n${imageMarkdown.join('\n\n')}`
}

function isAuthorized(req, expectedApiKey) {
  const authHeader = req.headers.authorization || ''
  const bearer = authHeader.match(/^Bearer\s+(.+)$/i)?.[1] || ''
  const xApiKey = req.headers['x-api-key'] || ''
  return bearer === expectedApiKey || xApiKey === expectedApiKey
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

  if (!blogApiKey) {
    res.status(500).json({ error: 'Blog API key missing (set N8N_BLOG_API_KEY)' })
    return
  }

  if (!isAuthorized(req, blogApiKey)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const body = normalizeBody(req.body)

  const title = toTrimmedString(body.title)
  const rawContent = toTrimmedString(body.content || body.text)
  const providedSlug = toTrimmedString(body.slug)
  const slug = providedSlug || slugify(title)
  const status = toTrimmedString(body.status || 'published').toLowerCase()
  const excerpt = toTrimmedString(body.excerpt)
  const upsertEnabled = toBoolean(body.upsert, true)
  const appendImagesToContent = toBoolean(body.insertImagesInContent, false)
  const useFirstImageAsHeader = toBoolean(body.useFirstImageAsHeader, true)
  const headerImageIndex = toInteger(body.headerImageIndex)
  const explicitHeaderImageUrl = toTrimmedString(
    body.headerImageUrl ||
      body.header_image_url ||
      body.coverImageUrl ||
      body.cover_image_url ||
      body.featuredImageUrl ||
      body.featured_image_url
  )
  const authorEmail = toTrimmedString(body.authorEmail || body.author_email) || 'n8n@automation'

  if (!title || !rawContent) {
    res.status(400).json({ error: 'Missing required fields: title and content/text' })
    return
  }

  if (!slug) {
    res.status(400).json({ error: 'Unable to create a slug from title' })
    return
  }

  if (!VALID_STATUSES.has(status)) {
    res.status(400).json({ error: 'Invalid status. Use "draft" or "published".' })
    return
  }

  if (explicitHeaderImageUrl && !isAllowedUrl(explicitHeaderImageUrl)) {
    res.status(400).json({ error: 'headerImageUrl must be an absolute URL or root-relative path' })
    return
  }

  const imagesInput = body.images ?? body.image ?? []
  const rawImages = Array.isArray(imagesInput)
    ? imagesInput.filter((item) => item !== null && item !== undefined && item !== '')
    : imagesInput
      ? [imagesInput]
      : []
  if (rawImages.length > MAX_IMAGES) {
    res.status(400).json({ error: `Too many images. Maximum is ${MAX_IMAGES}.` })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    const requiresUpload = rawImages.some((image) => {
      if (typeof image === 'string') return /^data:image\//i.test(image)
      if (!image || typeof image !== 'object') return false
      return Boolean(image.base64 || image.data || image.dataUrl || image.data_url)
    })

    if (requiresUpload) {
      await ensureBucketExists(supabase, blogImageBucket)
    }

    const processedImages = []
    for (let index = 0; index < rawImages.length; index += 1) {
      const processed = await resolveImage(supabase, rawImages[index], slug, index, blogImageBucket)
      processedImages.push(processed)
    }

    let coverImageUrl = explicitHeaderImageUrl || ''

    if (!coverImageUrl && headerImageIndex !== null && headerImageIndex >= 0 && headerImageIndex < processedImages.length) {
      coverImageUrl = processedImages[headerImageIndex].url
    }

    if (!coverImageUrl) {
      const taggedHeader = processedImages.find((image) => image.isHeader)
      if (taggedHeader?.url) {
        coverImageUrl = taggedHeader.url
      }
    }

    if (!coverImageUrl && useFirstImageAsHeader && processedImages[0]?.url) {
      coverImageUrl = processedImages[0].url
    }

    const content = appendImagesToContent
      ? buildContentWithImages(rawContent, processedImages, title)
      : rawContent

    const { data: existingPost, error: existingError } = await supabase
      .from('blog_posts')
      .select('id, published_at')
      .eq('slug', slug)
      .maybeSingle()

    if (existingError) {
      res.status(500).json({ error: 'Unable to check for existing post', details: existingError.message })
      return
    }

    const publishedAtInput = parsePublishedAt(body.publishedAt || body.published_at)
    const publishedAt =
      status === 'published'
        ? publishedAtInput || existingPost?.published_at || new Date().toISOString()
        : null

    const payload = {
      title,
      slug,
      excerpt: excerpt || buildExcerpt(content),
      content,
      status,
      cover_image_url: coverImageUrl || null,
      author_email: authorEmail,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    }

    const query = upsertEnabled
      ? supabase.from('blog_posts').upsert(payload, { onConflict: 'slug' })
      : supabase.from('blog_posts').insert(payload)

    const { data: savedPost, error: saveError } = await query
      .select('id, title, slug, status, cover_image_url, published_at, updated_at')
      .single()

    if (saveError) {
      res.status(500).json({ error: 'Failed to save blog post', details: saveError.message })
      return
    }

    res.status(200).json({
      ok: true,
      post: savedPost,
      uploadedImages: processedImages.map((image) => ({
        url: image.url,
        alt: image.alt || null,
        uploaded: image.uploaded,
      })),
    })
  } catch (error) {
    console.error('Blog post API error:', error)
    res.status(400).json({ error: error.message || 'Failed to process request' })
  }
}
