import { createClient } from '@supabase/supabase-js'
import { mergeBlogRecordsWithSourcePrecedence } from '../src/data/blogPostMerge.js'
import { getRouteIndexingState } from '../src/data/indexingControls.js'

const LEGACY_BLOG_POST_FIELDS =
  'id, title, slug, excerpt, content, cover_image_url, published_at, updated_at, created_at, status'
const EDITORIAL_BLOG_POST_FIELDS = [
  LEGACY_BLOG_POST_FIELDS,
  'seo_status',
  'author_name',
  'reviewed_by',
  'reviewed_at',
  'source_summary',
  'canonical_slug',
  'project_series_id',
  'series_phase',
].join(', ')

function envString(value) {
  if (typeof value !== 'string') return ''
  return value.split('\0').join('').trim()
}

function postTimestamp(post) {
  return Date.parse(post?.published_at || post?.updated_at || post?.created_at || '') || 0
}

function isPublishedPost(post) {
  return Boolean(post?.slug && (!post.status || post.status === 'published'))
}

function isMissingEditorialColumn(error) {
  const message = String(error?.message || '')
  return (
    error?.code === '42703' ||
    error?.code === 'PGRST204' ||
    /column|schema cache/i.test(message) &&
      /seo_status|author_name|reviewed_by|source_summary|canonical_slug|authenticity_data/i.test(
        message,
      )
  )
}

export function getBlogPostIndexingState(post = {}) {
  return getRouteIndexingState(`/blog/${post.slug || ''}`, post)
}

export function isBlogPostIndexable(post = {}) {
  return getBlogPostIndexingState(post).indexable
}

export function isBlogPostListingEligible(post = {}) {
  return getBlogPostIndexingState(post).includeInSitemap
}

export function mergePublishedBlogPosts(staticPosts = [], remotePosts = []) {
  const publishedStatic = staticPosts.filter(isPublishedPost)
  const publishedRemote = remotePosts.filter(isPublishedPost)

  return mergeBlogRecordsWithSourcePrecedence(publishedStatic, publishedRemote)
    .map((post) => {
      const staticPost = publishedStatic.find((candidate) => candidate.slug === post.slug)
      return staticPost?.seo_title ? { ...post, seo_title: staticPost.seo_title } : post
    })
    .sort((a, b) => postTimestamp(b) - postTimestamp(a))
}

export async function fetchPublishedBlogPosts({
  env = globalThis.process?.env || {},
  logger = console,
} = {}) {
  const supabaseUrl = envString(env.SUPABASE_URL || env.VITE_SUPABASE_URL)
  const supabaseKey = envString(
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      env.VITE_SUPABASE_ANON_KEY ||
      env.SUPABASE_ANON_KEY ||
      env.SUPABASE_SERVICE_ROLE_KEY,
  )

  if (!supabaseUrl || !supabaseKey) {
    logger?.warn?.('Skipping Supabase blog post fetch: Supabase env vars are not set.')
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const selectPublishedPosts = (fields) =>
    supabase
      .from('blog_posts')
      .select(fields)
      .eq('status', 'published')
      .not('slug', 'is', null)
      .order('published_at', { ascending: false })

  let { data, error } = await selectPublishedPosts(EDITORIAL_BLOG_POST_FIELDS)

  if (error && isMissingEditorialColumn(error)) {
    logger?.warn?.(
      'Blog editorial columns are not available yet; retrying with the legacy published-post fields.',
    )
    ;({ data, error } = await selectPublishedPosts(LEGACY_BLOG_POST_FIELDS))
  }

  if (error) {
    logger?.warn?.(`Skipping Supabase blog post fetch: ${error.message}`)
    return []
  }

  return (data || []).filter(isPublishedPost)
}
