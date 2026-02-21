/* global process, Buffer */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const blogApiKey = process.env.N8N_BLOG_API_KEY || process.env.BLOG_API_KEY
const blogImageBucket = process.env.BLOG_IMAGES_BUCKET || 'blog-images'
const mirrorIcloudUrls = toBoolean(process.env.BLOG_MIRROR_ICLOUD_URLS ?? 'true', true)
const mirrorAllRemoteImages = toBoolean(process.env.BLOG_MIRROR_REMOTE_IMAGES ?? 'false', false)

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

function normalizeMimeType(value) {
  return toTrimmedString(String(value || '').split(';')[0]).toLowerCase()
}

function fileExtensionForMime(mimeType) {
  const type = String(mimeType || '').toLowerCase()
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpg'
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}

function mimeTypeFromUrl(url) {
  const path = String(url || '').split('?')[0].toLowerCase()
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.gif')) return 'image/gif'
  return ''
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

function hashKey(input) {
  let hash = 2166136261
  const text = String(input || '')
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
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
  return String(value || '').replaceAll('[', '').replaceAll(']', '')
}

function parsePublishedAt(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function parseAlbumToken(value) {
  const raw = toTrimmedString(value)
  if (!raw) return ''
  if (raw.includes('#')) return raw.split('#').pop().trim()
  const pathMatch = raw.match(/sharedalbum\/([a-z0-9]+)/i)
  if (pathMatch?.[1]) return pathMatch[1].trim()
  if (/^[a-z0-9]+$/i.test(raw)) return raw
  return ''
}

function normalizeSourceType(value) {
  const normalized = toTrimmedString(value).toLowerCase()
  if (normalized === 'icloud_shared') return normalized
  if (normalized === 'manual') return normalized
  return 'manual'
}

function normalizeUrlForDedupe(value) {
  const raw = toTrimmedString(value)
  if (!raw) return ''
  if (raw.startsWith('/')) {
    return raw.split(/[?#]/)[0].toLowerCase()
  }

  try {
    const parsed = new URL(raw)
    return `${parsed.hostname}${parsed.pathname}`.toLowerCase()
  } catch {
    return raw.split(/[?#]/)[0].toLowerCase()
  }
}

function buildPhotoDedupeKey(image, index) {
  const guid = toTrimmedString(image.sourceGuid).toLowerCase()
  if (guid) return `guid:${guid}`

  const normalized = normalizeUrlForDedupe(image.url || image.originalUrl)
  if (normalized) return `url:${normalized}`

  const fallback = `${toTrimmedString(image.alt)}-${index + 1}`.trim()
  return `fallback:${fallback || `photo-${index + 1}`}`
}

function shouldMirrorRemoteImageUrl(url) {
  if (!url || url.startsWith('/')) return false
  if (mirrorAllRemoteImages) return true
  if (!mirrorIcloudUrls) return false

  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return hostname.includes('icloud-content.com') || hostname.includes('sharedstreams.icloud.com')
  } catch {
    return false
  }
}

async function mirrorRemoteImageToStorage(supabase, {
  url,
  mimeType,
  postSlug,
  index,
  bucketName,
}) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'website-blog-post-api',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download image ${index + 1} (${response.status}).`)
  }

  const responseMimeType = normalizeMimeType(response.headers.get('content-type'))
  const resolvedMimeType = normalizeMimeType(mimeType) || responseMimeType || mimeTypeFromUrl(url)

  if (!resolvedMimeType || !ALLOWED_IMAGE_MIME_TYPES.has(resolvedMimeType)) {
    throw new Error(`Image ${index + 1} has an unsupported mime type.`)
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer())
  if (!imageBuffer.length) {
    throw new Error(`Image ${index + 1} is empty.`)
  }

  if (imageBuffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image ${index + 1} exceeds ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.`)
  }

  const normalizedRemote = normalizeUrlForDedupe(url)
  const remoteHash = sanitizeFileName(hashKey(normalizedRemote || url))
  const extension = fileExtensionForMime(resolvedMimeType)
  const filePath = `${postSlug}/remote-${index + 1}-${remoteHash}.${extension}`

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, imageBuffer, {
    contentType: resolvedMimeType,
    cacheControl: '31536000',
    upsert: true,
  })

  if (uploadError) {
    throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(filePath)

  return {
    url: publicUrl,
    storagePath: filePath,
  }
}

async function ensurePhotoAlbum(
  supabase,
  {
    albumName,
    albumSourceType,
    albumSourceUrl,
    albumToken,
    albumBaseUrl,
  }
) {
  const normalizedSourceType = normalizeSourceType(albumSourceType)
  const resolvedToken = parseAlbumToken(albumToken || albumSourceUrl)
  const sourceUrl =
    toTrimmedString(albumSourceUrl) ||
    (resolvedToken
      ? `https://www.icloud.com/sharedalbum/#${resolvedToken}`
      : `manual://blog/${slugify(albumName || 'default') || 'default'}`)

  const payload = {
    name: toTrimmedString(albumName) || 'Blog Photo Library',
    source_type: normalizedSourceType,
    source_url: sourceUrl,
    source_token: resolvedToken || null,
    source_base_url: toTrimmedString(albumBaseUrl) || null,
    active: true,
  }

  const { data, error } = await supabase
    .from('blog_photo_albums')
    .upsert(payload, { onConflict: 'source_type,source_url' })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to save blog photo album: ${error.message}`)
  }

  return data?.id || null
}

async function savePhotosToLibrary(
  supabase,
  {
    images,
    albumId,
    defaultBatchKey,
    postTitle,
  }
) {
  if (!Array.isArray(images) || images.length === 0) {
    return []
  }

  const rows = images.map((image, index) => ({
    album_id: albumId || null,
    dedupe_key: buildPhotoDedupeKey(image, index),
    source_photo_guid: toTrimmedString(image.sourceGuid) || null,
    source_asset_key: toTrimmedString(image.sourceAssetKey) || null,
    source_batch_key: toTrimmedString(image.sourceBatchKey || defaultBatchKey) || null,
    source_caption: toTrimmedString(image.sourceCaption) || null,
    source_taken_at: parsePublishedAt(image.sourceTakenAt) || null,
    image_url: image.url,
    storage_path: toTrimmedString(image.storagePath) || null,
    alt_text: toTrimmedString(image.alt) || postTitle || null,
    metadata: {
      uploaded: Boolean(image.uploaded),
      originalUrl: toTrimmedString(image.originalUrl) || null,
      isHeader: Boolean(image.isHeader),
    },
    updated_at: new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from('blog_photos')
    .upsert(rows, { onConflict: 'dedupe_key' })
    .select('id, dedupe_key, image_url, alt_text, source_caption')

  if (error) {
    throw new Error(`Failed to save blog photos: ${error.message}`)
  }

  const byKey = new Map((data || []).map((row) => [row.dedupe_key, row]))
  return rows.map((row) => byKey.get(row.dedupe_key)).filter(Boolean)
}

async function replacePostPhotoLinks(supabase, postId, photos, coverImageUrl) {
  const { error: deleteError } = await supabase
    .from('blog_post_photos')
    .delete()
    .eq('post_id', postId)

  if (deleteError) {
    throw new Error(`Failed to refresh post-photo links: ${deleteError.message}`)
  }

  if (!photos.length) return

  const rows = photos.map((photo, index) => ({
    post_id: postId,
    photo_id: photo.id,
    image_order: index,
    is_cover: Boolean((coverImageUrl && photo.image_url === coverImageUrl) || (!coverImageUrl && index === 0)),
    caption: photo.source_caption || null,
    alt_text: photo.alt_text || null,
  }))

  const { error: insertError } = await supabase.from('blog_post_photos').insert(rows)

  if (insertError) {
    throw new Error(`Failed to create post-photo links: ${insertError.message}`)
  }
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
        sourceGuid: '',
        sourceAssetKey: '',
        sourceBatchKey: '',
        sourceCaption: '',
        sourceTakenAt: '',
      }
    }

    return {
      url: toTrimmedString(rawInput),
      base64: '',
      mimeType: '',
      fileName: '',
      alt: '',
      isHeader: false,
      sourceGuid: '',
      sourceAssetKey: '',
      sourceBatchKey: '',
      sourceCaption: '',
      sourceTakenAt: '',
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
      sourceGuid: '',
      sourceAssetKey: '',
      sourceBatchKey: '',
      sourceCaption: '',
      sourceTakenAt: '',
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
    sourceGuid: toTrimmedString(rawInput.sourceGuid || rawInput.source_guid || rawInput.photoGuid || rawInput.guid),
    sourceAssetKey: toTrimmedString(rawInput.sourceAssetKey || rawInput.source_asset_key || rawInput.assetKey || rawInput.asset_key),
    sourceBatchKey: toTrimmedString(rawInput.sourceBatchKey || rawInput.source_batch_key || rawInput.batchKey || rawInput.batch_key),
    sourceCaption: toTrimmedString(rawInput.sourceCaption || rawInput.source_caption || rawInput.caption || ''),
    sourceTakenAt: toTrimmedString(
      rawInput.sourceTakenAt ||
        rawInput.source_taken_at ||
        rawInput.takenAt ||
        rawInput.taken_at ||
        rawInput.dateCreated ||
        rawInput.createdAt
    ),
  }
}

async function resolveImage(supabase, imageInput, postSlug, index, bucketName) {
  const parsed = parseImageInput(imageInput)

  if (parsed.url) {
    if (!isAllowedUrl(parsed.url)) {
      throw new Error(`Image ${index + 1} has an invalid URL.`)
    }

    if (shouldMirrorRemoteImageUrl(parsed.url)) {
      const mirrored = await mirrorRemoteImageToStorage(supabase, {
        url: parsed.url,
        mimeType: parsed.mimeType,
        postSlug,
        index,
        bucketName,
      })

      return {
        url: mirrored.url,
        alt: parsed.alt,
        isHeader: parsed.isHeader,
        uploaded: true,
        storagePath: mirrored.storagePath,
        originalUrl: parsed.url,
        sourceGuid: parsed.sourceGuid,
        sourceAssetKey: parsed.sourceAssetKey,
        sourceBatchKey: parsed.sourceBatchKey,
        sourceCaption: parsed.sourceCaption,
        sourceTakenAt: parsed.sourceTakenAt,
      }
    }

    return {
      url: parsed.url,
      alt: parsed.alt,
      isHeader: parsed.isHeader,
      uploaded: false,
      storagePath: '',
      originalUrl: parsed.url,
      sourceGuid: parsed.sourceGuid,
      sourceAssetKey: parsed.sourceAssetKey,
      sourceBatchKey: parsed.sourceBatchKey,
      sourceCaption: parsed.sourceCaption,
      sourceTakenAt: parsed.sourceTakenAt,
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
    storagePath: filePath,
    originalUrl: '',
    sourceGuid: parsed.sourceGuid,
    sourceAssetKey: parsed.sourceAssetKey,
    sourceBatchKey: parsed.sourceBatchKey,
    sourceCaption: parsed.sourceCaption,
    sourceTakenAt: parsed.sourceTakenAt,
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
  const persistImagesToLibrary = toBoolean(
    body.persistImagesToLibrary ?? body.persist_images_to_library,
    true
  )
  const linkImagesToPost = toBoolean(body.linkImagesToPost ?? body.link_images_to_post, true)
  const defaultBatchKey = toTrimmedString(body.batchKey || body.batch_key)
  const albumName = toTrimmedString(body.albumName || body.album_name)
  const albumSourceType = toTrimmedString(body.albumSourceType || body.album_source_type)
  const albumSourceUrl = toTrimmedString(body.albumSourceUrl || body.album_source_url || body.albumUrl || body.album_url)
  const albumToken = toTrimmedString(body.albumToken || body.album_token)
  const albumBaseUrl = toTrimmedString(body.albumBaseUrl || body.album_base_url)
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
      const parsed = parseImageInput(image)
      return Boolean(parsed.base64) || shouldMirrorRemoteImageUrl(parsed.url)
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

    let libraryResult = null
    if (persistImagesToLibrary && processedImages.length > 0) {
      try {
        const albumId = await ensurePhotoAlbum(supabase, {
          albumName,
          albumSourceType: albumSourceType || (albumToken || albumSourceUrl ? 'icloud_shared' : 'manual'),
          albumSourceUrl,
          albumToken,
          albumBaseUrl,
        })

        const savedPhotos = await savePhotosToLibrary(supabase, {
          images: processedImages,
          albumId,
          defaultBatchKey,
          postTitle: title,
        })

        if (linkImagesToPost && savedPhotos.length > 0) {
          await replacePostPhotoLinks(supabase, savedPost.id, savedPhotos, coverImageUrl)
        }

        libraryResult = {
          albumId,
          savedPhotoCount: savedPhotos.length,
          linkedToPost: linkImagesToPost,
        }
      } catch (libraryError) {
        console.error('Blog post library sync warning:', libraryError)
        libraryResult = {
          error: libraryError.message || 'Unable to sync image library',
        }
      }
    }

    res.status(200).json({
      ok: true,
      post: savedPost,
      uploadedImages: processedImages.map((image) => ({
        url: image.url,
        alt: image.alt || null,
        uploaded: image.uploaded,
      })),
      library: libraryResult,
    })
  } catch (error) {
    console.error('Blog post API error:', error)
    res.status(400).json({ error: error.message || 'Failed to process request' })
  }
}
