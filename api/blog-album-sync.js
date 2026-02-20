/* global process */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const MAX_GUIDS_PER_REQUEST = 150
const MAX_SYNC_PHOTOS = Number.parseInt(process.env.ICLOUD_SYNC_MAX_PHOTOS || '120', 10)
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

function parseAlbumToken(value) {
  const raw = toTrimmedString(value)
  if (!raw) return ''
  if (raw.includes('#')) return raw.split('#').pop().trim()
  const pathMatch = raw.match(/sharedalbum\/(?:#)?([a-z0-9]+)/i)
  if (pathMatch?.[1]) return pathMatch[1].trim()
  if (/^[a-z0-9]+$/i.test(raw)) return raw
  return ''
}

function normalizeForMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function shortText(value, max = 120) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 3).trim()}...`
}

function parseDate(value) {
  const date = new Date(String(value || ''))
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
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

function ensureTrailingSlash(value) {
  const raw = toTrimmedString(value)
  if (!raw) return ''
  return raw.endsWith('/') ? raw : `${raw}/`
}

function normalizeSourceUrl(value) {
  const normalized = toTrimmedString(value)
  if (!normalized) return ''
  const token = parseAlbumToken(normalized)
  if (token) return `https://www.icloud.com/sharedalbum/#${token}`
  return normalized
}

function buildBaseUrl({ baseUrl, token }) {
  const provided = ensureTrailingSlash(baseUrl)
  if (provided) return provided

  const envBase = ensureTrailingSlash(process.env.ICLOUD_SHARED_ALBUM_BASE_URL)
  if (envBase) return envBase

  const host = toTrimmedString(process.env.ICLOUD_SHARED_ALBUM_HOST) || 'p110-sharedstreams.icloud.com'
  if (!token) return ''
  return `https://${host}/${token}/sharedstreams/`
}

function extractPhotos(payload) {
  if (Array.isArray(payload?.photos)) return payload.photos
  if (Array.isArray(payload?.body?.photos)) return payload.body.photos
  if (Array.isArray(payload?.results?.photos)) return payload.results.photos
  return []
}

function collectItemMapFromObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null

  const directCandidates = [
    obj.items,
    obj.results?.items,
    obj.results,
    obj.data?.items,
    obj.payload?.items,
    obj.assetUrls,
    obj.webasseturls,
  ]

  for (const candidate of directCandidates) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate) && Object.keys(candidate).length) {
      return candidate
    }
  }

  if (Array.isArray(obj.items) && obj.items.length) {
    const mapped = {}
    obj.items.forEach((row, index) => {
      const key = row?.photoGuid || row?.guid || row?.id || `item_${index}`
      mapped[key] = row
    })
    return mapped
  }

  if (Array.isArray(obj.results) && obj.results.length) {
    const mapped = {}
    obj.results.forEach((row, index) => {
      const key = row?.photoGuid || row?.guid || row?.id || `result_${index}`
      mapped[key] = row
    })
    return mapped
  }

  return null
}

function buildUrl(item) {
  const direct = toTrimmedString(item?.url)
  if (direct) return direct

  const location = toTrimmedString(item?.url_location || item?.urlLocation)
  const path = toTrimmedString(item?.url_path || item?.urlPath)
  if (!location || !path) return ''

  const host = /^https?:\/\//i.test(location) ? location : `https://${location}`
  return `${host}${path}`
}

