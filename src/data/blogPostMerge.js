export function mergeBlogRecordsWithSourcePrecedence(sourcePosts = [], remotePosts = []) {
  const bySlug = new Map()

  for (const post of sourcePosts) {
    if (post?.slug) bySlug.set(post.slug, post)
  }

  for (const post of remotePosts) {
    if (!post?.slug) continue

    const sourcePost = bySlug.get(post.slug)
    if (sourcePost?.source_managed) continue

    bySlug.set(post.slug, sourcePost ? { ...sourcePost, ...post } : post)
  }

  return [...bySlug.values()]
}
