const BLOG_THEMES = [
  {
    id: 'shop-slabs',
    pattern: /\b(shop|foundation|slab|barndominium|morton|burnet|georgetown|mount calm)\b/i,
  },
  {
    id: 'commercial-sitework',
    pattern: /\b(commercial|circle k|valero|parking|melody grove|sidewalk|accessible|canopy|hospital|zoo)\b/i,
  },
  {
    id: 'drainage-repair',
    pattern: /\b(retaining|shotcrete|drainage|resurface|repair|crack|bank|oncor|hubbard|riesel)\b/i,
  },
  {
    id: 'residential-flatwork',
    pattern: /\b(driveway|patio|stamped|rv pad|magnolia|china spring|walkway)\b/i,
  },
]

function searchablePostText(post = {}) {
  return [post.slug, post.title, post.project_series_id]
    .filter(Boolean)
    .join(' ')
    .replace(/[-_]+/g, ' ')
}

function primaryTheme(post) {
  const text = searchablePostText(post)
  return BLOG_THEMES.find((theme) => theme.pattern.test(text))?.id || 'general'
}

function publishedTime(post = {}) {
  return Date.parse(post.published_at || post.created_at || '') || 0
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => {
    const dateDifference = publishedTime(b) - publishedTime(a)
    return dateDifference || String(a.slug || '').localeCompare(String(b.slug || ''))
  })
}

/**
 * Build a stable peer ring instead of a generic "latest posts" list. The ring
 * gives every article incoming links from nearby articles in the same project
 * family, while the fallback keeps small families connected to the archive.
 */
export function getRelatedBlogPosts(currentPost, posts = [], limit = 3) {
  const currentSlug = String(currentPost?.slug || '')
  if (!currentSlug || limit <= 0) return []

  const eligiblePosts = sortPosts(
    posts.filter((post) => post?.slug && post.slug !== currentSlug),
  )
  const themedPosts = sortPosts(
    posts.filter((post) => post?.slug && primaryTheme(post) === primaryTheme(currentPost)),
  )
  const currentIndex = themedPosts.findIndex((post) => post.slug === currentSlug)
  const selected = []
  const selectedSlugs = new Set([currentSlug])

  if (currentIndex >= 0 && themedPosts.length > 1) {
    const offsets = [1, -1, 2, -2, 3, -3]
    offsets.forEach((offset) => {
      if (selected.length >= limit) return
      const candidateIndex = (currentIndex + offset + themedPosts.length) % themedPosts.length
      const candidate = themedPosts[candidateIndex]
      if (!candidate || selectedSlugs.has(candidate.slug)) return
      selected.push(candidate)
      selectedSlugs.add(candidate.slug)
    })
  }

  eligiblePosts.forEach((candidate) => {
    if (selected.length >= limit || selectedSlugs.has(candidate.slug)) return
    selected.push(candidate)
    selectedSlugs.add(candidate.slug)
  })

  return selected
}
