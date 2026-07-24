import { createClient } from '@supabase/supabase-js'

const BLOG_POST_FIELDS =
  'id, title, slug, excerpt, content, cover_image_url, published_at, updated_at, created_at, status'

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

export function mergePublishedBlogPosts(staticPosts = [], remotePosts = []) {
  const bySlug = new Map()

  for (const post of staticPosts) {
    if (isPublishedPost(post)) {
      bySlug.set(post.slug, post)
    }
  }

  for (const post of remotePosts) {
    if (isPublishedPost(post)) {
      const staticPost = bySlug.get(post.slug)
      bySlug.set(post.slug, {
        ...staticPost,
        ...post,
        ...(staticPost?.seo_title ? { seo_title: staticPost.seo_title } : {}),
      })
    }
  }

  return [...bySlug.values()].sort((a, b) => postTimestamp(b) - postTimestamp(a))
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

  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_POST_FIELDS)
    .eq('status', 'published')
    .not('slug', 'is', null)
    .order('published_at', { ascending: false })

  if (error) {
    logger?.warn?.(`Skipping Supabase blog post fetch: ${error.message}`)
    return []
  }

  return (data || []).filter(isPublishedPost)
}