function isLikelyImage(url) {
  const cleaned = String(url || '').toLowerCase()
  if (!cleaned) return false
  if (/\.(mp4|mov|m4v|avi|wmv|hevc)(?:$|[?#])/i.test(cleaned)) return false
  return /\.(png|jpe?g|webp|gif)(?:$|[?#])/i.test(cleaned)
}

function canonicalUrl(url) {
  return String(url || '')
    .toLowerCase()
    .replace(/[?#].*$/, '')
    .replace(/([_-])\d{3,5}x\d{3,5}(?=\.)/g, '')
    .replace(/([/_-])(thumb|thumbnail|small|preview|low|mobile|tiny)(?=([/_.-]|$))/g, '$1')
}

function qualityScore(url) {
  const value = String(url || '')
  let score = Math.round(value.length / 10)

  if (/(orig|original|master|full|large|high|max)/i.test(value)) score += 1000
  if (/(thumb|thumbnail|small|preview|low|mobile|tiny)/i.test(value)) score -= 1600

  const dim = value.match(/(\d{3,5})[xX](\d{3,5})/)
  if (dim) {
    const width = Number(dim[1])
    const height = Number(dim[2])
    score += Math.round((width * height) / 12000)
  }

  return score
}

function buildBatches(photos) {
  const sorted = [...photos].sort((a, b) => {
    const aTs = Date.parse(String(a.batchDateCreated || a.dateCreated || '')) || 0
    const bTs = Date.parse(String(b.batchDateCreated || b.dateCreated || '')) || 0
    return aTs - bTs
  })

  const batches = []
  let currentBatch = null

  for (const photo of sorted) {
    const caption = toTrimmedString(photo.caption)

    if (caption) {
      if (currentBatch && currentBatch.photos.length) {
        batches.push(currentBatch)
      }

      currentBatch = {
        caption,
        photos: [photo],
      }
      continue
    }

    if (currentBatch) {
      currentBatch.photos.push(photo)
    }
  }

  if (currentBatch && currentBatch.photos.length) {
    batches.push(currentBatch)
  }

  return batches.map((batch) => {
    const guidSet = new Set(
      batch.photos
        .map((photo) => toTrimmedString(photo.photoGuid))
        .filter(Boolean)
        .map((guid) => normalizeForMatch(guid))
    )

    const stableGuids = [...guidSet].sort()
    const batchKey = hashKey(stableGuids.join('|'))
    const lines = String(batch.caption || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const createdAt =
      batch.photos[0]?.batchDateCreated ||
      batch.photos[0]?.dateCreated ||
      new Date().toISOString()

    return {
      ...batch,
      batchKey,
      title: shortText(lines[0] || `Project Update ${createdAt.slice(0, 10)}`, 95),
      excerpt: shortText(lines.join(' '), 170),
      detailText: lines.slice(1).join('\n\n') || 'New photo batch from the field.',
      createdAt,
      normalizedGuids: stableGuids,
    }
  })
}

function collectDerivativeChecksums(photo) {
  const derivatives = photo?.derivatives
  if (!derivatives || typeof derivatives !== 'object') return []

  return Object.values(derivatives)
    .map((variant) => normalizeForMatch(variant?.checksum || ''))
    .filter(Boolean)
}

function buildDedupeKeyFromGuidOrUrl({ normalizedGuid, imageUrl }) {
  if (normalizedGuid) return `guid:${normalizedGuid}`
  return `url:${canonicalUrl(imageUrl)}`
}

function parsePhotoTimestamp(photo) {
  const raw = photo?.batchDateCreated || photo?.dateCreated || ''
  const ts = Date.parse(String(raw))
  if (Number.isNaN(ts)) return 0
  return ts
}

function buildPostContent({ detailText, photos }) {
  const bodyImageMarkdown = photos
    .slice(1)
    .map((photo, index) => `![${photo.alt_text || `Project photo ${index + 2}`}](${photo.image_url})`)
    .join('\n\n')

  const sections = []
  if (detailText) sections.push(detailText)
  sections.push(`Photos in this batch: ${photos.length}`)
  if (bodyImageMarkdown) sections.push(bodyImageMarkdown)

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

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('email', userData.user.email)
    .single()

  if (adminError || !adminUser) {
    throw new Error('Not authorized')
  }

  return adminUser
}

async function fetchIcloudJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'website-blog-album-sync',
    },
    body: JSON.stringify(body || {}),
  })

  const responseText = await response.text()
  if (!response.ok) {
    throw new Error(`iCloud request failed (${response.status})`)
  }

  try {
    return JSON.parse(responseText)
  } catch {
    throw new Error('iCloud response was not valid JSON')
  }
}

async function upsertAlbumRecord(supabase, albumInput) {
  const sourceUrl = normalizeSourceUrl(albumInput.sourceUrl)
  const token = parseAlbumToken(albumInput.sourceToken || sourceUrl)
  const sourceBaseUrl = ensureTrailingSlash(albumInput.sourceBaseUrl)

  const payload = {
    name: toTrimmedString(albumInput.name) || 'iCloud Blog Album',
    source_type: 'icloud_shared',
    source_url: sourceUrl,
    source_token: token || null,
    source_base_url: sourceBaseUrl || null,
    active: true,
    auto_publish: Boolean(albumInput.autoPublish),
  }

  const { data, error } = await supabase
    .from('blog_photo_albums')
    .upsert(payload, { onConflict: 'source_type,source_url' })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to save album configuration: ${error.message}`)
  }

  return data
}

async function createOrUpdatePostForBatch(supabase, {
  batch,
  photos,
  status,
  authorEmail,
}) {
  const titleSlug = slugify(batch.title) || 'project-update'
  const keySuffix = slugify(batch.batchKey).slice(0, 8) || 'batch'
  const slug = `${titleSlug}-${keySuffix}`

  const content = buildPostContent({
    detailText: batch.detailText,
    photos,
  })

  const payload = {
    title: batch.title,
    slug,
    excerpt: batch.excerpt || buildExcerpt(content),
    content,
    status,
    cover_image_url: photos[0]?.image_url || null,
    author_email: authorEmail,
    published_at: status === 'published' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }

  const { data: savedPost, error: saveError } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select('id, title, slug, status, cover_image_url, published_at, updated_at')
    .single()

  if (saveError) {
    throw new Error(`Failed to save generated post: ${saveError.message}`)
  }

  const { error: deleteLinksError } = await supabase
    .from('blog_post_photos')
    .delete()
    .eq('post_id', savedPost.id)

  if (deleteLinksError) {
    throw new Error(`Failed to reset post-photo links: ${deleteLinksError.message}`)
  }

  const linkRows = photos.map((photo, index) => ({
    post_id: savedPost.id,
    photo_id: photo.id,
    image_order: index,
    is_cover: index === 0,
    caption: photo.source_caption || null,
    alt_text: photo.alt_text || null,
  }))

  const { error: linkError } = await supabase.from('blog_post_photos').insert(linkRows)

  if (linkError) {
    throw new Error(`Failed to link generated post photos: ${linkError.message}`)
  }

  return savedPost
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

  let albumIdForError = null

  try {
    const adminUser = await requireAdminUser(req, supabase)
    const body = normalizeBody(req.body)

    const albumIdInput = toTrimmedString(body.albumId || body.album_id)
    const defaultAlbumUrl = normalizeSourceUrl(process.env.ICLOUD_SHARED_ALBUM_URL)

    let albumRecord = null

    if (albumIdInput) {
      const { data: existingAlbum, error: albumError } = await supabase
        .from('blog_photo_albums')
        .select('*')
        .eq('id', albumIdInput)
        .single()

      if (albumError || !existingAlbum) {
        res.status(404).json({ error: 'Album not found.' })
        return
      }

      albumRecord = existingAlbum
    } else {
      const sourceUrl = normalizeSourceUrl(
        body.albumUrl ||
          body.album_url ||
          defaultAlbumUrl
      )

      if (!sourceUrl) {
        res.status(400).json({ error: 'albumUrl is required (or set ICLOUD_SHARED_ALBUM_URL).' })
        return
      }

      albumRecord = await upsertAlbumRecord(supabase, {
        name: toTrimmedString(body.albumName || body.album_name) || 'iCloud Blog Album',
        sourceUrl,
        sourceToken: toTrimmedString(body.albumToken || body.album_token),
        sourceBaseUrl: toTrimmedString(body.baseUrl || body.base_url || process.env.ICLOUD_SHARED_ALBUM_BASE_URL),
        autoPublish: toBoolean(body.autoPublish ?? body.auto_publish, false),
      })
    }

    albumIdForError = albumRecord?.id || null

    const token = parseAlbumToken(body.albumToken || body.album_token || albumRecord.source_token || albumRecord.source_url)
    if (!token) {
      res.status(400).json({ error: 'Could not parse iCloud album token.' })
      return
    }

    const baseUrl = buildBaseUrl({
      baseUrl: toTrimmedString(body.baseUrl || body.base_url || albumRecord.source_base_url),
      token,
    })

    if (!baseUrl) {
      res.status(400).json({ error: 'Could not build iCloud base URL.' })
      return
    }

    const webstreamPayload = await fetchIcloudJson(`${baseUrl}webstream`, {
      streamCtag: null,
    })

    const photos = extractPhotos(webstreamPayload)

    if (!photos.length) {
      await supabase
        .from('blog_photo_albums')
        .update({
          last_synced_at: new Date().toISOString(),
          last_sync_status: 'ok',
          last_sync_error: null,
          source_token: token,
          source_base_url: baseUrl,
        })
        .eq('id', albumRecord.id)

      res.status(200).json({
        ok: true,
        album: {
          id: albumRecord.id,
          name: albumRecord.name,
          source_url: albumRecord.source_url,
        },
        imported: 0,
        updated: 0,
        totalPhotosSeen: 0,
      })
      return
    }

    const guidSeen = new Set()
    const guidRecords = []

    for (const photo of photos) {
      const rawGuid = toTrimmedString(photo.photoGuid || photo.guid)
      const normalized = normalizeForMatch(rawGuid)
      if (!normalized || guidSeen.has(normalized)) continue
      guidSeen.add(normalized)
      guidRecords.push({
        guid: rawGuid,
        normalizedGuid: normalized,
        derivativeChecksums: collectDerivativeChecksums(photo),
        source: photo,
      })
    }

    if (!guidRecords.length) {
      res.status(400).json({ error: 'No photo GUIDs found from iCloud payload.' })
      return
    }

    const maxSyncPhotos = Number.isFinite(MAX_SYNC_PHOTOS) && MAX_SYNC_PHOTOS > 0 ? MAX_SYNC_PHOTOS : 120
    const guidRecordsForSync = [...guidRecords]
      .sort((a, b) => parsePhotoTimestamp(b.source) - parsePhotoTimestamp(a.source))
      .slice(0, maxSyncPhotos)

    const assetMap = {}

    for (let index = 0; index < guidRecordsForSync.length; index += MAX_GUIDS_PER_REQUEST) {
      const chunk = guidRecordsForSync.slice(index, index + MAX_GUIDS_PER_REQUEST).map((item) => item.guid)
      const assetPayload = await fetchIcloudJson(`${baseUrl}webasseturls`, {
        photoGuids: chunk,
      })

      const mapsToMerge = [assetPayload, assetPayload?.body, assetPayload?.results]
      for (const candidate of mapsToMerge) {
        const itemMap = collectItemMapFromObject(candidate)
        if (!itemMap) continue
        for (const [key, value] of Object.entries(itemMap)) {
          assetMap[key] = value
        }
      }
    }

    const entries = Object.entries(assetMap).map(([key, value], index) => ({
      key,
      normalizedKey: normalizeForMatch(key),
      item: value,
      index,
    }))

    if (!entries.length) {
      res.status(400).json({ error: 'No image asset URLs were returned from iCloud.' })
      return
    }

    const bestByGuid = new Map()

    for (const record of guidRecordsForSync) {
      const matches = entries.filter((entry) => {
        if (record.derivativeChecksums.includes(entry.normalizedKey)) return true
        if (entry.normalizedKey === record.normalizedGuid) return true
        if (entry.normalizedKey.includes(record.normalizedGuid)) return true
        const pathMatch = normalizeForMatch(
          entry.item?.url_path ||
            entry.item?.urlPath ||
            entry.item?.url ||
            ''
        )
        return Boolean(pathMatch && pathMatch.includes(record.normalizedGuid))
      })

      const candidates = matches
        .map((entry) => {
          const url = buildUrl(entry.item)
          if (!url || !isLikelyImage(url)) return null

          return {
            url,
            score: qualityScore(url),
            assetKey: entry.key,
            entryIndex: entry.index,
          }
        })
        .filter(Boolean)

      if (!candidates.length) continue

      const bestByCanonical = new Map()
      for (const candidate of candidates) {
        const key = canonicalUrl(candidate.url)
        const previous = bestByCanonical.get(key)
        if (!previous || candidate.score > previous.score) {
          bestByCanonical.set(key, candidate)
        }
      }

      const ranked = [...bestByCanonical.values()].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.entryIndex - b.entryIndex
      })

      if (ranked[0]) {
        bestByGuid.set(record.normalizedGuid, ranked[0])
      }
    }

    const batches = buildBatches(photos)
    const newestBatch = batches[batches.length - 1] || null
    const batchByGuid = new Map()

    for (const batch of batches) {
      for (const normalizedGuid of batch.normalizedGuids) {
        batchByGuid.set(normalizedGuid, batch)
      }
    }

    const photoRows = []

    for (let index = 0; index < guidRecordsForSync.length; index += 1) {
      const record = guidRecordsForSync[index]
      const match = bestByGuid.get(record.normalizedGuid)
      if (!match) continue

      const batch = batchByGuid.get(record.normalizedGuid)
      const caption = toTrimmedString(record.source.caption)
      const takenAt = parseDate(record.source.batchDateCreated || record.source.dateCreated)

      photoRows.push({
        album_id: albumRecord.id,
        dedupe_key: buildDedupeKeyFromGuidOrUrl({
          normalizedGuid: record.normalizedGuid,
          imageUrl: match.url,
        }),
        source_photo_guid: record.guid,
        source_asset_key: match.assetKey,
        source_batch_key: batch?.batchKey || null,
        source_caption: caption || null,
        source_taken_at: takenAt,
        image_url: match.url,
        storage_path: null,
        alt_text: caption ? shortText(caption, 100) : `Project photo ${index + 1}`,
        metadata: {
          sourceType: 'icloud_shared',
          baseUrl,
          importedBy: 'blog-album-sync',
        },
        updated_at: new Date().toISOString(),
      })
    }

    if (!photoRows.length) {
      const globalCandidates = entries
        .map((entry) => {
          const url = buildUrl(entry.item)
          if (!url || !isLikelyImage(url)) return null

          return {
            url,
            assetKey: entry.key,
            score: qualityScore(url),
          }
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)

      const globalByCanonical = new Map()
      for (const candidate of globalCandidates) {
        const dedupe = canonicalUrl(candidate.url)
        if (!globalByCanonical.has(dedupe)) {
          globalByCanonical.set(dedupe, candidate)
        }
      }

      const fallbackRows = [...globalByCanonical.values()].slice(0, 24).map((candidate, index) => ({
        album_id: albumRecord.id,
        dedupe_key: buildDedupeKeyFromGuidOrUrl({
          normalizedGuid: '',
          imageUrl: candidate.url,
        }),
        source_photo_guid: null,
        source_asset_key: candidate.assetKey,
        source_batch_key: newestBatch?.batchKey || null,
        source_caption: newestBatch?.caption || null,
        source_taken_at: parseDate(newestBatch?.createdAt) || null,
        image_url: candidate.url,
        storage_path: null,
        alt_text: `Project photo ${index + 1}`,
        metadata: {
          sourceType: 'icloud_shared',
          baseUrl,
          importedBy: 'blog-album-sync-fallback',
          matchMethod: 'global-fallback',
        },
        updated_at: new Date().toISOString(),
      }))

      photoRows.push(...fallbackRows)
    }

    if (!photoRows.length) {
      res.status(400).json({ error: 'No usable image URLs were found for the album.' })
      return
    }

    const dedupeKeys = [...new Set(photoRows.map((row) => row.dedupe_key))]
    const { data: existingRows, error: existingRowsError } = await supabase
      .from('blog_photos')
      .select('dedupe_key')
      .in('dedupe_key', dedupeKeys)

    if (existingRowsError) {
      res.status(500).json({ error: 'Failed to inspect existing photo rows', details: existingRowsError.message })
      return
    }

    const existingKeySet = new Set((existingRows || []).map((row) => row.dedupe_key))

    const { data: savedPhotos, error: savePhotosError } = await supabase
      .from('blog_photos')
      .upsert(photoRows, { onConflict: 'dedupe_key' })
      .select('id, dedupe_key, source_photo_guid, source_batch_key, source_caption, image_url, alt_text, source_taken_at')

    if (savePhotosError) {
      res.status(500).json({ error: 'Failed to save synced photos', details: savePhotosError.message })
      return
    }

    const importedCount = dedupeKeys.filter((key) => !existingKeySet.has(key)).length
    const updatedCount = photoRows.length - importedCount

    await supabase
      .from('blog_photo_albums')
      .update({
        source_token: token,
        source_base_url: baseUrl,
        last_synced_at: new Date().toISOString(),
        last_sync_status: 'ok',
        last_sync_error: null,
      })
      .eq('id', albumRecord.id)

    const autoCreatePost =
      toBoolean(body.autoCreatePost ?? body.auto_create_post, false) ||
      toBoolean(body.createPost ?? body.create_post, false) ||
      Boolean(albumRecord.auto_publish)

    let generatedPost = null

    if (autoCreatePost && newestBatch && Array.isArray(savedPhotos) && savedPhotos.length > 0) {
      const photosByGuid = new Map(
        savedPhotos
          .filter((photo) => toTrimmedString(photo.source_photo_guid))
          .map((photo) => [normalizeForMatch(photo.source_photo_guid), photo])
      )

      const batchPhotos = newestBatch.normalizedGuids
        .map((guid) => photosByGuid.get(guid))
        .filter(Boolean)

      if (batchPhotos.length > 0) {
        const statusInput = toTrimmedString(body.postStatus || body.post_status || body.status).toLowerCase()
        const status = VALID_STATUSES.has(statusInput) ? statusInput : 'published'

        generatedPost = await createOrUpdatePostForBatch(supabase, {
          batch: newestBatch,
          photos: batchPhotos,
          status,
          authorEmail: adminUser.email,
        })
      }
    }

    res.status(200).json({
      ok: true,
      album: {
        id: albumRecord.id,
        name: albumRecord.name,
        source_url: albumRecord.source_url,
      },
      totalPhotosSeen: photos.length,
      photosRequestedForSync: guidRecordsForSync.length,
      photosWithAssetUrls: photoRows.length,
      imported: importedCount,
      updated: updatedCount,
      newestBatchKey: newestBatch?.batchKey || null,
      generatedPost,
    })
  } catch (error) {
    console.error('blog-album-sync error:', error)
    if (albumIdForError) {
      try {
        await supabase
          .from('blog_photo_albums')
          .update({
            last_synced_at: new Date().toISOString(),
            last_sync_status: 'error',
            last_sync_error: (error?.message || 'Unknown sync error').slice(0, 500),
          })
          .eq('id', albumIdForError)
      } catch (albumUpdateError) {
        console.error('Failed to write album sync error state:', albumUpdateError)
      }
    }

    const message = error?.message || 'Failed to sync album'
    const isAuthError = /auth|authorized|token/i.test(message)
    res.status(isAuthError ? 401 : 400).json({ error: message })
  }
}
