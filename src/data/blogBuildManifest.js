import { getRouteIndexingState } from './indexingControls.js'

export const BLOG_BUILD_MANIFEST_PATH = '/blog-indexing-manifest.json'
export const BLOG_BUILD_MANIFEST_VERSION = 1

function clean(value) {
  return String(value || '').trim()
}

export function getBlogBuildFingerprint(post = {}) {
  const slug = clean(post.slug).toLowerCase()
  const status = clean(post.status || 'published').toLowerCase()
  const seoStatus = clean(post.seo_status ?? post.seoStatus).toLowerCase()
  const canonicalSlug = clean(post.canonical_slug ?? post.canonicalSlug).toLowerCase()
  const revision = clean(
    post.updated_at ??
      post.updatedAt ??
      post.published_at ??
      post.publishedAt ??
      post.created_at ??
      post.createdAt,
  )

  return JSON.stringify([slug, status, seoStatus, canonicalSlug, revision])
}

export function createBlogBuildManifest(posts = [], generatedAt = new Date().toISOString()) {
  const builtPosts = {}

  for (const post of posts) {
    const slug = clean(post?.slug).toLowerCase()
    if (!slug) continue

    const indexing = getRouteIndexingState(`/blog/${slug}`, post)
    if (!indexing.indexable) continue

    builtPosts[slug] = getBlogBuildFingerprint(post)
  }

  return {
    version: BLOG_BUILD_MANIFEST_VERSION,
    generatedAt,
    posts: builtPosts,
  }
}

export function isBlogRecordInBuildManifest(post = {}, manifest = null) {
  const slug = clean(post.slug).toLowerCase()
  if (!slug || manifest?.version !== BLOG_BUILD_MANIFEST_VERSION) return false

  return manifest?.posts?.[slug] === getBlogBuildFingerprint(post)
}
