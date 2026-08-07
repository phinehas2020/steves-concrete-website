// These slugs were repaired after the 2026 authenticity review. The list is
// retained as a content-workflow boundary for the admin/migration code, not as
// an indexing denylist. Indexing is decided only by each record's editorial
// status and canonical target below.
export const REPAIRED_BLOG_SLUGS = Object.freeze([
  'morton-building-barn-dominium-in-chappell-hill-texas',
  'finished-the-burnet-shop-foundation-9600-ft',
  'for-concrete-or-circle-k-lacy-lake-view',
  'shop-foundation-burnet-texas-9600-ft-getting-ready-to-pour-tomorrow-morning-3-am-200-yards',
  'mount-calm-morton-building-shop-foundation-2500-ft',
  'concrete-work-at-magnolia-rv-waco-texas-texas',
  'pouring-sidewalk-city-of-waco',
  'concrete-pour-in-hewitt-texas',
  'concrete-pour-at-cameron-park-zoo',
  'parking-lot-that-we-just-poured-at-melody-grove-housing-complex-waco-texas',
  'resurface-1600-ft-of-old-concrete-in-hubbard-texas',
  'project-update-2026-02-25',
  'shop-foundation-in-georgetown-texas',
  'concrete-retaining-walls-in-resiel-texas-for-oncor-power-transfer-station',
  'we-re-pouring-some-rv-pads-today-at-magnolia-rv',
  'installing-400-feet-of-drainage-channel-in-temple',
  'poured-another-rv-pad-today-in-china-springs',
  'work-completed-today-at-magnolia-rv',
  'adding-handicap-parking-for-melody-grove-housing-in-waco',
])

export function normalizeRoutePath(value) {
  let path = String(value || '/').trim()

  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname
    } catch {
      path = '/'
    }
  } else {
    path = path.split(/[?#]/, 1)[0]
  }

  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/{2,}/g, '/')
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path || '/'
}

function normalizeSeoStatus(record = {}) {
  return String(record.seo_status ?? record.seoStatus ?? '')
    .trim()
    .toLowerCase()
}

function normalizeCanonicalSlug(record = {}) {
  const value = String(record.canonical_slug ?? record.canonicalSlug ?? '')
    .trim()
    .replace(/^\/?blog\//i, '')
    .replace(/^\/+|\/+$/g, '')

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : ''
}

export function getRouteIndexingState(pathname, record = {}) {
  const path = normalizeRoutePath(pathname)
  const seoStatus = normalizeSeoStatus(record)
  const canonicalSlug = path.startsWith('/blog/') ? normalizeCanonicalSlug(record) : ''
  const canonicalPath = canonicalSlug ? `/blog/${canonicalSlug}` : path
  const hasAlternateCanonical = canonicalPath !== path

  // Legacy rows predate the editorial workflow. Keep them indexable. Any new
  // non-empty status must be explicitly approved before it can enter Search.
  // Do not add path-based deny lists here: repaired source records must be able
  // to move back to Search by becoming approved and self-canonical.
  const isEditoriallyApproved = !seoStatus || seoStatus === 'approved'
  const indexable = isEditoriallyApproved && !hasAlternateCanonical

  return {
    path,
    canonicalPath,
    canonicalSlug: canonicalSlug || null,
    seoStatus: seoStatus || null,
    indexable,
    includeInSitemap: indexable && !hasAlternateCanonical,
    robots: indexable ? 'index, follow' : 'noindex, follow',
    reason:
      (!isEditoriallyApproved ? `seo-status-${seoStatus}` : null) ||
      (hasAlternateCanonical ? 'alternate-canonical' : null),
    source: seoStatus ? 'blog editorial workflow' : null,
  }
}

export function resolveRobotsDirective(pathname, requestedRobots = 'index, follow', record = {}) {
  const requested = String(requestedRobots || 'index, follow').trim()

  // Preserve stricter component-level directives for 404/admin states.
  if (/\bnoindex\b/i.test(requested)) return requested

  return getRouteIndexingState(pathname, record).robots
}

export function isRouteSitemapEligible(pathname, record = {}) {
  return getRouteIndexingState(pathname, record).includeInSitemap
}

export function isRoutePubliclyDiscoverable(pathname, record = {}) {
  return getRouteIndexingState(pathname, record).includeInSitemap
}
