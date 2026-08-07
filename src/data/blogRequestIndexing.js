import { getRouteIndexingState, normalizeRoutePath } from './indexingControls.js'
import {
  BLOG_BUILD_MANIFEST_PATH,
  isBlogRecordInBuildManifest,
} from './blogBuildManifest.js'
import { staticBlogPosts } from './staticBlogPosts.js'

const staticPostBySlug = new Map(staticBlogPosts.map((post) => [post.slug, post]))
const PUBLIC_EDITORIAL_FIELDS =
  'slug,status,seo_status,canonical_slug,updated_at,published_at,created_at'
const LEGACY_PUBLIC_FIELDS = 'slug,status,updated_at,published_at,created_at'
const DEFAULT_LOOKUP_TIMEOUT_MS = 1800

function envValue(env, keys) {
  for (const key of keys) {
    const value = String(env?.[key] || '').trim()
    if (value) return value
  }
  return ''
}

function blogSlugFromPath(pathname) {
  const path = normalizeRoutePath(pathname)
  const match = path.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)
  return match ? { path, slug: match[1] } : null
}

function isMissingEditorialColumnError(error) {
  const code = String(error?.code || '').toUpperCase()
  const details = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  return (
    (code === '42703' || code === 'PGRST204') &&
    /seo_status|canonical_slug/i.test(details)
  )
}

async function responsePayload(response) {
  if (typeof response?.json !== 'function') return null
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function fetchPublishedPost(slug, { env, fetchImpl, signal }) {
  const endpoint = envValue(env, ['SUPABASE_URL', 'VITE_SUPABASE_URL'])
  const key = envValue(env, [
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ])

  if (!endpoint || !key) return { configured: false, record: null }

  const buildRequest = (fields) => {
    const url = new URL('/rest/v1/blog_posts', endpoint)
    url.searchParams.set('select', fields)
    url.searchParams.set('slug', `eq.${slug}`)
    url.searchParams.set('status', 'eq.published')
    url.searchParams.set('limit', '1')
    return url
  }

  const request = async (fields) => {
    const url = buildRequest(fields)
    const response = await fetchImpl(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal,
    })

    const payload = await responsePayload(response)

    if (!response.ok) {
      const error = new Error(
        String(payload?.message || `Blog indexing lookup failed with ${response.status}`),
      )
      error.status = response.status
      error.code = payload?.code
      error.details = payload?.details
      error.hint = payload?.hint
      throw error
    }

    return Array.isArray(payload) ? payload[0] || null : null
  }

  try {
    return { configured: true, record: await request(PUBLIC_EDITORIAL_FIELDS) }
  } catch (error) {
    if (!isMissingEditorialColumnError(error)) throw error
    return { configured: true, record: await request(LEGACY_PUBLIC_FIELDS) }
  }
}

async function fetchBuildManifest(manifestUrl, { fetchImpl, signal }) {
  if (!manifestUrl) throw new Error('Active blog build manifest URL is unavailable')

  const url = new URL(BLOG_BUILD_MANIFEST_PATH, manifestUrl)
  const response = await fetchImpl(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  })
  const payload = await responsePayload(response)

  if (!response.ok || !payload) {
    throw new Error(`Active blog build manifest lookup failed with ${response.status}`)
  }

  return payload
}

function failClosedState(path, reason, record = {}) {
  return {
    ...getRouteIndexingState(path, { ...record, seo_status: 'needs_facts' }),
    reason,
  }
}

export async function resolveBlogRequestIndexing(
  pathname,
  {
    env = globalThis.process?.env || {},
    fetchImpl = globalThis.fetch,
    manifest,
    manifestUrl,
    timeoutMs = DEFAULT_LOOKUP_TIMEOUT_MS,
  } = {},
) {
  const route = blogSlugFromPath(pathname)
  if (!route) return null

  const staticRecord = staticPostBySlug.get(route.slug)
  // Source-managed articles are immutable from the CMS. Their page content,
  // editorial approval, canonical, and robots state ship in one release, so a
  // stale database row cannot re-block or redirect the released source record.
  if (staticRecord?.source_managed) {
    return getRouteIndexingState(route.path, staticRecord)
  }

  if (typeof fetchImpl !== 'function') {
    return failClosedState(route.path, 'request-time-editorial-state-unavailable')
  }

  const controller = new AbortController()
  const safeTimeoutMs = Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0
    ? Number(timeoutMs)
    : DEFAULT_LOOKUP_TIMEOUT_MS
  const timeout = setTimeout(() => controller.abort(), safeTimeoutMs)

  try {
    const lookup = await fetchPublishedPost(route.slug, {
      env,
      fetchImpl,
      signal: controller.signal,
    })
    if (!lookup.configured) {
      return failClosedState(route.path, 'request-time-editorial-state-unavailable')
    }
    if (!lookup.record) {
      return failClosedState(route.path, 'blog-post-not-currently-published')
    }

    const currentState = getRouteIndexingState(route.path, lookup.record)
    if (!currentState.indexable) return currentState

    const activeManifest = manifest !== undefined
      ? manifest
      : await fetchBuildManifest(manifestUrl, {
          fetchImpl,
          signal: controller.signal,
        })

    if (!isBlogRecordInBuildManifest(lookup.record, activeManifest)) {
      return failClosedState(
        route.path,
        'approved-revision-not-in-active-build',
        lookup.record,
      )
    }

    return currentState
  } catch {
    return failClosedState(route.path, 'request-time-editorial-state-unavailable')
  } finally {
    clearTimeout(timeout)
  }
}

export function blogIndexingResponseHeaders(state) {
  if (!state) return {}
  return {
    'X-Robots-Tag': state.robots,
  }
}
